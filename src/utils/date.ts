// “YYYY-MM-DD” 형식으로 오늘 날짜 반환
export const getTodayDate = (): string => {
  const today = new Date();
  return today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).replace(/\. /g, "-").replace(".", "");
};

// 우표가 오늘 열릴 수 있는지 체크
export const isCardOpenableToday = (cardId: number): boolean => {
  const today = getTodayDate(); 
  console.log("오늘 날짜", today);
  const [ , , day] = today.split("-").map(Number);

  // TODO: (개발용) 주석 지우기
  // if (month !== 12) return false;

  return day === cardId;
};


// API 형식에 맞게 변환
export const convertIdToDate = (id: number): string => {
  const year = 2025;      
  const month = 11;    //TODO: 12로 바꾸기      
  const day = id.toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 카드가 오늘 날짜 이후인지 확인
export const isCardAfterToday = (cardId: number): boolean => {
  const today = getTodayDate();
  const [, , day] = today.split("-").map(Number);
  return cardId > day;
};

// 카드가 오늘 날짜 이전인지 확인
export const isCardBeforeToday = (cardId: number): boolean => {
  const today = getTodayDate();
  const [, , day] = today.split("-").map(Number);
  return cardId < day;
};

// 오늘이 12일/24일인지 확인 (기회 제공)
export const isOpportunityDay = (): boolean => {
  const today = getTodayDate();
  const [, , day] = today.split("-").map(Number);
  return day === 12 || day === 24;
};

export const formatDottedDate = (yy: string, mm: string, dd: string) =>
  `${yy}. ${mm}. ${dd}`;

// 실제 날짜 문자열을 → yy. mm. dd 형태로 파싱
export const parseDateToDotted = (dateStr?: string | null): string | null => {
  if (!dateStr) return null;

  const trimmed = dateStr.trim();
  if (trimmed.length === 0) return null;

  // YYYY-MM-DD or YYYY-MM-DDT00:00:00 형태
  const [yyyy, mm = "", ddRaw = ""] = trimmed.split("T")[0]?.split("-") ?? [];

  if (yyyy && mm && ddRaw) {
    const yy = yyyy.slice(-2);
    const month = mm.padStart(2, "0");
    const day = ddRaw.slice(0, 2).padStart(2, "0");
    return formatDottedDate(yy, month, day);
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;

  const yy = String(parsed.getFullYear()).slice(-2);
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return formatDottedDate(yy, month, day);
};

export const getFormattedToday = (): string => {
  const today = getTodayDate();
  return parseDateToDotted(today) ?? "";
};