"use strict";

const select = {
  gameBoard: document.getElementById("game"),
  currentGuesses: document.getElementById("current"),
  lowestGuessesLevel1: document.getElementById("lowest-level1"),
  lowestGuessesLevel2: document.getElementById("lowest-level2"),
  startButtonLevel1: document.getElementById("start-level1"),
  startButtonLevel2: document.getElementById("start-level2"),
  resetButton: document.getElementById("reset"),
  instructionsScreen: document.getElementById("instructions-screen"),
  gameScreen: document.getElementById("game-screen"),
};

const COLORS_LEVEL1 = ["red", "blue", "green", "orange", "purple","red", "blue", "green", "orange", "purple"];
const COLORS_LEVEL2 = ["red", "blue", "green", "orange", "purple", "yellow", "pink", "brown", "cyan", "black","red", "blue", "green", "orange", "purple", "yellow", "pink", "brown", "cyan", "black"];

let flippedCards = [];
let numGuesses = 0;
let lowestGuessesLevel1 = Infinity;
let lowestGuessesLevel2 = Infinity;
let level = 0;


document.addEventListener("DOMContentLoaded", function () {

  select.startButtonLevel1.addEventListener("click", function () {
    if (!select.startButtonLevel1.classList.contains("disabled")) {
      removeCards();
      createCards(COLORS_LEVEL1);
      level = 0;
      toggleScreen(select.instructionsScreen, select.gameScreen);
    }
  });


  
  select.startButtonLevel2.addEventListener("click", function () {
    if (!select.startButtonLevel2.classList.contains("disabled")) {
      removeCards();
      createCards(shuffle(COLORS_LEVEL2));
      level = 1;
      toggleScreen(select.instructionsScreen, select.gameScreen);
    }
  });

 
  
  select.resetButton.addEventListener("click", function () {
    removeCards();
    select.startButtonLevel1.classList.remove("disabled");
    select.startButtonLevel2.classList.remove("disabled");
    select.resetButton.classList.remove("disabled"); 
    lowestGuessesLevel1 = Infinity;
    lowestGuessesLevel2 = Infinity;
    select.lowestGuessesLevel1.innerHTML = lowestGuessesLevel1;
    select.lowestGuessesLevel2.innerHTML = lowestGuessesLevel2;
  });

  
  select.resetButton.classList.remove("disabled");
});

select.resetButton.addEventListener("click", function () {
  if (
    !select.resetButton.classList.contains("disabled") &&
    (level === 0 || level === 1)
  ) {
    removeCards();
    select.startButtonLevel1.classList.remove("disabled");
    select.startButtonLevel2.classList.remove("disabled");
  }
});

function toggleScreen(hideScreen, showScreen) {
  hideScreen.classList.remove("active");
  showScreen.classList.add("active");
}


function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function createCards(colors) {
  for (let color of colors) {
    let cardItem = document.createElement("div");
    cardItem.className = color + " card";
    cardItem.addEventListener("click", handleCardClick);
    select.gameBoard.appendChild(cardItem);
  }
}


function handleCardClick(event) {
  let card = event.target;
  let isFlipped = card.classList.contains("flipped");
  let isMatched = card.classList.contains("matched");


  if (flippedCards.length < 2 && !isFlipped && !isMatched) {
    flipCard(card);
  }


  if (
    select.gameBoard.getElementsByClassName("card").length ===
    select.gameBoard.getElementsByClassName("matched").length
  ) {
    if (level === 0) {
      select.startButtonLevel2.classList.remove("disabled");
      level = 1;
      if (numGuesses < lowestGuessesLevel1) {
        lowestGuessesLevel1 = numGuesses;
        select.lowestGuessesLevel1.innerHTML = lowestGuessesLevel1;
      }
    } else if (level === 1) {
      select.resetButton.classList.remove("disabled");
      if (numGuesses < lowestGuessesLevel2) {
        lowestGuessesLevel2 = numGuesses;
        select.lowestGuessesLevel2.innerHTML = lowestGuessesLevel2;
      }
    }
  }
}


function flipCard(card) {
  card.classList.add("flipped");
  flippedCards.push(card);
  numGuesses++;
  select.currentGuesses.innerHTML = numGuesses;

  if (flippedCards.length === 2) {
    if (flippedCards[0].className === flippedCards[1].className) {
      matchedCards(flippedCards[0], flippedCards[1]);
    } else {
      setTimeout(function () {
        unFlipCard(flippedCards[0]);
        unFlipCard(flippedCards[1]);
        flippedCards = [];
      }, 1000);
    }
  }
}


function matchedCards(card1, card2) {
  card1.classList.add("matched");
  card2.classList.add("matched");
  flippedCards = [];
}


function unFlipCard(card) {
  card.classList.remove("flipped");
}

function removeCards() {
  let cards = Array.from(select.gameBoard.getElementsByClassName("card"));
  cards.forEach((card) => card.remove());
  flippedCards = [];
  numGuesses = 0;
  select.currentGuesses.innerHTML = numGuesses;
  select.resetButton.classList.add("disabled");
  select.startButtonLevel1.classList.remove("disabled");
  select.startButtonLevel2.classList.remove("disabled");
}
