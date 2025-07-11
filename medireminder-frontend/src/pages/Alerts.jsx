import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box,
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import dayjs from 'dayjs';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/purchases/');
      const filtered = res.data.filter(p => {
        const finishDate = dayjs(p.expected_finish_date);
        return finishDate.diff(dayjs(), 'day') <= 2;
      });
      setAlerts(filtered);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  if (loading) {
    return null; // Or replace with your preferred loading state
  }

  return (
    <Box sx={{ p: 0 }}>
      <Paper elevation={0} sx={{ borderRadius: 0 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: 'warning.light' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Remaining</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Finish Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Urgency</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.map(item => {
                const daysLeft = dayjs(item.expected_finish_date).diff(dayjs(), 'day');
                return (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      {item.patient.name}
                    </TableCell>
                    <TableCell>{item.patient.mobile}</TableCell>
                    <TableCell>
                      {Math.floor(item.quantity / item.daily_dosage)} days
                    </TableCell>
                    <TableCell>
                      {dayjs(item.expected_finish_date).format('DD MMM YYYY')}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={<Warning />}
                        label={daysLeft <= 0 ? 'OVERDUE' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
                        color={daysLeft <= 0 ? 'error' : 'warning'}
                        variant="filled"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default Alerts;