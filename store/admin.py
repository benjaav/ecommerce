from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    Category,
    CustomUser,
    Product,
    ProductImage,
    Cart,
    CartItem,
    Order,
    OrderItem,
)

# Registro para Category con opciones de búsqueda y listado
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

# Registro para CustomUser usando el UserAdmin de Django y agregando los campos extra (phone, is_vendor)
class CustomUserAdmin(UserAdmin):
    list_display = (
        'username', 'email', 'first_name', 'last_name', 
        'is_vendor', 'phone', 'is_staff', 'is_active'
    )
    # Extender los fieldsets para incluir los nuevos campos en la vista de detalles
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('phone', 'is_vendor')}),
    )
    # Extender los add_fieldsets en la creación de un nuevo usuario
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('phone', 'is_vendor')}),
    )
    search_fields = ('username', 'email', 'first_name', 'last_name')

# Registro para Product con opciones de listado y filtrado
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'vendor', 'category', 'price', 
        'discount_price', 'stock', 'available', 
        'created_at', 'updated_at'
    )
    list_filter = ('available', 'category', 'vendor')
    search_fields = ('name', 'description')
    ordering = ('-created_at',)


# Registro para ProductImage para ver el producto y la imagen asociada
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image')
    list_filter = ('product',)

# Registro para Cart
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    search_fields = ('user__username',)

# Registro para CartItem
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'product', 'quantity')
    list_filter = ('cart', 'product')
    search_fields = ('cart__user__username', 'product__name')

# Registro para Order con filtros y búsqueda
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'created_at', 'status')
    list_filter = ('status', 'created_at', 'user')
    search_fields = ('user__username',)

# Registro para OrderItem
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')
    list_filter = ('order', 'product')
    search_fields = ('order__id', 'product__name')

# Registramos todos los modelos en el admin
admin.site.register(Category, CategoryAdmin)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(ProductImage, ProductImageAdmin)
admin.site.register(Cart, CartAdmin)
admin.site.register(CartItem, CartItemAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
