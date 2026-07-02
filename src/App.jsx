import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy-loaded pages
const InvoiceList = lazy(() => import('./pages/InvoiceList'));
const InvoiceForm = lazy(() => import('./pages/InvoiceForm'));
const InvoiceDetail = lazy(() => import('./pages/InvoiceDetail'));

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner message="Loading your invoice console..." />}>
              <Routes>
                <Route path="/" element={<InvoiceList />} />
                <Route path="/new" element={<InvoiceForm />} />
                <Route path="/preview/:id" element={<InvoiceDetail />} />
                <Route path="*" element={
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <h2>404 - Page Not Found</h2>
                    <p className="text-muted">The requested view does not exist.</p>
                  </div>
                } />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
