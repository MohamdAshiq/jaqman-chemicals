"""
Jaqman Chemicals - Views
Clean views for static site generation with django-distill.
"""
from django.shortcuts import render, get_object_or_404
from .models import Product, Industry, FAQ


def home(request):
    """Homepage view with featured products and industries."""
    featured_products = Product.objects.filter(featured=True)[:6]
    industries = Industry.objects.all()[:6]
    context = {
        'featured_products': featured_products,
        'industries': industries,
    }
    return render(request, 'home.html', context)


def about(request):
    """About page view."""
    return render(request, 'about.html')


def products_list(request):
    """List all products."""
    products = Product.objects.all()
    context = {
        'products': products,
    }
    return render(request, 'products.html', context)


def product_detail(request, slug):
    """Product detail view."""
    product = get_object_or_404(Product, slug=slug)
    related_products = Product.objects.exclude(id=product.id)[:4]
    context = {
        'product': product,
        'related_products': related_products,
    }
    return render(request, 'product_detail.html', context)


def industries_view(request):
    """Industries page view."""
    industries = Industry.objects.all()
    context = {
        'industries': industries,
    }
    return render(request, 'industries.html', context)


def resources(request):
    """Resources page with FAQs."""
    faqs = FAQ.objects.filter(active=True)
    context = {
        'faqs': faqs,
    }
    return render(request, 'resources.html', context)


def contact(request):
    """Contact page - form handled by Web3Forms (static site compatible)."""
    products = Product.objects.all()
    context = {
        'products': products,
    }
    return render(request, 'contact.html', context)
