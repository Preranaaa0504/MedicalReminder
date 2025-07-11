import { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Paper, InputAdornment, CircularProgress } from '@mui/material';
import { Person, Phone, MedicalServices, Numbers, Event } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

function AddPatient() {
  const [form, setForm] = useState({
    patient_name: '',
    mobile: '',
    medicine_name: '',
    quantity: '',
    daily_dosage: '',
    purchase_date: '',
  });
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create patient
      const patientRes = await axios.post('http://127.0.0.1:8000/api/patients/', {
        name: form.patient_name,
        contact_email: `${form.patient_name.toLowerCase().replace(/ /g, '')}@mail.com`,
        mobile: form.mobile,
      });

      // 2. Create medicine
      const medRes = await axios.post('http://127.0.0.1:8000/api/medicines/', {
        name: form.medicine_name,
      });

      // 3. Create purchase
      await axios.post('http://127.0.0.1:8000/api/purchases/', {
        patient_id: patientRes.data.id,
        medicine_id: medRes.data.id,
        quantity: parseInt(form.quantity),
        daily_dosage: parseInt(form.daily_dosage),
        purchase_date: form.purchase_date,
      });

      enqueueSnackbar('Patient added successfully!', { variant: 'success' });
      setForm({
        patient_name: '',
        mobile: '',
        medicine_name: '',
        quantity: '',
        daily_dosage: '',
        purchase_date: '',
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to add patient. Please check the form data.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 4 }}>
          Register New Patient
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            name="patient_name"
            label="Patient Name"
            value={form.patient_name}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="primary" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          
          <TextField
            name="mobile"
            label="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone color="primary" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          
          <TextField
            name="medicine_name"
            label="Medicine Name"
            value={form.medicine_name}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MedicalServices color="primary" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name="quantity"
              label="Quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Numbers color="primary" />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
            
            <TextField
              name="daily_dosage"
              label="Daily Dosage"
              type="number"
              value={form.daily_dosage}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Numbers color="primary" />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </Box>
          
          <TextField
            name="purchase_date"
            label="Purchase Date"
            type="date"
            value={form.purchase_date}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Event color="primary" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 2, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Patient'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default AddPatient;