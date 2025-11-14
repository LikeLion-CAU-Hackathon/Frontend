import axios from "axios";
import { BASE_URL } from "../constants/baseURL";

{/* 해당질문의 답변 가져오기 */}
export const getAnswers = async (questionId: number ) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`${BASE_URL}/questions/${questionId}/answers`, {
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        // if (error.response.status === 401) {
        // alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        // localStorage.removeItem("token");
        // window.location.href = "/";
        // return; 
    // }
    console.error("해당 질문에 대한 답변을 가져오는데 실패했습니다.", error)
    throw error;
    }
}