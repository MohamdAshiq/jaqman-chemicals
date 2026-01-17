"""
Django Distill URL Generators

These functions generate all possible URL parameters for dynamic routes,
allowing django-distill to create static HTML pages for each item.
"""
from .models import Product


def get_all_products():
    """
    Generator for all product detail pages.
    Yields dict with 'slug' key for each product.
    """
    for product in Product.objects.all():
        yield {'slug': product.slug}
