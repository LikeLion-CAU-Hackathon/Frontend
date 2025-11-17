import { axiosAPI } from "../axiosInstance";

export interface UserProfile {
  nickname?: string;
  userNickname?: string;
  name?: string;
  username?: string;
}

export const getMyProfile = async (questionId?: number | string): Promise<UserProfile> => {
  const api = axiosAPI();
  const config =
    typeof questionId === "number" || (typeof questionId === "string" && questionId.length > 0)
      ? { params: { questionId } }
      : undefined;
  const response = await api.get("/users/nickname", config);
  return response.data;
};
