from django.db import models
from django.utils.text import slugify


class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True, db_index=True)
    description = models.TextField()
    purity = models.CharField(max_length=100, blank=True)
    specifications = models.JSONField(default=dict, help_text="Product specifications as key-value pairs")
    applications = models.TextField(help_text="Comma-separated applications")
    industries = models.TextField(help_text="Comma-separated industries served")
    packaging = models.CharField(max_length=200)
    hs_code = models.CharField(max_length=50, blank=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    featured = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    def get_applications_list(self):
        return [app.strip() for app in self.applications.split(',')]
    
    def get_industries_list(self):
        return [ind.strip() for ind in self.industries.split(',')]


class Industry(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=100, blank=True, help_text="Emoji or icon class")
    image = models.ImageField(upload_to='industries/', blank=True, null=True, help_text="Industry card image")
    stat_products = models.CharField(max_length=50, default="100+ Products", help_text="e.g., '200+ Products'")
    stat_badge = models.CharField(max_length=50, default="Fast Delivery", help_text="e.g., 'ISO Certified', 'Fast Delivery'")
    stat_badge_icon = models.CharField(max_length=20, default="⚡", help_text="Emoji for badge, e.g., ⚡, ✓")
    order = models.IntegerField(default=0, db_index=True)
    active = models.BooleanField(default=True, db_index=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = "Industries"
    
    def __str__(self):
        return self.name


class FAQ(models.Model):
    question = models.CharField(max_length=500)
    answer = models.TextField()
    order = models.IntegerField(default=0)
    active = models.BooleanField(default=True, db_index=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"
    
    def __str__(self):
        return self.question


class ContactInquiry(models.Model):
    name = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    product = models.CharField(max_length=200)
    quantity = models.CharField(max_length=100)
    payment_terms = models.CharField(max_length=100)
    message = models.TextField()
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Contact Inquiries"
    
    def __str__(self):
        return f"{self.name} - {self.company} ({self.created_at.strftime('%Y-%m-%d')})"
