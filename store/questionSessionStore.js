import { makeAutoObservable } from 'mobx';

class QuestionSessionStore {
  questions = [];
  selectedLesson = null;
  score = 0;

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
  clear() {
    this.questions = [];
    this.selectedLesson = null;
    this.score = 0;
    
  }
}

export const questionSessionStore = new QuestionSessionStore();
