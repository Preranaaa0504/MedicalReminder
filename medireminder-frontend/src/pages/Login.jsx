import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  CircularProgress,
  Link,
  Divider
} from '@mui/material';
import { Lock, Person, MedicalServices } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post('http://127.0.0.1:8000/api/login/', {
        username,
        password
      }, {
        withCredentials: true
      });

      enqueueSnackbar('Login successful', { variant: 'success' });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Invalid credentials', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      p: 2
    }}>
      <Paper elevation={6} sx={{ 
        width: '100%', 
        maxWidth: 450, 
        p: 4,
        borderRadius: 3
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mb: 4
        }}>
          <MedicalServices color="primary" sx={{ fontSize: 60, mb: 1 }} />
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 700,
            color: 'primary.main',
            mb: 1
          }}>
            MedTrack Pro
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Medication management system
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <Person color="action" sx={{ mr: 1 }} />
              )
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <Lock color="action" sx={{ mr: 1 }} />
              )
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Forgot your password?{' '}
            <Link href="#" underline="hover">
              Reset here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;