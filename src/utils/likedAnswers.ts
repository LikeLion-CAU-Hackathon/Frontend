const STORAGE_KEY = "likedAnswers";

const parseStoredIds = (): number[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((value) => typeof value === "number" && Number.isFinite(value));
    }
    return [];
  } catch {
    return [];
  }
};

const persistIds = (ids: number[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};

export const getStoredLikedAnswers = (): number[] => parseStoredIds();

export const setStoredLikedAnswers = (ids: number[]) => {
  persistIds(Array.from(new Set(ids)));
};

export const toggleStoredLikedAnswer = (answerId: number, liked: boolean) => {
  const ids = new Set(parseStoredIds());
  if (liked) {
    ids.add(answerId);
  } else {
    ids.delete(answerId);
  }
  persistIds(Array.from(ids));
};
