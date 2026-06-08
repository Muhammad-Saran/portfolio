import os
import sys
import traceback

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio.settings')
import django
django.setup()

from django.conf import settings
from django.core.mail import send_mail

print('EMAIL_HOST:', settings.EMAIL_HOST)
print('EMAIL_PORT:', settings.EMAIL_PORT)
print('EMAIL_USE_TLS:', settings.EMAIL_USE_TLS)
print('EMAIL_HOST_USER:', settings.EMAIL_HOST_USER)
print('DEFAULT_FROM_EMAIL:', settings.DEFAULT_FROM_EMAIL)
print('CONTACT_EMAIL:', settings.CONTACT_EMAIL)

try:
    res = send_mail('Test from portfolio', 'This is a test email from local dev.', settings.DEFAULT_FROM_EMAIL, [settings.CONTACT_EMAIL])
    print('send_mail returned:', res)
except Exception:
    print('Exception when sending:')
    traceback.print_exc()
    sys.exit(1)
else:
    print('Email send attempted successfully (check inbox).')
