// QuestionSessionStore.js
import { makeAutoObservable } from 'mobx';

class QuestionSessionStore {
  questions = [];
  selectedLesson = null;

  constructor() {
    makeAutoObservable(this);
  }

  setQuestions(questions) {
    this.questions = questions;
  }

  setSelectedLesson(lesson) {
    this.selectedLesson = lesson;
  }

  clear() {
    this.questions = [];
    this.selectedLesson = null;
  }
}

export const questionSessionStore = new QuestionSessionStore();
