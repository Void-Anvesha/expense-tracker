import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Insights from './pages/Insights';
import Landing from './pages/Landing';
import Layout from './components/Layout';
import LoginRegister from './pages/LoginRegister';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<LoginRegister />} />

            <Route
              path="/app/*"
              element={
                <ProtectedRoute>
                  <DataProvider>
                    <Layout>
                      <Routes>
                        <Route path="" element={<Dashboard />} />
                        <Route path="transactions" element={<Transactions />} />
                        <Route path="budgets" element={<Budgets />} />
                        <Route path="goals" element={<Goals />} />
                        <Route path="insights" element={<Insights />} />
                      </Routes>
                    </Layout>
                  </DataProvider>
                </ProtectedRoute>
              }
            />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;
