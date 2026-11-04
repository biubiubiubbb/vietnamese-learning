import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { ProgressProvider } from './components/ProgressContext';
import { AuthProvider } from './components/AuthContext';
import RequireAuth from './components/RequireAuth';
import { hydrateContent } from './content/live';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CurriculumPage from './pages/CurriculumPage';
import LessonPage from './pages/LessonPage';
import LessonPracticePage from './pages/LessonPracticePage';
import UnitPage from './pages/UnitPage';
import PronunciationPage from './pages/PronunciationPage';
import VocabularyPage from './pages/VocabularyPage';
import PracticePage from './pages/PracticePage';
import ReviewPage from './pages/ReviewPage';
import ProgressPage from './pages/ProgressPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function NotFound() {
  return (
    <div className="container" style={{ paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}>?</div>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>这一页不存在</h1>
      <p className="muted mb24">可能链接打错了，或者这页手账还没写。</p>
      <Link to="/" className="btn btn-primary">回到首页</Link>
    </div>
  );
}

// 子路径部署时（如 GitHub Pages）让路由与构建 base 保持一致
const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/learn', element: <CurriculumPage /> },
      { path: '/unit/:unitId', element: <UnitPage /> },
      { path: '/lesson/:lessonId', element: <LessonPage /> },
      {
        path: '/lesson/:lessonId/practice',
        element: (
          <RequireAuth>
            <LessonPracticePage />
          </RequireAuth>
        ),
      },
      { path: '/pronunciation', element: <PronunciationPage /> },
      { path: '/vocabulary', element: <VocabularyPage /> },
      {
        path: '/practice',
        element: (
          <RequireAuth>
            <PracticePage />
          </RequireAuth>
        ),
      },
      {
        path: '/review',
        element: (
          <RequireAuth>
            <ReviewPage />
          </RequireAuth>
        ),
      },
      {
        path: '/progress',
        element: (
          <RequireAuth>
            <ProgressPage />
          </RequireAuth>
        ),
      },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
], { basename: BASENAME });

export default function App() {
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    hydrateContent().finally(() => setContentReady(true));
  }, []);

  if (!contentReady) {
    return (
      <div className="container" style={{ paddingTop: 80, textAlign: 'center' }}>
        <p className="muted">正在加载学习内容…</p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <ProgressProvider>
        <RouterProvider router={router} />
      </ProgressProvider>
    </AuthProvider>
  );
}
