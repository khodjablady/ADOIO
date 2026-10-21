import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Google Maps Platform Tier 1 Quota & Auth Defense
(window as any).gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
};
const origError = console.error;
console.error = (...args: unknown[]) => {
  origError.apply(console, args);
  const msg = args.map((a) => String(a)).join(' ');
  if (msg.includes('OverQuotaMapError') || msg.includes('QuotaExceededError')) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  }
};

// Register PWA service worker with auto-update and offline capability
registerSW({
  immediate: true,
  onNeedRefresh() {
    // Automatically reloads on update when idle
  },
  onOfflineReady() {
    // Cache primed for rural & disconnected regions
  },
});

createRoot(document.getElementById('root')!).render(<App />);

