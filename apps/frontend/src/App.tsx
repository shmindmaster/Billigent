import { ContextualPanelProvider } from '@/components/shared/ContextualPanel';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Analytics from './pages/Analytics';
import CaseManagement from './pages/CaseManagement';
import CaseReview from './pages/CaseReview';
import UnifiedCaseView from './pages/CaseView';
import Dashboard from './pages/Dashboard';
import DenialsManagement from './pages/DenialsManagement';
import PreBillReview from './pages/PreBillReview';
import QueryManagement from './pages/QueryManagement';
import Settings from './pages/Settings';
import { QueryProvider } from './providers/QueryProvider';

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
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="cases" element={<CaseManagement />} />
                  <Route path="cases/:caseId" element={<UnifiedCaseView />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="pre-bill" element={<PreBillReview />} />
                  <Route path="pre-bill/:caseId" element={<CaseReview />} />
                  <Route path="denials" element={<DenialsManagement />} />
                  <Route path="queries" element={<QueryManagement />} />
                  <Route path="settings" element={<Settings />} />
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