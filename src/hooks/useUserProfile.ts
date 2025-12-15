import { useEffect, useState } from "react";
import { getMyProfile } from "../apis/user/user.api";

interface UseUserProfileParams {
  questionId?: number | null;
  defaultNickname?: string;
}

export function useUserProfile({ questionId, defaultNickname = "중커톤" }: UseUserProfileParams) {
  const [userNickname, setUserNickname] = useState(defaultNickname);

  const questionIdForProfile =
    typeof questionId === "number" && Number.isFinite(questionId) ? questionId : undefined;

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const profile = await getMyProfile(questionIdForProfile);
        const nickname =
          profile?.nickname ??
          profile?.userNickname ??
          profile?.name ??
          profile?.username ??
          defaultNickname;
        if (isMounted) {
          setUserNickname(nickname);
        }
      } catch (error) {
        console.error("사용자 닉네임을 가져오지 못했습니다:", error);
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [questionIdForProfile, defaultNickname]);

  return {
    userNickname,
  };
}
