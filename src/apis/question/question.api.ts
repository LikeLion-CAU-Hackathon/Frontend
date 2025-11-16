import { axiosAPI } from "../axiosInstance";

export const getQuestion = async (identifier: string | number) => {
  try {
    const response = await axiosAPI.get(`/questions/${identifier}`);
    return response.data;
  } catch (error) {
    console.error("오늘의 질문을 가져오는데 실패했습니다.", error);
    throw error;
  }
};
