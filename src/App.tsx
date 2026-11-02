import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { ProgressProvider } from './components/ProgressContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CurriculumPage from './pages/CurriculumPage';
import LessonPage from './pages/LessonPage';
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

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/learn', element: <CurriculumPage /> },
      { path: '/lesson/:lessonId', element: <LessonPage /> },
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
  return (
    <ProgressProvider>
      <RouterProvider router={router} />
    </ProgressProvider>
  );
}
