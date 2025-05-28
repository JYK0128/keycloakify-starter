import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { KcPage } from './kc.gen';

// The following block can be uncommented to test a specific page with `yarn dev`
// Don't forget to comment back or your bundle size will increase

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {!window.kcContext
      ? (
        <h1>No Keycloak Context</h1>
      )
      : (
        <KcPage kcContext={window.kcContext} />
      )}
  </StrictMode>,
);
