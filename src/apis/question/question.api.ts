import { axiosAPI } from "../axiosInstance";


export const getQuestion = async (date: string) => {
  try {
    const response = await axiosAPI.get(`/questions/${date}`);
    return response.data;
  } catch (error) {
    console.error("오늘의 질문을 가져오는데 실패했습니다.", error);
    throw error;
  }
};
