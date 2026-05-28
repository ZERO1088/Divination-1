// ============================================================
// App 根组件 —— ErrorBoundary + AppProvider + BrowserRouter + Routes
// 路由: / → HomePortal | /iching → IChingPage | /tarot → TarotPage
// ============================================================

import { type ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import HomePortal from './components/Landing/HomePortal';
import IChingQuestionPage from './pages/IChingQuestionPage';
import IChingPage from './components/IChing/IChingPage';
import TarotQuestionPage from './pages/TarotQuestionPage';
import TarotSelectPage from './pages/TarotSelectPage';
import TarotInterpretPage from './pages/TarotInterpretPage';

function AppRoutes(): ReactNode {
  return (
    <Routes>
      <Route path="/" element={<HomePortal />} />
      <Route path="/iching-question" element={<IChingQuestionPage />} />
      <Route path="/iching" element={<IChingPage />} />
      <Route path="/tarot-question" element={<TarotQuestionPage />} />
      <Route path="/tarot-select" element={<TarotSelectPage />} />
      <Route path="/tarot-interpret/:cardId" element={<TarotInterpretPage />} />
    </Routes>
  );
}

export default function App(): ReactNode {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
