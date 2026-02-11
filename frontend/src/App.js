import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/" replace />;
  };

  return (
    <Router>
      <div className="App min-h-screen relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="bg-mesh"></div>
        <div className="blob top-[-10%] left-[-10%] scale-150 opacity-40"></div>
        <div className="blob bottom-[-10%] right-[-10%] scale-150 opacity-30" style={{ animationDelay: '-5s' }}></div>
        <div className="blob top-[40%] right-[20%] scale-75 opacity-20" style={{ animationDelay: '-10s' }}></div>
        
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
