from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, PatientViewSet, MedicineViewSet, PurchaseViewSet, home_view

router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'medicines', MedicineViewSet)
router.register(r'purchases', PurchaseViewSet)

urlpatterns = [
    path('', home_view, name='home'),  # Add this for the home page
    path('login/', LoginView.as_view(), name='login'),
    path('api/', include(router.urls)),  # Move API routes under 'api/' prefix
]