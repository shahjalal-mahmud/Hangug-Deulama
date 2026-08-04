/* src/main.jsx
   React entry point. Mounts <App> into the #root div from index.html.

   @see docs/PROJECT.md#sec-proj-deployment (deployment topology) */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// NOTE: StrictMode double-invokes effects in development only. This is
// React's way of surfacing bugs that hide behind single-run effects —
// for example, forgetting to clean up a setTimeout, or relying on a
// closure value that gets stale on the second run. It has no effect
// in production builds, so users never pay a cost.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);