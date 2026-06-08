import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE','portfolio.settings')
import django
django.setup()
from django.test import Client

c = Client()
resp = c.post('/contact/', {'name':'T','email':'t@example.com','subject':'s','message':'m'}, HTTP_HOST='localhost')
print('STATUS:', resp.status_code)
print('CONTENT-TYPE:', resp['Content-Type'])
print('BODY:', resp.content.decode('utf-8')[:2000])
