import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CalendarPage from './pages/CalendarPage'
import '../pages/Login/styles/global.css'; // 전역 스타일 적용
import FixedScreenLayout from '../components/layout/FixedScreenLayout/FixedScreenLayout';
import Login from '../pages/Login/Login';

function App = () => {
  return (
    <FixedScreenLayout>
      {/* 라우터가 있다면 여기에 <Router> 등을 설정 */}
      <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>     
      </Router>
   </FixedScreenLayout>
        
  )
}

export default App;
