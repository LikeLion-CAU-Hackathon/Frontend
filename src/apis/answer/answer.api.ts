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

export const checkAnswered = async (questionId: number) => {
  const response = await axiosAPI.get(`/answers/list/${questionId}`);
  return response.data; 
};

export const postAnswerReply = async (answerId: number, contents: string) => {
  try {
    const response = await axiosAPI.post(`/answers/${answerId}`, { contents });
    return response.data;
  } catch (error) {
    console.error("답변을 전송하는 데 실패했습니다.", error);
    throw error;
  }
};

export const postAnswerComment = async (answerId: number, contents: string) => {
  try {
    const response = await axiosAPI.post(`/answers/${answerId}/reply`, {
      text: contents,
      contents,
    });
    return response.data;
  } catch (error) {
    console.error("댓글을 전송하는 데 실패했습니다.", error);
    throw error;
  }
};

export const getAnswerReplies = async (answerId: number) => {
  try {
    const response = await axiosAPI.get(`/answers/${answerId}/reply`);
    return response.data;
  } catch (error) {
    console.error("댓글 목록을 가져오는 데 실패했습니다.", error);
    throw error;
  }
};

export const getAnswerLikeCount = async (answerId: number) => {
  try {
    const response = await axiosAPI.get(`/answers/${answerId}/thumbs/count`);
    return response.data;
  } catch (error) {
    console.error("좋아요 수를 가져오는 데 실패했습니다.", error);
    throw error;
  }
};
