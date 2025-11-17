import { axiosAPI } from "../axiosInstance";

export interface UserProfile {
  nickname?: string;
  userNickname?: string;
  name?: string;
  username?: string;
}

export const getMyProfile = async (questionId?: number | string): Promise<UserProfile> => {
  const api = axiosAPI();
  const hasQuestionId =
    typeof questionId === "number" || (typeof questionId === "string" && questionId.length > 0);
  const endpoint = hasQuestionId
    ? `/users/nickname/${encodeURIComponent(String(questionId))}`
    : "/users/nickname";

  const response = await api.get(endpoint);
  const payload = response?.data?.data ?? response?.data;
  return payload;
};
