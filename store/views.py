# store/views.py
from rest_framework import viewsets, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import mercadopago
from django.views.decorators.csrf import csrf_exempt

from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import UserRegistrationSerializer
from .models import Category, OrderItem, Product, Cart, Order, CartItem, User
from .serializers import (
    CategorySerializer, 
    ProductSerializer, 
    CartSerializer, 
    OrderSerializer,
    UserRegistrationSerializer,
    CartItemSerializer
)

# Vista para obtener usuario actual
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"username": request.user.username})

# Vista Mercado Pago
import logging

from rest_framework.permissions import AllowAny

class CreatePaymentPreferenceView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        logger = logging.getLogger(__name__)
        try:
            total = float(request.data.get('total', 0))
            logger.info(f"Received total for payment preference: {total}")
            if total <= 0:
                logger.error("Total is less or equal to 0")
                return Response({'error': 'El total debe ser mayor a 0.'}, status=400)
            
            sdk = mercadopago.SDK(settings.MERCADO_PAGO_ACCESS_TOKEN)
            
            unit_price = int(round(total))

            # Use email from request if authenticated, else use a default guest email
            payer_email = "guest@example.com"
            if request.user and request.user.is_authenticated:
                payer_email = request.user.email or payer_email

            preference_data = {
                "items": [
                    {
                        "title": "Orden de E-commerce",
                        "quantity": 1,
                        "currency_id": "CLP",
                        "unit_price": unit_price,
                    }
                ],
                "payer": {
                    "email": payer_email
                },
                "back_urls": {
                    "success": "https://codestorebl.com/success",
                    "failure": "https://codestorebl.com/failure",
                    "pending": "https://codestorebl.com/pending"
                },
                "auto_return": "approved",
            }

            preference_response = sdk.preference().create(preference_data)
            logger.info(f"Mercado Pago preference response: {preference_response}")

            if preference_response['status'] != 201:
                logger.error(f"Mercado Pago Error: {preference_response}")
                return Response({'error': 'Mercado Pago Error', 'details': preference_response}, status=500)

            preference = preference_response["response"]
            return Response({"init_point": preference["init_point"]}, status=200)

        except Exception as e:
            logger.exception("Exception in CreatePaymentPreferenceView")
            return Response({'error': str(e)}, status=500)

# ViewSets
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# Detalle carrito usuario autenticado
class CartDetailView(generics.RetrieveUpdateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        if self.request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=self.request.user)
        else:
            session_key = self.request.session.session_key
            if not session_key:
                self.request.session.create()
                session_key = self.request.session.session_key
            cart, created = Cart.objects.get_or_create(session_key=session_key, user=None)
        return cart

# Crear y listar órdenes de usuario
class OrderListCreateView(generics.ListCreateAPIView):
    """
    Listado y creación de órdenes. 
    * Cualquiera puede crear (AllowAny).
    * Si el usuario está autenticado, la orden se asocia a él.
    * Si es invitado, se asocia a la session_key.
    """
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Order.objects.filter(user=user)
        return Order.objects.none()

    def perform_create(self, serializer):
        # Aseguramos session_key
        session_key = self.request.session.session_key
        if not session_key:
            self.request.session.create()
            session_key = self.request.session.session_key

        # Obtenemos el carrito: por usuario o por sesión
        if self.request.user.is_authenticated:
            cart, _ = Cart.objects.get_or_create(user=self.request.user)
            order_user = self.request.user
        else:
            cart, _ = Cart.objects.get_or_create(session_key=session_key, user=None)
            order_user = None

        # Calculamos total de la orden
        total = sum(item.product.price * item.quantity for item in cart.items.all())

        # Creamos la orden
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

        # Creamos los OrderItem correspondientes
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )
        else:
            # For anonymous users, handle order creation differently or reject
            return Response({'error': 'Authentication required to create orders.'}, status=401)

# Registro usuario
CustomUser = get_user_model()

@method_decorator(csrf_exempt, name='dispatch')
class UserRegistrationView(generics.CreateAPIView):
    """ Crea un nuevo usuario sin requerir autenticación previa. """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Añadir producto al carrito
from rest_framework.permissions import AllowAny

class AddToCartView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        if not product_id:
            return Response({"error": "Product ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
        
        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)
        else:
            session_key = request.session.session_key
            if not session_key:
                request.session.create()
                session_key = request.session.session_key
            cart, created = Cart.objects.get_or_create(session_key=session_key, user=None)
        
        cart_item, item_created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not item_created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()
        return Response({
            "success": "Product added to cart.",
            "cart_item": {
                "id": cart_item.id,
                "product": product.name,
                "quantity": cart_item.quantity
            }
        }, status=status.HTTP_200_OK)

# Modificar ítem específico carrito
class CartItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        obj = super().get_object()
        if self.request.user.is_authenticated:
            # Ensure the cart item belongs to the user's cart
            if obj.cart.user != self.request.user:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("No tienes permiso para acceder a este ítem.")
        else:
            # For anonymous users, check session_key matches
            session_key = self.request.session.session_key
            if not session_key or obj.cart.session_key != session_key:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("No tienes permiso para acceder a este ítem.")
        return obj

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
        })