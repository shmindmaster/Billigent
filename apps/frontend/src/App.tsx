import { ContextualPanelProvider } from '@/components/shared/ContextualPanel';
import { Suspense, lazy } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryProvider } from './providers/QueryProvider';
import ErrorBoundary from './components/shared/ErrorBoundary';
import PerformanceLoading from './components/shared/PerformanceLoading';

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
const DataExplorer = lazy(() => import('./pages/DataExplorer'));

// Enhanced loading fallback component with performance monitoring
const PageLoading = () => (
  <PerformanceLoading
    message="Loading page..."
    size="lg"
    variant="spinner"
    timeout={30000}
    showProgress={true}
    onTimeout={() => {
      console.warn('Page loading timeout - this might indicate a performance issue');
    }}
  />
);

// Error fallback component
const PageError = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Page Error</h3>
        <p className="text-sm text-gray-500 mb-4">
          Something went wrong while loading this page. Please try again.
        </p>
        <div className="space-y-2">
          <button
            onClick={resetErrorBoundary}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary
      fallback={<PageError error={new Error('App initialization failed')} resetErrorBoundary={() => window.location.reload()} />}
      onError={(error, errorInfo) => {
        console.error('App-level error:', error, errorInfo);
        // You can send this to your error tracking service (e.g., Sentry)
      }}
    >
      <QueryProvider>
        <ThemeProvider>
          <AuthProvider>
            <ContextualPanelProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={
                      <ErrorBoundary fallback={<PageError error={new Error('Dashboard failed')} resetErrorBoundary={() => window.location.reload()} />}>
                        <Suspense fallback={<PageLoading />}>
                          <Dashboard />
                        </Suspense>
                      </ErrorBoundary>
                    } />
                    <Route path="cases" element={
                      <ErrorBoundary fallback={<PageError error={new Error('Case Management failed')} resetErrorBoundary={() => window.location.reload()} />}>
                        <Suspense fallback={<PageLoading />}>
                          <CaseManagement />
                        </Suspense>
                      </ErrorBoundary>
                    } />
                    <Route path="cases/:caseId" element={
                      <ErrorBoundary fallback={<PageError error={new Error('Case View failed')} resetErrorBoundary={() => window.location.reload()} />}>
                        <Suspense fallback={<PageLoading />}>
                          <UnifiedCaseView />
                        </Suspense>
                      </ErrorBoundary>
                    } />
                    <Route path="analytics" element={
                      <ErrorBoundary fallback={<PageError error={new Error('Analytics failed')} resetErrorBoundary={() => window.location.reload()} />}>
                        <Suspense fallback={<PageLoading />}>
                          <Analytics />
                        </Suspense>
                      </ErrorBoundary>
                    } />
                    <Route path="pre-bill" element={
                      <ErrorBoundary fallback={<PageError error={new Error('Pre-Bill Review failed')} resetErrorBoundary={() => window.location.reload()} />}>
                        <Suspense fallback={<PageLoading />}>
                          <PreBillReview />
                        </Suspense>
                      </ErrorBoundary>
                    } />
                    <Route path="pre-bill/:caseId" element={
                      <ErrorBoundary fallback={<PageError error={new Error('Case Review failed')} resetErrorBoundary={() => window.location.reload()} />}>
                        <Suspense fallback={<PageLoading />}>
                          <CaseReview />
                        </Suspense>
                      </ErrorBoundary>
                    } />
                    <Route path="denials" element={
                      <ErrorBoundary fallback={<PageError error={new Error('Denials Management failed')} resetErrorBoundary={() => window.location.reload()} />}>
                        <Suspense fallback={<PageLoading />}>
                          <DenialsManagement />
                        </Suspense>
                      </ErrorBoundary>
                    } />
                    <Route path="queries" element={
                      <ErrorBoundary fallback={<PageError error={new Error('Query Management failed')} resetErrorBoundary={() => window.location.reload()} />}>
                        <Suspense fallback={<PageLoading />}>
                          <QueryManagement />
                        </Suspense>
                      </ErrorBoundary>
                    } />
                    <Route path="settings" element={
                      <ErrorBoundary fallback={<PageError error={new Error('Settings failed')} resetErrorBoundary={() => window.location.reload()} />}>
                        <Suspense fallback={<PageLoading />}>
                          <Settings />
                        </Suspense>
                      </ErrorBoundary>
                    } />
                    <Route path="data-explorer" element={
                      <ErrorBoundary fallback={<PageError error={new Error('Data Explorer failed')} resetErrorBoundary={() => window.location.reload()} />}>
                        <Suspense fallback={<PageLoading />}>
                          <DataExplorer />
                        </Suspense>
                      </ErrorBoundary>
                    } />
                    <Route path="*" element={
                      <div className="p-8">
                        <h1 className="text-2xl font-semibold">Page not found</h1>
                        <p className="text-muted-foreground mt-2">
                          The page you are looking for doesn't exist.
                        </p>
                        <button
                          onClick={() => window.history.back()}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Go Back
                        </button>
                      </div>
                    } />
                  </Route>
                </Routes>
              </Router>
            </ContextualPanelProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;