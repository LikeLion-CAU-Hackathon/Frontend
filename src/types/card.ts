// 4x6 그리드 우표 타입 정의 
export interface Card {
    id: number;
    image: string;
    isOpened: boolean; // 클릭했을 때 편지가 열린 상태인지 확인
}
