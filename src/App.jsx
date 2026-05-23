import { HashRouter, Routes, Route } from 'react-router-dom'
import { DataProvider } from './store/DataContext.jsx'
import { RESPONSIVE_CSS } from './shared/design/responsive.js'
import Dashboard from './dashboard/Dashboard.jsx'
import WorkbookRouter from './workbooks/WorkbookRouter.jsx'

export default function App() {
  return (
    <DataProvider>
      <style>{RESPONSIVE_CSS}</style>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workbook/:workbookKey" element={<WorkbookRouter />} />
        </Routes>
      </HashRouter>
    </DataProvider>
  )
}
