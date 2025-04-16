# store/urls.py
from django.urls import path, include
from rest_framework import routers
from .views import (
    CategoryViewSet, 
    ProductViewSet, 
    CartDetailView, 
    OrderListCreateView, 
    AddToCartView,
    CreatePaymentPreferenceView,
    CartItemDetailView,
    CurrentUserView
)

router = routers.DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('user/', CurrentUserView.as_view(), name='current-user'),
    path('cart/', CartDetailView.as_view(), name='cart-detail'),
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('create-payment-preference/', CreatePaymentPreferenceView.as_view(), name='create-payment-preference'),
    path('add-to-cart/', AddToCartView.as_view(), name='add-to-cart'),
    path('cartitem/<int:pk>/', CartItemDetailView.as_view(), name='cartitem-detail'),
    path('user/', CurrentUserView.as_view(), name='current-user'),  # esta es la ruta añadida
]
