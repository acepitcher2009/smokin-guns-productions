import { HelmetProvider } from 'react-helmet-async';
import type { HelmetServerState } from 'react-helmet-async';
import { BrowserRouter, Navigate, Route, Routes, StaticRouter } from 'react-router-dom';

import { ConsentNotice } from './components/ConsentNotice';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ScrollToTop } from './components/ScrollToTop';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Events } from './pages/Events';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Results } from './pages/Results';
import { Sponsors } from './pages/Sponsors';

// The persistent shell + route table, without a Router so tests can supply their
// own (MemoryRouter). The default App below wraps this in BrowserRouter.
export function AppShell() {
  return (
    <>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col bg-cream font-sans text-ink">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/results" element={<Results />} />
            <Route path="/about" element={<About />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <ConsentNotice />
      </div>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </HelmetProvider>
  );
}

/**
 * Mutable context HelmetProvider fills with the collected head state during a
 * server (SSG) render. After renderToString, `helmetContext.helmet` holds the
 * serialized title/meta/link/script (incl. the JSON-LD) for the route. The
 * shape mirrors react-helmet-async's own ProviderProps.context.
 */
export interface HelmetSsgContext {
  helmet?: HelmetServerState;
}

/**
 * The same app tree, but rendered for static prerendering: StaticRouter pins
 * the route to a single `location` and the HelmetProvider writes its head state
 * into the passed `helmetContext`. AppShell is shared verbatim with the client
 * <App>, so the prerendered markup hydrates cleanly. Used only by the build-time
 * prerender step (src/entry-server.tsx) — never shipped to the browser.
 */
export function AppServer({
  location,
  helmetContext,
}: {
  location: string;
  helmetContext: HelmetSsgContext;
}) {
  return (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={location}>
        <AppShell />
      </StaticRouter>
    </HelmetProvider>
  );
}

export default App;
