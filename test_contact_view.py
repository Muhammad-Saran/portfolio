import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE','portfolio.settings')
import django
django.setup()
from django.test import Client

c = Client()
resp = c.post('/contact/', {
    'name': 'Tester',
    'email': 'tester@example.com',
    'subject': 'UnitTest',
    'message': 'Hello from test script.'
})
print('Status code:', resp.status_code)
print('Content-Type:', resp['Content-Type'])
print('Body:', resp.content.decode('utf-8'))
