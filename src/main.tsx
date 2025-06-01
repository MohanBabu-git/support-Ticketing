import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { TicketsProvider } from './contexts/TicketsContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TicketsProvider>
          <App />
        </TicketsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);