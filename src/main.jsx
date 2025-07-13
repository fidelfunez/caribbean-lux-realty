import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { Toaster } from '@/components/ui/toaster';
import { AdminProvider } from '@/context/AdminContext.jsx';
import { BrowserRouter as Router } from 'react-router-dom';

// Add loading state management
const root = document.getElementById('root');
if (root) {
  // Add loading class for graceful transitions
  root.classList.add('loading');
  
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Router>
        <AdminProvider>
          <App />
        </AdminProvider>
      </Router>
      <Toaster />
    </React.StrictMode>
  );
  
  // Remove loading class after initial render
  setTimeout(() => {
    root.classList.remove('loading');
    root.classList.add('loaded');
  }, 100);
}