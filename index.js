/* IMPORTS */
/* const $ = document.getElementsByClassName;
 */
const startScreen = document.getElementsByClassName("start-screen")[0];
const categoriesScreen =
  document.getElementsByClassName("categories-screen")[0];
const gameScreen = document.getElementsByClassName("game-screen")[0];
const playbtn = document.getElementsByClassName("playbtn")[0];
const backbtn = document.getElementsByClassName("backbtn");
const categorie = document.getElementsByClassName("categorie-card");
const answerOptions = document.getElementsByClassName("cuestion-card");
//VARIABLES GLOBALES
let questions;
let categorieName = [
  { name: "Science-Nature", img: "./assets/science-nature.svg", value: "17" },
  { name: "geography", img: "./assets/geography.svg", value: "22" },
  { name: "history", img: "./assets/history.svg", value: "23" },
  { name: "games", img: "./assets/game.svg", value: "15" },
  { name: "mythology", img: "./assets/mythology.svg", value: "20" },
];
let cuestionIdx = 0;

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
    questions = await fetchQuestions(item.value);
    loadCuestion(questions.results[cuestionIdx]);
    //navegar a la siguiente pagina
    categoriesScreen.style.display = "none";
    gameScreen.style.display = "grid";
  });
});

//INTERACCIONES CON RESPUESTAS PANTALLA GAME
for (const option of answerOptions) {
  option.addEventListener("click", async (e) => {
    let correct_answer = questions.results[cuestionIdx].correct_answer;
    let answerChosen = option.getElementsByTagName("h5")[0].textContent;

    let succes = getComputedStyle(document.documentElement).getPropertyValue(
      "--succes"
    );
    let faliure = getComputedStyle(document.documentElement).getPropertyValue(
      "--faliure"
    );
    let white = getComputedStyle(document.documentElement).getPropertyValue(
      "--white"
    );

    if (answerChosen === correct_answer) option.classList.add("succes");
    else option.classList.add("faliure");

    setTimeout(() => {
      clearColors(option);
      nextCuestion();
    }, 700);
  });
}

// Agrega preguntas a la pantalla del juego
function loadCuestion(data) {
  let question = data.question;
  let answers = [...data.incorrect_answers, data.correct_answer];
  let pageOptions = document.getElementsByClassName("cuestion-card");
  let pageQuestion = document.getElementsByClassName("cuestion-tittle")[0];

  //load cuestion
  pageQuestion.textContent = question;
  //load options
  answers = shuffle(answers);
  answers.forEach((answer, idx) => {
    let option = pageOptions[idx].getElementsByTagName("h5")[0];
    option.textContent = answer;
  });
}
function nextCuestion() {
  cuestionIdx += 1;
  if (cuestionIdx > questions.results.length - 1) {
    backbtn[0].click();
    return;
  }
  loadCuestion(questions.results[cuestionIdx]);
}

/* function clearColors(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
} */

function clearColors(option) {
  option.classList.remove("faliure");
  option.classList.remove("succes");
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
//FETCH DATA
async function fetchQuestions(categorie) {
  let link = `https://opentdb.com/api.php?amount=10&category=${categorie}&type=multiple`;
  let questions;
  await fetch(link)
    .then((resp) => resp.json())
    .then((data) => (questions = data));

  return questions;
}
