// “YYYY-MM-DD” 형식으로 오늘 날짜 반환
export const getTodayDate = (): string => {
    const today = new Date().toISOString().split('T')[0];
    return today;
}