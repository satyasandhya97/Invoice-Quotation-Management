import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';

const InvoiceList = lazy(() => import('./pages/InvoiceList'));
const InvoiceForm = lazy(() => import('./pages/InvoiceForm'));
const InvoiceDetail = lazy(() => import('./pages/InvoiceDetail'));

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary transition-colors duration-250">
        <Navbar />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner message="Loading your invoice console..." />}>
              <Routes>
                <Route path="/" element={<InvoiceList />} />
                <Route path="/new" element={<InvoiceForm />} />
                <Route path="/preview/:id" element={<InvoiceDetail />} />
                <Route path="*" element={
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-text-primary">404 - Page Not Found</h2>
                    <p className="text-text-muted mt-2">The requested view does not exist.</p>
                  </div>
                } />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
