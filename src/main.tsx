import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * Identifier for the DOM element designated as the React application root container.
 */
const ROOT_ELEMENT_ID = 'root';

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
 * Initializes the React root and renders the primary application component tree.
 */
const mountApplication = (): void => {
  const rootContainer = getRootElement();
  const reactRoot = createRoot(rootContainer);

  reactRoot.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

mountApplication();