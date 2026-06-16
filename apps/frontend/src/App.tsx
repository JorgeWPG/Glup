import LandingPage from '@/pages/landing';
import CuestionarioPage from '@/pages/cuestionario';
import PrivacyPage from '@/pages/legal/privacy';
import TermsPage from '@/pages/legal/terms';
import CookiesPage from '@/pages/legal/cookies';

export default function App() {
  const path = window.location.pathname;
  if (path.startsWith('/cuestionario')) return <CuestionarioPage />;
  if (path === '/privacidad') return <PrivacyPage />;
  if (path === '/terminos') return <TermsPage />;
  if (path === '/cookies') return <CookiesPage />;
  return <LandingPage />;
}
