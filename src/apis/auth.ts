import axios from "axios";
import { BASE_URL } from "../constants/baseURL";
import { getRefreshToken } from "../utils/token";

export const getNewRefreshToken = async () => {
  const refreshToken = getRefreshToken();

  const res = await axios.post(
    `${BASE_URL}/auth/refresh`,
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  return res.data; // { accessToken, refreshToken }
};
