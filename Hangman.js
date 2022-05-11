$(document).ready(function () {
  $("#home").click(function () {
    $("#overlay").hide();
  });
  $("#xbox").click(function () {
    $("#overlay").hide();
  });
  $("#rules").click(function () {
    $("#overlay").show();
  });
});

//currently only works with capitalized letters
let answer = "HANGMAN";
let guesses = 0;
let mistakes = 0;
let guessedLetters = [];
const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

//initiates blankspot for answer
function blanks(answer) {
  let format = "";
  for (let i = 0; i < answer.length; i++) {
    format += "_ ";
  }
  document.getElementById("blankSpaces").innerText = format;
}
blanks(answer);

//WIP - determines if letter is in the answer, updates scores and canvas accordingly 
function hangman(letter) {
  document.getElementById("letter"+letter).disabled = true;
  guesses++;
  guessedLetters.push(letter);
  if (answer.includes(letter)) {
    console.log('letter in word');
  }
  else {
    mistakes++;
    updateCanvas(mistakes);
  }
}

let c = document.getElementById("theGallows");
let ctx = c.getContext("2d");
function updateCanvas(mistakes) {
  switch(mistakes) {
    case 1:
      ctx.moveTo(100, 350);
      ctx.lineTo(500, 350);
      break;
    case 2:
      ctx.moveTo(400, 350);
      ctx.lineTo(400, 50);
      break;
    case 3:
      ctx.moveTo(400, 50);
      ctx.lineTo(250, 50);
      break;
    case 4:
      ctx.moveTo(250, 50);
      ctx.lineTo(250, 100);
      break;
    case 5:
      ctx.beginPath();
      ctx.arc(250, 120, 20, 0, 2 * Math.PI);
      break;
    case 6:
      ctx.moveTo(250, 140);
      ctx.lineTo(250, 250);
      break;
    case 7:
      ctx.moveTo(250, 160);
      ctx.lineTo(200, 210);
      break;
    case 8:
      ctx.moveTo(250, 160);
      ctx.lineTo(300, 210);
      break;
    case 9:
      ctx.moveTo(250, 250);
      ctx.lineTo(200, 300);
      break;
    case 10:
      ctx.moveTo(250, 250);
      ctx.lineTo(300, 300);
  }
  ctx.stroke();
}