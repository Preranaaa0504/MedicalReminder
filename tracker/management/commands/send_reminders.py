from django.core.management.base import BaseCommand
from tracker.models import Purchase
from django.core.mail import send_mail
from datetime import date
from django.conf import settings

class Command(BaseCommand):
    help = 'Send reminder emails for medicine refills'

    def handle(self, *args, **kwargs):
        today = date.today()
        purchases = Purchase.objects.all()

        for purchase in purchases:
            if purchase.days_left == 2:
                # Email to patient
                subject = f"Reminder: {purchase.medicine.name} is running low"
                message = (
                    f"Dear {purchase.patient.name},\n\n"
                    f"This is a reminder that your medicine '{purchase.medicine.name}' "
                    f"will run out in 2 days on {purchase.expected_finish_date}.\n\n"
                    f"Please make sure to restock it.\n\n"
                    f"Thanks,\nMedicine Reminder System"
                )
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [purchase.patient.contact_email])
                self.stdout.write(f"Reminder sent to {purchase.patient.contact_email}")

                # Email to admin (optional)
                admin_email = getattr(settings, 'ADMIN_EMAIL', None)
                if admin_email:
                    admin_subject = f"[ALERT] {purchase.patient.name}'s medicine ends in 2 days"
                    admin_msg = (
                        f"Patient: {purchase.patient.name}\n"
                        f"Medicine: {purchase.medicine.name}\n"
                        f"Will run out in 2 days on: {purchase.expected_finish_date}\n"
                        f"Daily dosage: {purchase.daily_dosage}\n"
                        f"Quantity: {purchase.quantity}"
                    )
                    send_mail(admin_subject, admin_msg, settings.DEFAULT_FROM_EMAIL, [admin_email])
                    self.stdout.write(f"Admin notified at {admin_email}")
