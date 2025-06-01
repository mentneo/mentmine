import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { sendToVercelAnalytics } from './vitals';

// Handle route redirections for SPA
const handleRouting = () => {
  // Don't run on local development
  if (window.location.hostname === 'localhost') return;
  
  const path = window.location.pathname;
  
  // Only handle non-root paths that don't point to actual files
  if (path !== '/' && !path.includes('.')) {
    console.log('SPA Route Handler: Handling path', path);
    
    // Store the path for React Router to handle
    sessionStorage.setItem('intendedRoute', path);
  }
};

// Run immediately
handleRouting();

// Initialize the root with React 18's createRoot API
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals(sendToVercelAnalytics);
