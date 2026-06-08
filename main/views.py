from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import send_mail, EmailMessage
from django.conf import settings


def index(request):
    """Render the main portfolio page."""
    return render(request, 'main/index.html')


def send_contact(request):
    """Handle contact form submission and send email to Gmail."""
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Invalid request.'}, status=405)

    name    = request.POST.get('name', '').strip()
    email   = request.POST.get('email', '').strip()
    subject = request.POST.get('subject', '').strip()
    message = request.POST.get('message', '').strip()

    if not all([name, email, subject, message]):
        return JsonResponse({'status': 'error', 'message': 'All fields are required.'}, status=400)

    full_subject = f"[Portfolio Contact] {subject}"
    full_message = (
        f"New message from your portfolio contact form:\n\n"
        f"Name:    {name}\n"
        f"Email:   {email}\n"
        f"Subject: {subject}\n\n"
        f"Message:\n{message}\n\n"
        f"---\nReply directly to: {email}"
    )

    try:
        # Use EmailMessage so we can set reply_to reliably
        msg = EmailMessage(
            subject=full_subject,
            body=full_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.CONTACT_EMAIL],
            reply_to=[email],
        )
        msg.send(fail_silently=False)
        return JsonResponse({'status': 'ok', 'message': 'Message sent successfully!'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f'Failed to send: {str(e)}'}, status=500)
