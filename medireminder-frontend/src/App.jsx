import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ViewPatients from './pages/ViewPatients';
import AddPatient from './pages/AddPatient';
import Alerts from './pages/Alerts';

function App() {
  return (
    <Router>
      <nav style={{
        backgroundColor: '#343a40', padding: '1rem', color: 'white',
        display: 'flex', gap: '20px', justifyContent: 'center'
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>View Patients</Link>
        <Link to="/add" style={{ color: 'white', textDecoration: 'none' }}>Add Patient</Link>
        <Link to="/alerts" style={{ color: 'white', textDecoration: 'none' }}>Alerts</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ViewPatients />} />
        <Route path="/add" element={<AddPatient />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>
    </Router>
  );
}

export default App;
