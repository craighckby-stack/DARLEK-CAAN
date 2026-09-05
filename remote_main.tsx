import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

/**
 * Creates and stylizes an error notification container for critical bootstrap failures.
 */
function createBootstrapErrorFallback(error: unknown, isDevelopment: boolean): HTMLDivElement {
  const container = document.createElement('div');
  
  if (isDevelopment) {
    container.style.cssText = 'color: red; padding: 20px; font-family: monospace; background: #fff0f0;';
    const errorMessage = error instanceof Error ? error.stack : String(error);
    container.innerHTML = `
      <h1 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Application Failed to Render</h1>
      <p style="margin-bottom: 1rem;">Please check the console for structural details.</p>
      <pre style="white-space: pre-wrap; background: #fff; padding: 1rem; border: 1px solid #ffcccc;">${errorMessage}</pre>
    `;
  } else {
    container.style.cssText = 'padding: 40px; font-family: sans-serif; text-align: center; color: #333;';
    container.innerHTML = `
      <h1 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Application Error</h1>
      <p>We're sorry, but the application encountered an unexpected error. Please try again later.</p>
    `;
  }

  return container;
}

/**
 * Initializes and mounts the root React application with robust bootstrap error handling.
 */
function initializeApplication(): void {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Critical: Failed to locate the DOM root element.');
  }

  if (isDevelopment) {
    console.info('[EMG Core] Development mode enabled');
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>
    );
  } catch (error) {
    console.error('Failed to render the application:', error);
    
    const errorFallbackNode = createBootstrapErrorFallback(error, isDevelopment);
    rootElement.replaceChildren(errorFallbackNode);
  }
}

initializeApplication();