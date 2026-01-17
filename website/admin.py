from django.contrib import admin
from .models import Product, Industry, FAQ, ContactInquiry


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'purity', 'featured', 'created_at']
    list_filter = ['featured', 'created_at']
    search_fields = ['name', 'description', 'applications']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['featured']
    fieldsets = (
        ('Basic Information', {'fields': ('name', 'slug', 'description', 'purity')}),
        ('Specifications', {'fields': ('specifications', 'applications', 'industries', 'packaging', 'hs_code')}),
        ('Media', {'fields': ('image', 'featured')}),
    )


@admin.register(Industry)
class IndustryAdmin(admin.ModelAdmin):
    list_display = ['name', 'stat_products', 'stat_badge', 'order', 'active']
    list_editable = ['order', 'active']
    list_filter = ['active']
    search_fields = ['name', 'description']
    fieldsets = (
        ('Basic Information', {'fields': ('name', 'description', 'icon')}),
        ('Media', {'fields': ('image',)}),
        ('Stats & Badges', {'fields': ('stat_products', 'stat_badge', 'stat_badge_icon')}),
        ('Display', {'fields': ('order', 'active')}),
    )


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'active', 'order']
    list_editable = ['active', 'order']
    list_filter = ['active']
    search_fields = ['question', 'answer']


@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ['name', 'company', 'country', 'product', 'created_at']
    list_filter = ['country', 'created_at']
    search_fields = ['name', 'company', 'product', 'message']
    readonly_fields = ['created_at']
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
