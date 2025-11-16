import { create } from "zustand";


interface QuestionState {
    questionId: number | null;
    content: string
    date: string;
    setQuestion: (q: {id:number; content:string; date:string; }) => void;
    reset: () => void;
}

export const useQuestionStore = create<QuestionState>((set) =>({
    questionId: null,
    content: "",
    date: "",
    setQuestion: ({ id, content, date}) => 
        set({
            questionId: id,
            content,
            date,
        }),
    reset: () =>
        set({
            questionId: null,
            content: "",
            date: "",
        }),
}));