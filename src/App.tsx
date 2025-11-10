import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CalendarPage from './pages/CalendarPage';
import './Login/styles/global.css'; // 전역 스타일 적용
import FixedScreenLayout from './components/layout/FixedScreenLayout/FixedScreenLayout';
import Login from './Login/Login';

function App() {
  return (
    <FixedScreenLayout>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </Router>
    </FixedScreenLayout>
  );
}

export default App;
