import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@imexmercado/ui/src/globals.css';
import '@imexmercado/i18n';

import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { PaymentProvider } from './context/PaymentContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CartProvider>
        <PaymentProvider>
          <App />
        </PaymentProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
