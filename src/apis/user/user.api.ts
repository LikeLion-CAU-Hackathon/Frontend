import { authAxios } from "../axiosInstance";

export const getMyProfile = async (questionId?: number | string) => {
  if (!questionId && questionId !== 0) {
    throw new Error("questionId가 존재하지 않습니다.");
  }

  try {
    const response = await authAxios.get(`/users/nickname/${questionId}`);
    return response.data;
  } catch (error) {
    console.error("프로필을 가져오는 데 실패했습니다.", error);
    throw error;
  }
};
