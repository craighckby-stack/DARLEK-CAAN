import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * Identifier for the DOM element designated as the React application root container.
 */
const ROOT_ELEMENT_ID = 'root' as const;

/**
 * Retrieves and validates the root DOM container element required for application mounting.
 *
 * @throws {Error} If the target container element does not exist or fails type verification.
 */
const getRootElement = (): HTMLElement => {
  const container = document.getElementById(ROOT_ELEMENT_ID);

  if (!(container instanceof HTMLElement)) {
    throw new Error(
      `[Application Root Error] Container '#${ROOT_ELEMENT_ID}' was not found or is not a valid HTMLElement.`
    );
  }

  return container;
};

/**
 * Basic HTML sanitizer utility to safeguard against layout injection during fallback rendering.
 */
const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Initializes the React root and renders the primary application component tree
 * with enforced immutability, type safety, and optimized lifecycle allocation.
 */
const mountApplication = (): void => {
  try {
    const rootContainer: HTMLElement = getRootElement();
    const reactRoot: Root = createRoot(rootContainer);

    reactRoot.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown fatal initialization error occurred.';
    console.error(`[EMG Neural Core] Critical bootstrap failure: ${errorMessage}`);
    
    // Fallback emergency UI injection for catastrophic root mounting failures
    const fallbackContainer = document.getElementById(ROOT_ELEMENT_ID);
    if (fallbackContainer) {
      fallbackContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: monospace; background: #0f172a; color: #f8fafc; padding: 1rem; text-align: center;">
          <h2 style="color: #ef4444; margin-bottom: 0.5rem;">System Initialization Failure</h2>
          <p style="color: #94a3b8; max-width: 32rem; font-size: 0.875rem;">${escapeHtml(errorMessage)}</p>
        </div>
      `;
    }
  }
};

mountApplication();