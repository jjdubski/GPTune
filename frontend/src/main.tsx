import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import ReactDOM from 'react-dom/client'; // Use in prod
import './index.css'
import App from './App.tsx'

// Use in development
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Use in production
// const rootElement = document.getElementById('root');
// if (rootElement) {
//   const root = createRoot(rootElement);
//   root.render(
//     <>
//     <App />
//     </>
//   );
// } else {
//   console.error('Root element not found');
// }
