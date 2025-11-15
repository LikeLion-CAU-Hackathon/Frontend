// “YYYY-MM-DD” 형식으로 오늘 날짜 반환
export const getTodayDate = (): string => {
    const today = new Date().toISOString().split('T')[0];
    return today;
}

// 우표가 오늘 열릴 수 있는지 체크
export const isCardOpenableToday = (cardId: number): boolean => {
  const today = getTodayDate(); 
  const [ , month, day] = today.split("-").map(Number);

  if (month !== 12) return false;

  return day === cardId;
};
