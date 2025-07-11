import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  IconButton,
  CircularProgress,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { 
  Delete, 
  Edit, 
  Refresh, 
  PersonAdd, 
  LocalHospital, 
  EventAvailable,
  Warning
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';

function Dashboard() {
  const [purchases, setPurchases] = useState([]);
  const [stats, setStats] = useState({ patients: 0, medicines: 0, critical: 0 });
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [purchasesRes, patientsRes, medicinesRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/purchases/', { withCredentials: true }),
        axios.get('http://127.0.0.1:8000/api/patients/', { withCredentials: true }),
        axios.get('http://127.0.0.1:8000/api/medicines/', { withCredentials: true })
      ]);

      setPurchases(purchasesRes.data);
      
      const criticalAlerts = purchasesRes.data.filter(p => {
        const finishDate = dayjs(p.expected_finish_date);
        return finishDate.diff(dayjs(), 'day') <= 2;
      }).length;

      setStats({
        patients: patientsRes.data.length,
        medicines: medicinesRes.data.length,
        critical: criticalAlerts
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      enqueueSnackbar('Failed to load dashboard data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this purchase record?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/purchases/${id}/`, { withCredentials: true });
        enqueueSnackbar('Record deleted successfully', { variant: 'success' });
        fetchData();
      } catch (err) {
        enqueueSnackbar('Failed to delete record', { variant: 'error' });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Patients
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h3" component="div">
                  {stats.patients}
                </Typography>
                <PersonAdd color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Medicines in Use
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h3" component="div">
                  {stats.medicines}
                </Typography>
                <LocalHospital color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: '100%', borderLeft: '4px solid #ff9800' }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Critical Alerts
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h3" component="div">
                  {stats.critical}
                </Typography>
                <Warning color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions Bar */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        gap: 2
      }}>
        <Button 
          variant="contained" 
          startIcon={<PersonAdd />}
          href="/add-patient"
        >
          Add New Patient
        </Button>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<Refresh />}
            onClick={fetchData}
            disabled={loading}
          >
            Refresh Data
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<EventAvailable />}
            href="/alerts"
          >
            View Alerts
          </Button>
        </Box>
      </Box>

      {/* Main Table */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.light' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Mobile</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Medicine</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Qty</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Daily</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Purchase Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Finish Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : purchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No purchase records found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                purchases.map((item) => {
                  const daysLeft = dayjs(item.expected_finish_date).diff(dayjs(), 'day');
                  return (
                    <TableRow 
                      key={item.id} 
                      hover
                      sx={{ 
                        '&:last-child td': { borderBottom: 0 },
                        backgroundColor: daysLeft <= 2 ? 'warning.light' : 'inherit'
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight={500}>{item.patient.name}</Typography>
                      </TableCell>
                      <TableCell>{item.patient.mobile}</TableCell>
                      <TableCell>{item.medicine.name}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.daily_dosage}</TableCell>
                      <TableCell>{dayjs(item.purchase_date).format('DD MMM YYYY')}</TableCell>
                      <TableCell>{dayjs(item.expected_finish_date).format('DD MMM YYYY')}</TableCell>
                      <TableCell>
                        <Chip 
                          label={daysLeft <= 2 ? 
                            `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left` : 
                            'Active'
                          }
                          color={daysLeft <= 0 ? 'error' : daysLeft <= 2 ? 'warning' : 'success'}
                          size="small"
                          variant={daysLeft > 2 ? 'outlined' : 'filled'}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton color="primary" size="small" href={`/edit/${item.id}`}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default Dashboard;