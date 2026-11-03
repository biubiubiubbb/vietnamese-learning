import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { ProgressProvider } from './components/ProgressContext';
import { hydrateContent } from './content/live';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminUnits from './admin/AdminUnits';
import AdminVocab from './admin/AdminVocab';
import AdminSentences from './admin/AdminSentences';
import AdminPronunciation from './admin/AdminPronunciation';
import AdminAudio from './admin/AdminAudio';
import AdminConfig from './admin/AdminConfig';
import AdminTrash from './admin/AdminTrash';
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

function AdminNotFound() {
  return (
    <div className="admin-page" style={{ textAlign: 'center', paddingTop: 60 }}>
      <h1>这一页不存在</h1>
      <p className="muted">检查一下后台路径。</p>
      <Link to="/admin" className="admin-btn">回到总览</Link>
    </div>
  );
}

const router = createBrowserRouter([
  { path: '/admin/login', element: <AdminLogin /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'units', element: <AdminUnits /> },
      { path: 'vocab', element: <AdminVocab /> },
      { path: 'sentences', element: <AdminSentences /> },
      { path: 'pronunciation', element: <AdminPronunciation /> },
      { path: 'audio', element: <AdminAudio /> },
      { path: 'config', element: <AdminConfig /> },
      { path: 'trash', element: <AdminTrash /> },
      { path: '*', element: <AdminNotFound /> },
    ],
  },
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/learn', element: <CurriculumPage /> },
      { path: '/unit/:unitId', element: <UnitPage /> },
      { path: '/lesson/:lessonId', element: <LessonPage /> },
      { path: '/lesson/:lessonId/practice', element: <LessonPracticePage /> },
      { path: '/pronunciation', element: <PronunciationPage /> },
      { path: '/vocabulary', element: <VocabularyPage /> },
      { path: '/practice', element: <PracticePage /> },
      { path: '/review', element: <ReviewPage /> },
      { path: '/progress', element: <ProgressPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

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
    <ProgressProvider>
      <RouterProvider router={router} />
    </ProgressProvider>
  );
}
