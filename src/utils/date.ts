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
