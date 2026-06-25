import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')!

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// In production the route HTML is prerendered (see scripts/prerender.ts), so the
// #root already contains server markup and we hydrate it. In dev the root is the
// empty scaffold, so we render fresh. Picking the path by content keeps both the
// dev server and the prerendered build warning-free.
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
