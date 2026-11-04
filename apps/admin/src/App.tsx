import { createBrowserRouter, Navigate, RouterProvider, Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminCustomers from './AdminCustomers';
import AdminCustomerDetail from './AdminCustomerDetail';
import AdminUnits from './AdminUnits';
import AdminVocab from './AdminVocab';
import AdminSentences from './AdminSentences';
import AdminPronunciation from './AdminPronunciation';
import AdminAudio from './AdminAudio';
import AdminConfig from './AdminConfig';
import AdminTrash from './AdminTrash';

function NotFound() {
  return (
    <div className="admin-page" style={{ textAlign: 'center', paddingTop: 60 }}>
      <h1>这一页不存在</h1>
      <Link to="/admin" className="admin-btn">回到总览</Link>
    </div>
  );
}

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/admin" replace /> },
  { path: '/admin/login', element: <AdminLogin /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'customers', element: <AdminCustomers /> },
      { path: 'customers/:id', element: <AdminCustomerDetail /> },
      { path: 'units', element: <AdminUnits /> },
      { path: 'vocab', element: <AdminVocab /> },
      { path: 'sentences', element: <AdminSentences /> },
      { path: 'pronunciation', element: <AdminPronunciation /> },
      { path: 'audio', element: <AdminAudio /> },
      { path: 'config', element: <AdminConfig /> },
      { path: 'trash', element: <AdminTrash /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
