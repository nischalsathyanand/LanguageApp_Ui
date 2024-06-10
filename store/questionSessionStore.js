import { makeAutoObservable } from "mobx";

class QuestionSessionStore {
  questions = [];
  selectedLesson = null;
  score = 0;
  completedTime = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setQuestions(questions) {
    this.questions = questions;
  }

  setSelectedLesson(lesson) {
    this.selectedLesson = lesson;
  }

  incrementScore() {
    this.score += 1;
  }

  setCompletedTime(time) {
    this.completedTime = time;
  }

  clear() {
    this.questions = [];
    this.selectedLesson = null;
    this.score = 0;
    this.completedTime = 0;
  }
}

export const questionSessionStore = new QuestionSessionStore();
