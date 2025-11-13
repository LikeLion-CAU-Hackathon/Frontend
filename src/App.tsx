import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarPage from "./pages/calendar/CalendarPage";
import "./pages/Login/styles/global.css"; // 전역 스타일 적용
import FixedScreenLayout from "./components/layout/FixedScreenLayout/FixedScreenLayout";
import Login from "./pages/Login/Login";
import AnswerListPage from "./pages/answers/AnswerListPage";

function App() {
  return (
    <FixedScreenLayout>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/answer-list" element={<AnswerListPage />} />
        </Routes>
      </Router>
    </FixedScreenLayout>
  );
}

export default App;
