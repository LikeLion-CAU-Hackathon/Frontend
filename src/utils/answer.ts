import type { AnswerCardData } from "@/components/common/AnswerCard";

export type Answer = AnswerCardData & {
  liked?: boolean;
  writerNickname?: string;
  isMine?: boolean;
};

export const stripOwnIndicator = (name: string): string =>
  name.replace(/\s*\(나\)\s*$/, "");

export const updateAnswerOwnership = (
  list: Answer[],
  nickname: string | null
): Answer[] => {
  if (!Array.isArray(list) || list.length === 0) {
    return list;
  }

  let changed = false;
  const updated = list.map((answer) => {
    const baseName =
      answer.writerNickname ??
      (typeof answer.author === "string" ? stripOwnIndicator(answer.author) : answer.author);

    if (!baseName) {
      return answer;
    }

    const isMine = Boolean(nickname && baseName === nickname);
    const displayAuthor = isMine ? `${baseName} (나)` : baseName;

    if (
      answer.author === displayAuthor &&
      answer.isMine === isMine &&
      answer.writerNickname === baseName
    ) {
      return answer;
    }

    changed = true;
    return {
      ...answer,
      author: displayAuthor,
      isMine,
      writerNickname: baseName,
    };
  });

  return changed ? updated : list;
};

