import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarPage from "./pages/CalendarPage";
import "./pages/Login/styles/global.css"; // 전역 스타일 적용
import FixedScreenLayout from "./components/layout/FixedScreenLayout/FixedScreenLayout";
import Login from "./pages/Login/Login";
import Answer from "./pages/Answer/Answer";
import Comments from "./pages/Comments/Comments";

function App() {
  return (
    <FixedScreenLayout>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/answer" element={<Answer />} />
          <Route path="/comments" element={<Comments />} />
        </Routes>
      </Router>
    </FixedScreenLayout>
  );
}

export default App;
