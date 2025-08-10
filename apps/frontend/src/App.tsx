import { ContextualPanelProvider } from '@/components/shared/ContextualPanel';
import { Suspense, lazy } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryProvider } from './providers/QueryProvider';

// Lazy load page components for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const CaseManagement = lazy(() => import('./pages/CaseManagement'));
const CaseReview = lazy(() => import('./pages/CaseReview'));
const UnifiedCaseView = lazy(() => import('./pages/CaseView'));
const DenialsManagement = lazy(() => import('./pages/DenialsManagement'));
const PreBillReview = lazy(() => import('./pages/PreBillReview'));
const QueryManagement = lazy(() => import('./pages/QueryManagement'));
const Settings = lazy(() => import('./pages/Settings'));

// Loading fallback component
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ContextualPanelProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={
                    <Suspense fallback={<PageLoading />}>
                      <Dashboard />
                    </Suspense>
                  } />
                  <Route path="cases" element={
                    <Suspense fallback={<PageLoading />}>
                      <CaseManagement />
                    </Suspense>
                  } />
                  <Route path="cases/:caseId" element={
                    <Suspense fallback={<PageLoading />}>
                      <UnifiedCaseView />
                    </Suspense>
                  } />
                  <Route path="analytics" element={
                    <Suspense fallback={<PageLoading />}>
                      <Analytics />
                    </Suspense>
                  } />
                  <Route path="pre-bill" element={
                    <Suspense fallback={<PageLoading />}>
                      <PreBillReview />
                    </Suspense>
                  } />
                  <Route path="pre-bill/:caseId" element={
                    <Suspense fallback={<PageLoading />}>
                      <CaseReview />
                    </Suspense>
                  } />
                  <Route path="denials" element={
                    <Suspense fallback={<PageLoading />}>
                      <DenialsManagement />
                    </Suspense>
                  } />
                  <Route path="queries" element={
                    <Suspense fallback={<PageLoading />}>
                      <QueryManagement />
                    </Suspense>
                  } />
                  <Route path="settings" element={
                    <Suspense fallback={<PageLoading />}>
                      <Settings />
                    </Suspense>
                  } />
                  <Route path="*" element={<div className="p-8"><h1 className="text-2xl font-semibold">Page not found</h1><p className="text-muted-foreground mt-2">The page you are looking for doesn’t exist.</p></div>} />
                </Route>
              </Routes>
            </Router>
          </ContextualPanelProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;