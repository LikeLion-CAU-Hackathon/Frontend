import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarPage from "./pages/calendar/CalendarPage";
import "./pages/Login/styles/global.css"; // 전역 스타일 적용
import FixedScreenLayout from "./components/layout/FixedScreenLayout/FixedScreenLayout";
import Login from "./pages/Login/Login";
import Answer from "./pages/Answer/Answer";
import Comments from "./pages/Comments/Comments";
import AnswerListPage from "./pages/answers/AnswerListPage";
import PrivateRoute from "./components/common/PrivateRoute";

function App() {
  return (
    <FixedScreenLayout>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          { /* 로그인이 안되면 접근 불가능 */}
          <Route element= {<PrivateRoute />} >
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/answer" element={<Answer />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/answer-list" element={<AnswerListPage />} />
          </Route>
        </Routes>
      </Router>
    </FixedScreenLayout>
  );
}

export default App;
