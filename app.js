import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SuperAdmin from './components/SuperAdmin';
import InstituteAdmin from './components/InstituteAdmin';
import StudentHome from './components/StudentHome';
import HomePage from './components/HomePage';
import Unauthorized from './Unauthorized';
import ProtectedRoute from './utils/ProtectedRoute';
import Languages from './components/Languages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route 
          path="/superadmin" 
          element={
            <ProtectedRoute role="superadmin">
              <SuperAdmin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/instituteadmin" 
          element={
            <ProtectedRoute role="instituteadmin">
              <InstituteAdmin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student" 
          element={
            <ProtectedRoute role="student">
              <StudentHome />
            </ProtectedRoute>
          } 
        />
         <Route 
          path="/languages" 
          element={
            <ProtectedRoute role="student">
              <Languages/>
            </ProtectedRoute>
          } 
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
