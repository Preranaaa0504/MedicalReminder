from rest_framework import serializers
from .models import Patient, Medicine, Purchase

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = '__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    medicine = MedicineSerializer(read_only=True)
    patient_id = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all(), write_only=True, source='patient')
    medicine_id = serializers.PrimaryKeyRelatedField(queryset=Medicine.objects.all(), write_only=True, source='medicine')

    class Meta:
        model = Purchase
        fields = [
            'id', 'patient', 'medicine',
            'patient_id', 'medicine_id',
            'quantity', 'daily_dosage',
            'purchase_date', 'expected_finish_date',
            'days_left'
        ]
        read_only_fields = ['expected_finish_date', 'days_left']
