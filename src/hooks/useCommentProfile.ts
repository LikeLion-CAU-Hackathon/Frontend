import { useEffect, useState, useRef } from "react";
import { getMyProfile } from "@/apis/user/user.api";

interface Params {
  cardId?: number | string | null;
  navigate: any;
}

export function useCommentProfile({ cardId, navigate }: Params) {
  const [myNickname, setMyNickname] = useState<string | null>(null);
  const myNicknameRef = useRef<string | null>(null);

  useEffect(() => {
    myNicknameRef.current = myNickname;
  }, [myNickname]);

  useEffect(() => {
    let cancelled = false;
    const resolveQuestionParam = () => {
      if (typeof cardId === "number" && Number.isFinite(cardId)) return cardId;
      if (typeof cardId === "string" && cardId.trim().length > 0) {
        const asNumber = Number(cardId);
        if (Number.isFinite(asNumber)) return asNumber;
        return cardId;
      }
      return undefined;
    };

    const fetchProfile = async () => {
      try {
        const profile = await getMyProfile(resolveQuestionParam());
        if (cancelled) return;
        const nickname =
          profile?.nickname ??
          profile?.userNickname ??
          profile?.name ??
          profile?.username ??
          null;
        setMyNickname(nickname);
      } catch (error: any) {
        console.error("내 프로필 정보를 불러오지 못했습니다:", error);
        if (error?.message === "questionId가 존재하지 않습니다.") {
          navigate("/", { replace: true });
          return;
        }
        if (!cancelled) {
          setMyNickname(null);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [cardId, navigate]);

  return { myNickname, myNicknameRef };
}

