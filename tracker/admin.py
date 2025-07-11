from django.contrib import admin
from .models import Patient, Medicine, Purchase

admin.site.register(Patient)
admin.site.register(Medicine)
admin.site.register(Purchase)
