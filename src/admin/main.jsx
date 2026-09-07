import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './estilo.css';

createRoot(document.getElementById('raiz')).render(
  <StrictMode>
    {/* O painel vive em /admin: o basename mantem as rotas internas curtas. */}
    <BrowserRouter basename="/admin">
      <App />
    </BrowserRouter>
  </StrictMode>
);
