import axios from 'axios';
import { BASE_URL } from "../../constants/baseURL";

{/* TODO: 토큰 확인 API 따로 만들어서 뺴기  */}

export const getQuestion = async (date : string) => {
    const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${BASE_URL}/questions/${date}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      alert('로그인이 필요합니다.');
      localStorage.removeItem('token');
      window.location.href = '/';
    }

    return response.data; 
  } catch (error) {
    console.error("오늘의 질문을 가져오는 데 실패했습니다.", error);
    throw error;
  }
};
