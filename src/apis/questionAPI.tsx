import axios from 'axios';
import { BASE_URL } from "../constants/baseURL";

{/* TODO: 토큰 확인 API 따로 만들어서 뺴기  */}

export const getQuestion = async (date : string) => {
    const token = localStorage.getItem("token");

//     if (!token) {
//         alert("로그인이 필요합니다.");
//         window.location.href = "/";
//         return;
//   }

  try {
    const response = await axios.get(`${BASE_URL}/questions/${date}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data; 
  } catch (error : any) {
    if (error.response.status === 401) {
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token");
        window.location.href = "/";
        return; 
    }
    console.error("오늘의 질문을 가져오는 데 실패했습니다.", error);
    throw error;
  }
};
