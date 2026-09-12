/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: remote_main.tsx
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

const IS_DEV: boolean = process.env.NODE_ENV === 'development';

const DEV_STYLE: string = 'color: red; padding: 20px; font-family: monospace; background: #fff0f0;';
const PROD_STYLE: string = 'padding: 40px; font-family: sans-serif; text-align: center; color: #333;';

function createBootstrapErrorFallback(error: unknown): HTMLDivElement {
  const container: HTMLDivElement = document.createElement('div');
  
  if (IS_DEV) {
    container.style.cssText = DEV_STYLE;
    const errorMessage: string = error instanceof Error ? (error.stack ?? error.message) : String(error);
    container.innerHTML = `
      <h1 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Application Failed to Render</h1>
      <p style="margin-bottom: 1rem;">Please check the console for structural details.</p>
      <pre style="white-space: pre-wrap; background: #fff; padding: 1rem; border: 1px solid #ffcccc;">${errorMessage}</pre>
    `;
  } else {
    container.style.cssText = PROD_STYLE;
    container.innerHTML = `
      <h1 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Application Error</h1>
      <p>We're sorry, but the application encountered an unexpected error. Please try again later.</p>
    `;
  }

  return container;
}

function initializeApplication(): void {
  const rootElement: HTMLElement | null = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Critical: Failed to locate the DOM root element.');
  }

  if (IS_DEV) {
    console.info('[EMG Core] Development mode enabled');
  }

  try {
    createRoot(rootElement).render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>
    );
  } catch (error: unknown) {
    console.error('Failed to render the application:', error);
    rootElement.replaceChildren(createBootstrapErrorFallback(error));
  }
}

initializeApplication();