import { axiosAPI } from "../axiosInstance";

export const addLike = async (answerId: number) => {
  try {
    const api = axiosAPI(); 
    const response = await api.post(`/answers/${answerId}/thumbs`);
    return response.data;
  } catch (error) {
    console.error("좋아요를 누르는데 실패했습니다.", error);
    throw error;
  }
};

export const deleteLike = async (answerId: number) => {
  try {
    const api = axiosAPI(); 
    const response = await api.delete(`/answers/${answerId}/thumbs`);
    return response.data;
  } catch (error) {
    console.error("좋아요를 취소하는데 실패했습니다.", error);
    throw error;
  }
};
