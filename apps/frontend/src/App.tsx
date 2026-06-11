import LandingPage from '@/pages/landing';
import CuestionarioPage from '@/pages/cuestionario';

export default function App() {
  const path = window.location.pathname;
  if (path.startsWith('/cuestionario')) return <CuestionarioPage />;
  return <LandingPage />;
}
