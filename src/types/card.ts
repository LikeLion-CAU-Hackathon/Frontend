// 4x6 그리드 우표 타입 정의 
export interface Card {
    id: number;
    image: string;
    isOpened: boolean; // 클릭했을 때 편지가 열린 상태인지 확인
    isExpired?: boolean; // 답장 기한이 지났는지 여부 -> expired stamp 추가
    isAnswered?: boolean; // 답장을 했는지 여부 -> 우표 추가
}