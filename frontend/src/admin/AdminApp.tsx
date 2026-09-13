import { useEffect, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router-dom';
import { adminPath } from './adminApi';
import AdminLayout from './AdminLayout';
import { AuthProvider, useAuth } from './AuthContext';
import { FullPageSpinner } from './components/AdminUi';
import Categories from './pages/Categories';
import Login from './pages/Login';
import PostEditor from './pages/PostEditor';
import PostsList from './pages/PostsList';
import PricingEditor from './pages/PricingEditor';
import Submissions from './pages/Submissions';

export default function AdminApp() {
  // Keep every admin URL out of search engines.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route index element={<LoginRoute />} />
        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route path="posts" element={<PostsList />} />
          <Route path="posts/new" element={<PostEditor key="new" />} />
          <Route path="posts/:id" element={<PostEditor key="edit" />} />
          <Route path="categories" element={<Categories />} />
          <Route path="submissions" element={<Submissions />} />
          <Route path="pricing" element={<PricingEditor />} />
        </Route>
        <Route path="*" element={<Navigate to={adminPath('posts')} replace />} />
      </Routes>
    </AuthProvider>
  );
}

function LoginRoute() {
  const { status } = useAuth();
  const [searchParams] = useSearchParams();

  if (status === 'checking') return <FullPageSpinner />;

  if (status === 'authenticated') {
    const next = searchParams.get('next');
    // Only follow redirects that stay inside the admin panel.
    const safeNext = next && next.startsWith(`${adminPath()}/`) ? next : adminPath('posts');
    return <Navigate to={safeNext} replace />;
  }

  return <Login />;
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'checking') return <FullPageSpinner />;

  if (status === 'anonymous') {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${adminPath()}?next=${next}`} replace />;
  }

  return <>{children}</>;
}
