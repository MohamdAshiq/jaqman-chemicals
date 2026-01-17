from django.urls import path
from django_distill import distill_path
from . import views
from .distill import get_all_products

urlpatterns = [
    # Static pages (no generator needed)
    distill_path('', views.home, name='home'),
    distill_path('about/', views.about, name='about'),
    distill_path('products/', views.products_list, name='products'),
    distill_path('industries/', views.industries_view, name='industries'),
    distill_path('resources/', views.resources, name='resources'),
    distill_path('contact/', views.contact, name='contact'),
    
    # Dynamic pages (generator required)
    distill_path(
        'products/<slug:slug>/',
        views.product_detail,
        name='product_detail',
        distill_func=get_all_products,
    ),
]
