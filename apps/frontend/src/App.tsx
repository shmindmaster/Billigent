import { ContextualPanelProvider } from '@/components/shared/ContextualPanel';
import { Suspense, lazy } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
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
      // Replace console.warn with proper error handling
      // In a real app, you might want to log to a performance monitoring service
    }}
  />
);

// Error fallback component
const PageError = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
          <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Something went wrong</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error.message}</p>
        <div className="mt-6">
          <button
            onClick={resetErrorBoundary}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try again
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
        // Replace console.error with proper error handling
        // In a real app, you might want to send this to your error tracking service (e.g., Sentry)
      }}
    >
      <QueryProvider>
        <ThemeProvider>
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
                  <Route path="denials" element={
                    <ErrorBoundary fallback={<PageError error={new Error('Denials Management failed')} resetErrorBoundary={() => window.location.reload()} />}>
                      <Suspense fallback={<PageLoading />}>
                        <DenialsManagement />
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
                  <Route path="queries" element={
                    <ErrorBoundary fallback={<PageError error={new Error('Query Management failed')} resetErrorBoundary={() => window.location.reload()} />}>
                      <Suspense fallback={<PageLoading />}>
                        <QueryManagement />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                  <Route path="explorer" element={
                    <ErrorBoundary fallback={<PageError error={new Error('Data Explorer failed')} resetErrorBoundary={() => window.location.reload()} />}>
                      <Suspense fallback={<PageLoading />}>
                        <DataExplorer />
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
                </Route>
              </Routes>
            </Router>
          </ContextualPanelProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;