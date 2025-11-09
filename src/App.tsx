import '../pages/Loginm/styles/global.css'; // 전역 스타일 적용
import FixedScreenLayout from '../components/layout/FixedScreenLayout/FixedScreenLayout';
import Login from '../pages/Loginm/Login';

function App() {
  return (
    <FixedScreenLayout>
      {/* 라우터가 있다면 여기에 <Router> 등을 설정 */}
      <Login />
    </FixedScreenLayout>
  );
}

export default App;
