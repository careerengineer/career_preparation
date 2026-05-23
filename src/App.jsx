import { HashRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './dashboard/Dashboard.jsx'
import WorkbookRouter from './workbooks/WorkbookRouter.jsx'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workbook/:workbookKey" element={<WorkbookRouter />} />
      </Routes>
    </HashRouter>
  )
}
