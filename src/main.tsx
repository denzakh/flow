import React from 'react';
import ReactDOM from 'react-dom/client';
import './theme/tokens.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { muiTheme } from './theme/mui-theme';
import App from './App.tsx';

(function initTheme() {
  const saved = localStorage.getItem('flow_theme');
  const dark = saved === 'dark';
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.classList.toggle('light', !dark);
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
