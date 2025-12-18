import type { Answer } from "@/utils/answer";

export interface RelativeRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export type AnimationPhase = "start" | "end";

export interface AnimationState {
  answer: Answer;
  phase: AnimationPhase;
  startRect: RelativeRect;
  targetRect: RelativeRect;
  backgroundImg: string;
}

