import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CalendarPage from './pages/CalendarPage'
import Layout from './components/layout/Layout'

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
