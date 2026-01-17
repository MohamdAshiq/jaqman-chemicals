from django.conf import settings
import os


def contact_info(request):
    """Make contact information available in all templates."""
    return {
        'CONTACT_PHONE': settings.CONTACT_PHONE,
        'WHATSAPP_NUMBER': settings.WHATSAPP_NUMBER,
        'CONTACT_EMAIL': settings.CONTACT_EMAIL,
        'WEB3FORMS_ACCESS_KEY': os.environ.get('WEB3FORMS_ACCESS_KEY', ''),
        'SITE_BASE_URL': getattr(settings, 'SITE_BASE_URL', ''),
    }
