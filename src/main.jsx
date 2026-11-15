import React from 'react';
import { createRoot } from 'react-dom/client';
import { inject } from '@vercel/analytics';
import App from './App';
import './styles/global.css';
import './styles/templates.css';

inject();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
