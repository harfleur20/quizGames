import { quizQuestions } from "./quizQuestion.js";
console.log(quizQuestions);

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");

// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;
let quizSession = []; // Les 10 questions aléatoires pour ce quiz

// Event listeners
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

// Fonction pour tirer 10 questions uniques au hasard
function getRandomQuiz(quizQuestions, numQuestions = 10) {
  const questionsCopy = [...quizQuestions];
  const selectedQuestions = [];

  for (let i = 0; i < numQuestions; i++) {
    if (questionsCopy.length === 0) break;

    const randomIndex = Math.floor(Math.random() * questionsCopy.length);
    selectedQuestions.push(questionsCopy[randomIndex]);
    questionsCopy.splice(randomIndex, 1);
  }

  return selectedQuestions;
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = score;

  // Générer 10 questions aléatoires pour cette session
  quizSession = getRandomQuiz(quizQuestions, 10);

  totalQuestionsSpan.textContent = quizSession.length;
  maxScoreSpan.textContent = quizSession.length;

  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  showQuestion();
}

function showQuestion() {
  answersDisabled = false;

  const currentQuestion = quizSession[currentQuestionIndex];
  currentQuestionSpan.textContent = currentQuestionIndex + 1;
  const progressPercent = (currentQuestionIndex / quizSession.length) * 100;
  progressBar.style.width = progressPercent + "%";
  questionText.textContent = currentQuestion.question;

  answersContainer.innerHTML = "";
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");
    button.dataset.correct = answer.correct;
    button.addEventListener("click", selectAnswer);
    answersContainer.appendChild(button);
  });
}

function selectAnswer(event) {
  if (answersDisabled) return;

  answersDisabled = true;
  const selectButton = event.target;
  const isCorrect = selectButton.dataset.correct === "true";

  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else {
      button.classList.add("incorrect");
    }
  });

  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizSession.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 1000);
}

function showResults() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  finalScoreSpan.textContent = score;

  const percentage = (score / quizSession.length) * 100;

  if (percentage === 100) {
    resultMessage.textContent = "Bravo ! Tu es un génie !";
  } else if (percentage >= 60) {
    resultMessage.textContent = "Bien joué ! Continue comme ça !";
  } else if (percentage >= 40) {
    resultMessage.textContent = "Pas mal ! Réessaye pour faire mieux !";
  } else {
    resultMessage.textContent = "Continue à étudier ! Tu vas t'améliorer !";
  }
}

function restartQuiz() {
  // Remettre l'écran de démarrage
  resultScreen.classList.remove("active");
  startScreen.classList.add("active");
}
