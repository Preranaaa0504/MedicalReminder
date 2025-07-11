from django.db import models
from datetime import date, timedelta

class Patient(models.Model):
    name = models.CharField(max_length=100)
    contact_email = models.EmailField()
    mobile = models.CharField(max_length=15)


    def __str__(self):
        return self.name

class Medicine(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Purchase(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    daily_dosage = models.PositiveIntegerField()
    purchase_date = models.DateField()

    @property
    def expected_finish_date(self):
        days = self.quantity / self.daily_dosage
        return self.purchase_date + timedelta(days=days)

    @property
    def days_left(self):
        return (self.expected_finish_date - date.today()).days

    def __str__(self):
        return f"{self.patient.name} - {self.medicine.name}"
