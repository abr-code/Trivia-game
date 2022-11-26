/* IMPORTS */
/* const $ = document.getElementsByClassName;
 */
const startScreen = document.getElementsByClassName("start-screen")[0];
const categoriesScreen =
  document.getElementsByClassName("categories-screen")[0];
const gameScreen = document.getElementsByClassName("game-screen")[0];
const statsScreen = document.getElementsByClassName("stats-screen")[0];
const playbtn = document.getElementsByClassName("playbtn")[0];
const backbtn = document.getElementsByClassName("backbtn");
const categorie = document.getElementsByClassName("categorie-card");
const answerOptions = document.getElementsByClassName("question-card");
const statsBtns = document.getElementsByClassName("stats__btn");
//VARIABLES GLOBALES
let questions;
let categorieName = [
  { name: "Science-Nature", img: "./assets/science-nature.svg", value: "17" },
  { name: "geography", img: "./assets/geography.svg", value: "22" },
  { name: "history", img: "./assets/history.svg", value: "23" },
  { name: "games", img: "./assets/game.svg", value: "15" },
  { name: "mythology", img: "./assets/mythology.svg", value: "20" },
];
let questionIdx = 8;
let correctAnswers = 0;

//LOGICA
/* Interacciones pantalla inicial */
playbtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  categoriesScreen.style.display = "block";
});

/* INTERACCOINES CON CATEGORIAS */
for (const item of backbtn) {
  //hay mas de un backbtn en el HTML
  item.addEventListener("click", () => {
    categoriesScreen.style.display = "none";
    gameScreen.style.display = "none";
    startScreen.style.display = "flex";
  });
}
//agrega nombres e imagenes de las categorias y interacciones
categorieName.forEach(async (item, idx) => {
  let text = categorie[idx].getElementsByTagName("figcaption")[0];
  let img = categorie[idx].getElementsByTagName("img")[0];
  text.textContent = item.name;
  img.src = item.img;

  //interacciones para las categorias
  categorie[idx].addEventListener("click", async () => {
    questions = await fetchquestions(item.value);
    loadquestion(questions.results[questionIdx]);
    //navegar a la siguiente pagina
    categoriesScreen.style.display = "none";
    gameScreen.style.display = "grid";
  });
});

//INTERACCIONES CON RESPUESTAS PANTALLA GAME
for (const option of answerOptions) {
  option.addEventListener("click", async (e) => {
    let correct_answer = questions.results[questionIdx].correct_answer;
    let answerChosen = option.getElementsByTagName("h5")[0].textContent;

    if (answerChosen === correct_answer) {
      option.classList.add("succes");
      correctAnswers += 1;
    } else option.classList.add("faliure");

    setTimeout(() => {
      clearColors(option);
      nextquestion();
    }, 700);
  });
}

//interaccions pantalla resultado
statsBtns[0].addEventListener("click", () => {
  clearStats();
  statsScreen.style.display = "none";
  categoriesScreen.style.display = "block";
});

statsBtns[1].addEventListener("click", () => {
  clearStats();
  statsScreen.style.display = "none";
  backbtn[0].click();
});

//FETCH DATA
async function fetchquestions(categorie) {
  let link = `https://opentdb.com/api.php?amount=10&category=${categorie}&type=multiple`;
  let questions;
  await fetch(link)
    .then((resp) => resp.json())
    .then((data) => (questions = data));

  return questions;
}
// Agrega preguntas a la pantalla del juego
function loadquestion(data) {
  let question = data.question;
  let answers = [...data.incorrect_answers, data.correct_answer];
  let pageOptions = document.getElementsByClassName("question-card");
  let pageQuestion = document.getElementsByClassName("question-tittle")[0];

  //process special characters

  question = decodeHtml(question);
  answers = answers.map((answer) => {
    return (answer = decodeHtml(answer));
  });
  //load question
  pageQuestion.textContent = question;
  //load options
  answers = shuffle(answers);
  answers.forEach((answer, idx) => {
    let option = pageOptions[idx].getElementsByTagName("h5")[0];
    option.textContent = answer;
  });
}
function nextquestion() {
  questionIdx += 1;
  if (questionIdx >= 10) {
    statsNumberColor();
    goToStats();
    return;
  }
  /*   if (questionIdx > questions.results.length - 1) {
    backbtn[0].click();
    return;
  } */
  loadquestion(questions.results[questionIdx]);
}
// regresa el fondo de la respuesta seleccionada a blanco
function clearColors(option) {
  option.classList.remove("faliure");
  option.classList.remove("succes");
}

//presenta la pantalla stats
function goToStats() {
  let number = document.getElementsByClassName("stats-number")[0];
  number.textContent = `${correctAnswers}/10`;
  gameScreen.style.display = "none";
  statsScreen.style.display = "block";
}
// colorea la pantalla stats
function statsNumberColor() {
  let number = document.getElementsByClassName("stats-number")[0];
  if (correctAnswers > 5) number.classList.add("stats-number-succes");
  else {
    let statsImg = document.getElementsByClassName("stats-img")[0];

    number.classList.add("stats-number-faliure");
    statsImg.style.backgroundImage = "url(./assets/star-half-solid.svg)";
  }
}

function clearStats() {
  let number = document.getElementsByClassName("stats-number")[0];
  questionIdx = 0;
  correctAnswers = 0;
  number.classList.remove("stats-number-faliure");
  number.classList.remove("stats-number-succes");
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

//PROCES TEXT FOR ESPECIAL CHARACTERS
function decodeHtml(html) {
  html = html.replace(/\u200c/g, "");
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
