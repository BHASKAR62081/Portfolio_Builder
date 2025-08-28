import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Import all your context providers
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { ResumeProvider } from './contexts/ResumeContext';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Nest providers for global state management */}
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <ResumeProvider>
            <App />
          </ResumeProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
