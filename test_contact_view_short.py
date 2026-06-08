import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE','portfolio.settings')
import django
django.setup()
from django.test import Client

c = Client()
resp = c.post('/contact/', {'name':'T','email':'t@example.com','subject':'s','message':'m'})
print('STATUS:', resp.status_code)
body = resp.content.decode('utf-8', errors='replace')
print('BODY (first 2000 chars):')
print(body[:2000])
