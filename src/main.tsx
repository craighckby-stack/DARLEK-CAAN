/**
 * DARLEK CAAN ARCHITECTURAL HEADER
 * File: src/main.tsx
 * Role: Core application bootstrap and mounting entrypoint.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import MainPage from './components/MainPage';
import './index.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <MainPage />
    </React.StrictMode>
  );
}
