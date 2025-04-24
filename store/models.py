# models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class CustomUser(AbstractUser):
    is_vendor = models.BooleanField(default=False)
    phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.username

class Product(models.Model):
    vendor = models.ForeignKey(CustomUser, related_name='products', on_delete=models.CASCADE, null=True)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=0)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    stock = models.IntegerField(default=0)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/')

    def __str__(self):
        return f"Imagen de {self.product.name}"

class Cart(models.Model):
    """
    Un carrito puede estar asociado a un usuario autenticado (user)
    o a una sesión anónima (session_key). session_key debe ser único
    para que cada sesión tenga su propio carrito.
    """
    user = models.OneToOneField(
        CustomUser,
        related_name='cart',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    session_key = models.CharField(
        max_length=40,
        unique=True,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        owner = self.user.username if self.user else f"Invitado ({self.session_key})"
        return f"Carrito de {owner}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} × {self.product.name}"

User = get_user_model()

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    total_price = models.DecimalField(max_digits=10, decimal_places=0, default=0)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        user = self.user.username if self.user else "Invitado"
        return f"Orden {self.id} de {user}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=0)

    def __str__(self):
        return f"{self.quantity} × {self.product.name} en orden {self.order.id}"
