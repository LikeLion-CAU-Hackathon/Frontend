import { authAxios } from "../axiosInstance";

export const getAnswerList = async (questionId: number) => {
  const response = await authAxios.get(`/questions/${questionId}/answers`);
  return response.data;
};

export const checkAnswered = async (questionId: number) => {
  const response = await authAxios.get(`/answers/list/${questionId}`);
  return response.data;
};

export const postAnswerReply = async (answerId: number, contents: string) => {
  const response = await authAxios.post(`/answers/${answerId}`, { contents });
  return response.data;
};

export const postAnswerComment = async (answerId: number, contents: string) => {
  const response = await authAxios.post(`/answers/${answerId}/reply`, {
    text: contents,
    contents,
  });
  return response.data;
};

export const getAnswerReplies = async (answerId: number) => {
  const response = await authAxios.get(`/answers/${answerId}/reply`);
  return response.data;
};

export const getAnswerLikeCount = async (answerId: number) => {
  const response = await authAxios.get(`/answers/${answerId}/thumbs/count`);
  return response.data;
};
