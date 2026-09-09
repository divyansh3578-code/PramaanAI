import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import RequireRole from './components/common/RequireRole.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { AuthProvider, ROLE } from './context/AuthContext.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import TenderNoticesPage from './pages/TenderNoticesPage.jsx'
import EvaluationMatrixPage from './pages/EvaluationMatrixPage.jsx'
import StatutoryBridgesPage from './pages/StatutoryBridgesPage.jsx'
import DisqualificationLedgerPage from './pages/DisqualificationLedgerPage.jsx'
import GemIncidentLogPage from './pages/GemIncidentLogPage.jsx'
import RtiGrievancePage from './pages/RtiGrievancePage.jsx'
import DocumentRepositoryPage from './pages/DocumentRepositoryPage.jsx'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Standalone — its own chrome, not the authenticated dashboard layout */}
            <Route path="/login" element={<LoginPage />} />

            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/tender-notices" element={<TenderNoticesPage />} />
              <Route path="/documents" element={<DocumentRepositoryPage />} />
              <Route
                path="/evaluation-matrix"
                element={
                  <RequireRole roles={[ROLE.OFFICER]}>
                    <EvaluationMatrixPage />
                  </RequireRole>
                }
              />
              <Route
                path="/statutory-bridges"
                element={
                  <RequireRole roles={[ROLE.OFFICER]}>
                    <StatutoryBridgesPage />
                  </RequireRole>
                }
              />
              <Route
                path="/disqualification-ledger"
                element={
                  <RequireRole roles={[ROLE.OFFICER]}>
                    <DisqualificationLedgerPage />
                  </RequireRole>
                }
              />
              <Route
                path="/gem-incident-log"
                element={
                  <RequireRole roles={[ROLE.OFFICER]}>
                    <GemIncidentLogPage />
                  </RequireRole>
                }
              />
              <Route path="/rti-grievance" element={<RtiGrievancePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
