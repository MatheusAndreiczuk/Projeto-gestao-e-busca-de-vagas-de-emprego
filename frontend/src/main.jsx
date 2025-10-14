// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext'; // <-- IMPORTE O PROVIDER

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* <-- ENVOLVA O APP COM ELE */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);