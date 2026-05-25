import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DataProvider } from './store/DataContext.jsx'
import { RESPONSIVE_CSS } from './shared/design/responsive.js'
import { ErrorBoundary } from './shared/components/ErrorBoundary.jsx'
import Dashboard from './dashboard/Dashboard.jsx'
import WorkbookRouter from './workbooks/WorkbookRouter.jsx'

export default function App() {
  return (
    <DataProvider>
      <style>{RESPONSIVE_CSS}</style>
      <HashRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workbook/:workbookKey" element={<WorkbookRouter />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </HashRouter>
    </DataProvider>
  )
}
