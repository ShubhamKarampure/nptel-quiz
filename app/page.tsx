"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X, Check, Github } from "lucide-react";

import week1 from "../data/week1";
import week2 from "../data/week2";
import week3 from "../data/week3";
import week4 from "../data/week4";
import week5 from "../data/week5";
import week6 from "../data/week6";
import week7 from "../data/week7";
import week8 from "../data/week8";
import week9 from "../data/week9";
import week10 from "../data/week10";
import week11 from "../data/week11";
import week12 from "../data/week12";

const quizData = {
  week_1: week1,
  week_2: week2,
  week_3: week3,
  week_4: week4,
  week_5: week5,
  week_6: week6,
  week_7: week7,
  week_8: week8,
  week_9: week9,
  week_10: week10,
  week_11: week11,
  week_12: week12,
};

type WeekKey = keyof typeof quizData;

const NPTELQuiz = () => {
  const [selectedWeek, setSelectedWeek] = useState<WeekKey | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const weeks = (Object.keys(quizData) as WeekKey[]).map((key, idx) => ({
    id: key,
    name: `Week ${idx + 1}`,
    title: quizData[key].title,
  }));

  const handleWeekSelect = (weekId: WeekKey) => {
    setSelectedWeek(weekId);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (answers[currentQuestion] !== undefined) return;

    setSelectedAnswer(optionIndex);
    setAnswers({
      ...answers,
      [currentQuestion]: optionIndex,
    });
  };

  const handleNext = () => {
    if (!selectedWeek) return;
    const totalQuestions = quizData[selectedWeek].questions.length;
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1] ?? null);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] ?? null);
    }
  };

  const handleFinish = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!selectedWeek) return { correct: 0, wrong: 0, total: 0 };
    const questions = quizData[selectedWeek].questions;
    let correct = 0;
    let wrong = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] !== undefined) {
        if (answers[idx] === q.correctAnswer) {
          correct++;
        } else {
          wrong++;
        }
      }
    });
    return { correct, wrong, total: questions.length };
  };

  const getCurrentScore = () => {
    if (!selectedWeek) return { correct: 0, wrong: 0 };
    const questions = quizData[selectedWeek].questions;
    let correct = 0;
    let wrong = 0;

    Object.keys(answers).forEach((qIndex) => {
      const idx = parseInt(qIndex);
      if (answers[idx] === questions[idx].correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    return { correct, wrong };
  };

  // Week Selection Screen
  if (!selectedWeek) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
              NPTEL Environment and Development Quiz
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Select a week to start the quiz
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {weeks.map((week) => (
              <button
                key={week.id}
                onClick={() => handleWeekSelect(week.id)}
                className="bg-gray-800 hover:bg-gray-700 p-4 sm:p-6 rounded-lg transition-all border-2 border-gray-700 hover:border-blue-500 text-left"
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {week.name}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">
                  {week.title}
                </p>
                {quizData[week.id].questions.length === 0 && (
                  <span className="text-xs text-yellow-500 mt-2 block">
                    No questions yet
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Footer Credits */}
          <div className="mt-12 pt-6 border-t border-gray-800 text-center">
            <a
              href="https://github.com/ShubhamKarampure"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <Github size={18} />
              <span>Created by Shubham Karampure</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const currentQuiz = quizData[selectedWeek];

  // Handle empty quiz
  if (currentQuiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 sm:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              No Questions Available
            </h2>
            <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
              This week's quiz hasn't been added yet.
            </p>
            <button
              onClick={() => setSelectedWeek(null)}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-sm sm:text-base"
            >
              Back to Weeks
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = currentQuiz.questions[currentQuestion];
  const totalQuestions = currentQuiz.questions.length;
  const isAnswered = answers[currentQuestion] !== undefined;
  const allAnswered = Object.keys(answers).length === totalQuestions;
  const { correct, wrong } = getCurrentScore();

  // Results Screen
  if (showResults) {
    const finalScore = calculateScore();
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 sm:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Quiz Completed!
            </h2>
            <div className="text-5xl sm:text-6xl font-bold mb-4">
              {finalScore.correct}/{finalScore.total}
            </div>
            <p className="text-lg sm:text-xl text-gray-400 mb-6 sm:mb-8">
              You got {finalScore.correct} correct and {finalScore.wrong} wrong
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => setSelectedWeek(null)}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-sm sm:text-base"
              >
                Back to Weeks
              </button>
              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setSelectedAnswer(null);
                  setAnswers({});
                  setShowResults(false);
                }}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold text-sm sm:text-base"
              >
                Retake Quiz
              </button>
            </div>
          </div>

          {/* Footer Credits */}
          <div className="mt-8 text-center">
            <a
              href="https://github.com/ShubhamKarampure"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <Github size={18} />
              <span>Created by Shubham Karampure</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  return (
    <div className="min-h-screen bg-gray-900 text-white p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
          <button
            onClick={() => setSelectedWeek(null)}
            className="text-gray-400 hover:text-white text-sm sm:text-base"
          >
            ← Back to Weeks
          </button>
          <h2 className="text-base sm:text-lg md:text-xl font-semibold">
            {currentQuiz.title}
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-400">
              {currentQuestion + 1}/{totalQuestions}
            </span>
            <div className="flex gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-red-900/30 px-2 sm:px-3 py-1 rounded text-sm sm:text-base">
                <X size={14} className="sm:w-4 sm:h-4" />
                <span>{wrong}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-green-900/30 px-2 sm:px-3 py-1 rounded text-sm sm:text-base">
                <Check size={14} className="sm:w-4 sm:h-4" />
                <span>{correct}</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5 sm:h-2">
            <div
              className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all"
              style={{
                width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 leading-relaxed">
            {currentQuestion + 1}. {question.question}
          </h3>

          <div className="space-y-3 sm:space-y-4">
            {question.options.map((option: string, idx: number): React.ReactElement => {
              const isSelected: boolean = selectedAnswer === idx;
              const isCorrect: boolean = idx === question.correctAnswer;
              const showCorrect: boolean = isAnswered && isCorrect;
              const showIncorrect: boolean = isAnswered && isSelected && !isCorrect;

              let buttonClass: string =
              "w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all ";

              if (showCorrect) {
              buttonClass += "border-green-500 bg-green-900/20";
              } else if (showIncorrect) {
              buttonClass += "border-red-500 bg-red-900/20";
              } else if (!isAnswered) {
              buttonClass +=
                "border-gray-700 bg-gray-800 hover:border-gray-600 cursor-pointer active:scale-98";
              } else {
              buttonClass += "border-gray-700 bg-gray-800";
              }

              return (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(idx)}
                disabled={isAnswered}
                className={buttonClass}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                <span className="font-semibold text-gray-400 min-w-[20px] sm:min-w-[24px] text-sm sm:text-base">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="flex-1 text-sm sm:text-base leading-relaxed">
                  {option}
                </span>
                {showCorrect && (
                  <Check className="text-green-500 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                )}
                {showIncorrect && (
                  <X className="text-red-500 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                )}
                </div>
              </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-3">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {currentQuestion === totalQuestions - 1 ? (
            <button
              onClick={handleFinish}
              disabled={!allAnswered}
              className="px-4 sm:px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base"
            >
              Finish
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight size={18} className="sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

        {/* Footer Credits */}
        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-gray-800 text-center">
          <a
            href="https://github.com/ShubhamKarampure"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
          >
            <Github size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>Created by Shubham Karampure</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NPTELQuiz;
