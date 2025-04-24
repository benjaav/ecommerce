# store/views.py

import logging

from django.conf import settings
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework import viewsets, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import (
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
    AllowAny
)
from django.contrib.auth import get_user_model

import mercadopago

from .models import Category, Product, Cart, CartItem, Order, OrderItem
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    CartSerializer,
    CartItemSerializer,
    OrderSerializer,
    UserRegistrationSerializer
)

# Logger para esta vista
logger = logging.getLogger(__name__)
User = get_user_model()


class CurrentUserView(APIView):
    """
    Devuelve usuario autenticado.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
        })


class CreatePaymentPreferenceView(APIView):
    """
    Crea preferencia de pago en Mercado Pago.
    Permite acceso anónimo.
    """
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        try:
            total = float(request.data.get('total', 0))
            if total <= 0:
                return Response(
                    {'error': 'El total debe ser mayor a 0.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            sdk = mercadopago.SDK(settings.MERCADO_PAGO_ACCESS_TOKEN)
            unit_price = int(round(total))

            payer_email = "guest@example.com"
            if request.user.is_authenticated:
                payer_email = request.user.email or payer_email

            preference_data = {
                "items": [{
                    "title": "Orden de E-commerce",
                    "quantity": 1,
                    "currency_id": "CLP",
                    "unit_price": unit_price,
                }],
                "payer": {"email": payer_email},
                "back_urls": {
                    "success": "https://codestorebl.com/success",
                    "failure": "https://codestorebl.com/failure",
                    "pending": "https://codestorebl.com/pending"
                },
                "auto_return": "approved",
            }

            resp = sdk.preference().create(preference_data)
            if resp.get('status') != 201:
                logger.error(f"Mercado Pago Error: {resp}")
                return Response(
                    {'error': 'Error en Mercado Pago'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            init_point = resp["response"]["init_point"]
            return Response({"init_point": init_point}, status=200)

        except Exception as e:
            logger.exception("Error creando preferencia MP")
            return Response({'error': str(e)}, status=500)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    CRUD de categorías.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class ProductViewSet(viewsets.ModelViewSet):
    """
    CRUD de productos.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class CartDetailView(generics.RetrieveUpdateAPIView):
    """
    Recupera o actualiza el carrito (usuario o sesión anónima).
    """
    serializer_class = CartSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        if self.request.user.is_authenticated:
            cart, _ = Cart.objects.get_or_create(user=self.request.user)
        else:
            session_key = self.request.session.session_key
            if not session_key:
                self.request.session.create()
                session_key = self.request.session.session_key
            cart, _ = Cart.objects.get_or_create(session_key=session_key, user=None)
        return cart


class AddToCartView(APIView):
    """
    Añade un producto al carrito (autenticado o invitado).
    """
    permission_classes = [AllowAny]

    def post(self, request):
        prod_id = request.data.get('product_id')
        qty = int(request.data.get('quantity', 1))
        if not prod_id:
            return Response({"error": "product_id es requerido."},
                            status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=prod_id)

        if request.user.is_authenticated:
            cart, _ = Cart.objects.get_or_create(user=request.user)
        else:
            session_key = request.session.session_key
            if not session_key:
                request.session.create()
                session_key = self.request.session.session_key
            cart, _ = Cart.objects.get_or_create(session_key=session_key, user=None)

        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        item.quantity = item.quantity + qty if not created else qty
        item.save()

        return Response({
            "success": True,
            "cart_item": {"id": item.id, "quantity": item.quantity}
        }, status=200)


class CartItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Recupera, actualiza o elimina un ítem del carrito.
    """
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        obj = super().get_object()
        if self.request.user.is_authenticated:
            if obj.cart.user != self.request.user:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("No tienes permiso para este ítem.")
        else:
            session_key = self.request.session.session_key
            if not session_key or obj.cart.session_key != session_key:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("No tienes permiso para este ítem.")
        return obj


class OrderListCreateView(generics.ListCreateAPIView):
    """
    Listado y creación de órdenes:
     - AllowAny: cualquiera puede crear.
     - Autenticados → orden.user.
     - Invitados → orden.user=None, asociada a session_key.
    """
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Order.objects.filter(user=self.request.user)
        return Order.objects.none()

    def perform_create(self, serializer):
        # Asegura session_key
        session_key = self.request.session.session_key
        if not session_key:
            self.request.session.create()
            session_key = self.request.session.session_key

        # Recupera o crea carrito
        if self.request.user.is_authenticated:
            cart, _ = Cart.objects.get_or_create(user=self.request.user)
            order_user = self.request.user
        else:
            cart, _ = Cart.objects.get_or_create(session_key=session_key, user=None)
            order_user = None

        # Calcula total
        total = sum(i.product.price * i.quantity for i in cart.items.all())

        # Crea la orden
        order = serializer.save(
            user=order_user,
            total_price=total,
            address=self.request.data.get('addressLine1', ''),
            city=self.request.data.get('city', ''),
            postal_code=self.request.data.get('postalCode', ''),
            country=self.request.data.get('country', ''),
            phone_number=self.request.data.get('phoneNumber', ''),
            status='pending'
        )

        # Crea los ítems de la orden
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )


@method_decorator(csrf_exempt, name='dispatch')
class UserRegistrationView(generics.CreateAPIView):
    """
    Registra un nuevo usuario sin requerir auth previa.
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
