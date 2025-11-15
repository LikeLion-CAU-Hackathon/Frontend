import { axiosAPI } from "../axiosInstance";

export const getAnswerList = async (questionId: number) => {
  try {
    const response = await axiosAPI.get(`/questions/${questionId}/answers`);
    return response.data;
  } catch (error) {
    console.error("해당 질문의 답변내용을 가져오는데 실패했습니다.", error);
    throw error;
  }
};
