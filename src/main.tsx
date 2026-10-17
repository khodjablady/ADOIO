import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

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
