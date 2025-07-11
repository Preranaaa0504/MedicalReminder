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
  Chip
} from '@mui/material';
import { Delete, Edit, Visibility, Refresh } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';

function ViewPatients() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/purchases/');
      setPurchases(res.data);
    } catch (err) {
      console.error('Error fetching purchases', err);
      enqueueSnackbar('Failed to load patient data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient record?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/purchases/${id}/`);
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

  const calculateDaysLeft = (finishDate) => {
    const today = dayjs();
    const finish = dayjs(finishDate);
    return finish.diff(today, 'day');
  };

  return (
    <Box sx={{ p: 4 }}>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.light' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Medicine</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Qty</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Dosage</TableCell>
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
                      No patient records found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                purchases.map((item) => {
                  const daysLeft = calculateDaysLeft(item.expected_finish_date);
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
                        {daysLeft <= 2 ? (
                          <Chip 
                            label={`${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`} 
                            color="warning" 
                            size="small" 
                          />
                        ) : (
                          <Chip 
                            label="Active" 
                            color="success" 
                            size="small" 
                            variant="outlined" 
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton color="primary" size="small">
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton color="secondary" size="small">
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

export default ViewPatients;