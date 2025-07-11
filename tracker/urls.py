from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, PatientViewSet, MedicineViewSet, PurchaseViewSet

router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'medicines', MedicineViewSet)
router.register(r'purchases', PurchaseViewSet)

urlpatterns = [
    path('login/', LoginView.as_view()),
    path('', include(router.urls)),
]
