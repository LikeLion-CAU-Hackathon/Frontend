import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarPage from "./pages/calendar/CalendarPage";
import "./pages/login/styles/global.css"; // 전역 스타일 적용
import FixedScreenLayout from "./components/layout/fixedscreenlayout/FixedScreenLayout";
import Login from "./pages/login/Login";
import WriteAnswer from "./pages/writeanswer/WriteAnswer";
import Comments from "./pages/comments/Comments";
import AnswerListPage from "./pages/answers/AnswerListPage";
import PrivateRoute from "./components/common/PrivateRoute";

function App() {
  return (
    <FixedScreenLayout>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/calendar" element={<CalendarPage />} />

          { /* 로그인이 안되면 접근 불가능 */}
          <Route element= {<PrivateRoute />} >
            <Route path="/answer" element={<WriteAnswer />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/answer-list" element={<AnswerListPage />} />
          </Route>
        </Routes>
      </Router>
    </FixedScreenLayout>
  );
}

export default App;
