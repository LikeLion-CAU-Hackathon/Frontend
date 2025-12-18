const ANSWER_LIST_STATE_KEY = "answerListState";

type StoredAnswerListState = {
  cardId?: string | null;
  slide?: number;
};

export const readStoredAnswerListState = (): StoredAnswerListState | null => {
  try {
    const raw = sessionStorage.getItem(ANSWER_LIST_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed as StoredAnswerListState;
    }
  } catch (error) {
    console.warn("Failed to read stored answer list state", error);
  }
  return null;
};

export const storeAnswerListState = (cardId: string | null, slide: number) => {
  try {
    sessionStorage.setItem(
      ANSWER_LIST_STATE_KEY,
      JSON.stringify({ cardId: cardId ?? null, slide })
    );
  } catch (error) {
    console.warn("Failed to store answer list state", error);
  }
};

export const clearStoredAnswerListState = () => {
  try {
    sessionStorage.removeItem(ANSWER_LIST_STATE_KEY);
  } catch (error) {
    console.warn("Failed to clear stored answer list state", error);
  }
};

