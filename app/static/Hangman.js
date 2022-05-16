$(document).ready(function () {
  $("#home").click(function () {
    $("#overlay").hide();
  });
  $("#xBox").click(function () {
    $("#overlay").hide();
  });
  $("#rules").click(function () {
    $("#overlay").show();
  });
  $("#guessButton").click(function () {
    guessWord($("#guessedWord").val());
  });
  $("#guessedWord").on("keydown", function (event) {
    if (event.keyCode == 13) {
      guessWord($("#guessedWord").val());
      event.preventDefault();
    }
  });
  // $("#difficulty").on("click", function() {
  //   if (hardMode) {
  //     $("#difficulty").val("Normal Mode");
  //     hardMode = false;
  //     console.log("Normal mode on");
  //   }
  //   else {
  //     $("#difficulty").val("Hard Mode");
  //     hardMode = true;
  //   }
  // });
});

//currently only works with capitalized letters, temporary answer of "HANGMAN"
let answer = $("#answer").text();
let guesses = 0;
let mistakes = 0;
let guessedLetters = [];
let correctGuesses = 0;
let hardMode = false;


//outputs blank spaces or correctly guessed letters in position
function output() {
  let format = "";
  correctGuesses = 0;
  for (let i = 0; i < answer.length; i++) {
    if (guessedLetters.includes(answer.charAt(i))) {
      format += answer.charAt(i);
      correctGuesses++;
    } else {
      format += "_";
    }
    if (i < answer.length - 1) {
      format += " ";
    }
    if (correctGuesses == answer.length) {
      disableLetters();
      alert("you win!");
    }
  }
  document.getElementById("blankSpaces").innerText = format;
}
output(); //initates blank spaces

//determines if letter is in the answer, updates scores and canvas accordingly
function guessLetter(letter) {
  document.getElementById("letter" + letter).disabled = true;
  guesses++;
  guessedLetters.push(letter);
  if (answer.includes(letter)) {
    output();
  } else {
    mistakes++;
    updateCanvas(mistakes);
    if (hardMode) {
      mistakes++;
      updateCanvas(mistakes);
    }
  }
}

//disables all input buttons
function disableLetters() {
  let chr = "A";
  document.getElementById("guessButton").disabled = true;
  for (let i = 0; i < 26; i++) {
    chr = String.fromCharCode(65 + i);
    document.getElementById("letter" + chr).disabled = true;
  }
}

//checks if guess is alphabetic and correct otherwise update mistakes
function guessWord(word) {
  if (/^[a-zA-Z()]+$/.test(word)) {
    guesses++;
    if (word.toUpperCase() == answer) {
      disableLetters();
      alert("you win!");
    } else {
      mistakes++;
      updateCanvas(mistakes);
      if (hardMode) {
        mistakes++;
        updateCanvas(mistakes);
      }
    }
  }
}

function changeDifficulty() {
  if (hardMode) {
    console.log("Normal mode on");
    document.getElementById("difficulty").innerHTML = "Normal Mode";
    hardMode = false;
  } else {
    console.log("Normal mode off");
    document.getElementById("difficulty").innerHTML = "Hard Mode";
    hardMode = true;
  }
}

let canvas = document.getElementById("theGallows");
let ctx = canvas.getContext("2d");
//draws next part on canvas depending on mistakes made (lines get darker for some reason?)
function updateCanvas(mistakes) {
  switch (mistakes) {
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
      ctx.moveTo(240, 110);
      ctx.lineTo(260, 120);
      ctx.moveTo(240, 120);
      ctx.lineTo(260, 110);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(250, 135, 10, Math.PI, 0);
  }
  ctx.stroke();
  if (mistakes == 10) {
    disableLetters();
    $("#loseScreen").show();
  }
}
