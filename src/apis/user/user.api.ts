import { axiosAPI } from "../axiosInstance";

export interface UserProfile {
  nickname?: string;
  userNickname?: string;
  name?: string;
  username?: string;
}

export const getMyProfile = async (): Promise<UserProfile> => {
  const api = axiosAPI();
  const response = await api.get("/members/me");
  return response.data;
};
