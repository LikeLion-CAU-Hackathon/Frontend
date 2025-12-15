import type { AnswerCardData } from "../components/common/AnswerCard";

export interface ReplyItem {
  id: number;
  author: string;
  baseAuthor: string;
  isMine: boolean;
  timestamp: string;
  body: string;
}

export type RawReply = {
  replyId?: number;
  id?: number;
  userName?: string;
  userNickname?: string;
  nickname?: string;
  author?: string;
  createdTime?: string;
  createdAt?: string;
  text?: string;
  contents?: string;
  body?: string;
  writer?: {
    nickname?: string;
    name?: string;
  };
  user?: {
    nickname?: string;
    name?: string;
  };
};

const monthLabels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export const createFallbackFeatured = (): AnswerCardData => ({
  id: -1,
  author: "잘생긴 루돌프 (나)",
  date: "DEC 7",
  time: "18:44",
  contents:
    "너는 친구들과 산에 스키를 타러 갔다. 첫 번째 날, 너와 그들은 스키장에서부터 보이는 밤하늘 정상까지, 올라갈 수 있는 가장 높은 곳으로 갔다. 네 친구들은 추위에 바로 내려갔다. 너는 혼자 작고 굳은 골짜기에 멈춰 서 있었다.",
  likes: 99,
  comments: 12,
  liked: false,
});

const stripOwnIndicator = (value: string): string => value.replace(/\s*\(나\)\s*$/, "").trim();

export const formatAuthorWithOwnership = (
  rawValue: string | undefined | null,
  nickname: string | null
) => {
  const trimmed = typeof rawValue === "string" ? rawValue.trim() : "";
  const withoutIndicator = stripOwnIndicator(trimmed);
  const baseAuthor = withoutIndicator.length > 0 ? withoutIndicator : "익명";
  const isMine = Boolean(nickname && baseAuthor === nickname);
  const displayAuthor = isMine ? `${baseAuthor} (나)` : baseAuthor;
  return { displayAuthor, baseAuthor, isMine };
};

export const updateRepliesWithNickname = (replies: ReplyItem[], nickname: string | null): ReplyItem[] => {
  if (!replies.length) {
    return replies;
  }
  let changed = false;
  const updated = replies.map((reply) => {
    const { displayAuthor, baseAuthor, isMine } = formatAuthorWithOwnership(
      reply.baseAuthor || reply.author,
      nickname
    );
    if (
      reply.author === displayAuthor &&
      reply.baseAuthor === baseAuthor &&
      reply.isMine === isMine
    ) {
      return reply.baseAuthor ? reply : { ...reply, baseAuthor };
    }
    changed = true;
    return { ...reply, author: displayAuthor, baseAuthor, isMine };
  });
  return changed ? updated : replies;
};

export const formatCardDateLabel = (value?: string | null): string => {
  if (!value) return "";
  const trimmed = value.trim();
  if (trimmed.length === 0) return "";
  const isoMatch = /^(\d{4})[-/.](\d{2})[-/.](\d{2})/.exec(trimmed);
  if (isoMatch) {
    const [, , month, day] = isoMatch;
    const monthIndex = Number(month) - 1;
    const label = monthLabels[monthIndex] ?? month.toUpperCase();
    const dayNumber = Number(day);
    return `${label} ${Number.isFinite(dayNumber) ? dayNumber : day}`;
  }
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    const month = parsed.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const day = parsed.getDate();
    return `${month} ${day}`;
  }
  return trimmed;
};

export const normalizeFeaturedAnswer = (answer?: AnswerCardData | null): AnswerCardData => {
  if (answer) {
    return {
      ...answer,
      liked: Boolean(answer.liked),
      date: formatCardDateLabel(answer.date),
      time: answer.time ?? "",
    };
  }
  return createFallbackFeatured();
};

const pickNickname = (reply: RawReply): string | undefined =>
  reply.userNickname ??
  reply.nickname ??
  reply.userName ??
  reply.author ??
  (typeof reply.writer?.nickname === "string" ? reply.writer.nickname : undefined) ??
  (typeof reply.writer?.name === "string" ? reply.writer.name : undefined) ??
  (typeof reply.user?.nickname === "string" ? reply.user.nickname : undefined) ??
  (typeof reply.user?.name === "string" ? reply.user.name : undefined);

export const mapReplies = (data: any, nicknameRef: React.MutableRefObject<string | null>): ReplyItem[] =>
  Array.isArray(data)
    ? data.map((reply: RawReply, index: number) => {
        const { displayAuthor, baseAuthor, isMine } = formatAuthorWithOwnership(
          pickNickname(reply),
          nicknameRef.current
        );
        return {
          id: reply.replyId ?? reply.id ?? index,
          author: displayAuthor,
          baseAuthor,
          isMine,
          timestamp: reply.createdTime ?? reply.createdAt ?? "",
          body: reply.text ?? reply.contents ?? reply.body ?? "",
        };
      })
    : [];

