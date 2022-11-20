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
//LOGICA
/* Interacciones pantalla inicial */
playbtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  categoriesScreen.style.display = "block";
});

/* Interacciones pantalla categorias */
for (const item of backbtn) {
  //hay mas de un backbtn en el HTML
  item.addEventListener("click", () => {
    categoriesScreen.style.display = "none";
    gameScreen.style.display = "none";
    startScreen.style.display = "flex";
  });
}

for (const item of categorie) {
  item.addEventListener("click", () => {
    categoriesScreen.style.display = "none";
    gameScreen.style.display = "grid";
  });
}
