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
class CreatePaymentPreferenceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        try:
            total = float(request.data.get('total', 0))
            if total <= 0:
                return Response({'error': 'El total debe ser mayor a 0.'}, status=400)
            
            sdk = mercadopago.SDK(settings.MERCADO_PAGO_ACCESS_TOKEN)
            
            unit_price = int(round(total))

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
                    "email": request.user.email or "comprador@test.com"
                },
                "back_urls": {
                "success": "https://codestorebl.com/success",
                "failure": "https://codestorebl.com/failure",
                "pending": "https://codestorebl.com/pending"
                },
                "auto_return": "approved",
            }

            preference_response = sdk.preference().create(preference_data)

            if preference_response['status'] != 201:
                return Response({'error': 'Mercado Pago Error', 'details': preference_response}, status=500)

            preference = preference_response["response"]
            return Response({"init_point": preference["init_point"]}, status=200)

        except Exception as e:
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
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart

# Crear y listar órdenes de usuario
class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        cart = Cart.objects.get(user=self.request.user)
        total = 0
        for cart_item in cart.items.all():
            total += cart_item.product.price * cart_item.quantity
        
        order = serializer.save(
            user=self.request.user,
            total_price=total,
            address=self.request.data.get('addressLine1', ''),
            city=self.request.data.get('city', ''),
            postal_code=self.request.data.get('postalCode', ''),
            country=self.request.data.get('country', ''),
            phone_number=self.request.data.get('phoneNumber', ''),
            status='pending'
        )

        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )

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
class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        if not product_id:
            return Response({"error": "Product ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
        cart, created = Cart.objects.get_or_create(user=request.user)
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
    permission_classes = [IsAuthenticated]

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
        })