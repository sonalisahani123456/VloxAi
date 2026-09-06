import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const MainApp = () => {
  if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY.includes('example')) {
    return (
      <BrowserRouter>
        <ThemeProvider>
          <BlogProvider>
            <App />
          </BlogProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <ThemeProvider>
          <BlogProvider>
            <App />
          </BlogProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ClerkProvider>
  );
};

createRoot(document.getElementById('root')).render(<MainApp />);

