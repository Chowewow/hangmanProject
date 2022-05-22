$(document).ready(function () {
  let count = 0;
  while (count < 26){
    let letter = String.fromCharCode(65 + count)
    $("#keys").append(`<button id="letter${letter}">${letter}</button>`);
    $(`#letter${letter}`).on("click", function(){
      guessLetter(`${letter}`);
    });
    count++;
  }

  $("#xBox").click(() =>  {
    $("#about").hide();
  });
  $("#rules").click(() =>  {
    $("#about").show();
  });
  $("#guessButton").click(() => {
    guessWord($("#guessedWord").val());
  });
  $("#guessedWord").on("keydown", function (event) {
    if (event.keyCode == 13) {
      guessWord($("#guessedWord").val());
      event.preventDefault();
    }
  });
  $("#playAgain").on("click", () => {
    location.reload();
  });

});


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
      sendUserInfo();
      alert("you win!");
    }
  }
  document.getElementById("blankSpaces").innerText = format;
}
output(); //initates blank spaces

//determines if letter is in the answer, updates scores and canvas accordingly
function guessLetter(letter) {
  document.getElementById("letter" + letter).disabled = true;
  guessedLetters.push(letter);
  if (answer.includes(letter) && hardMode) {
    guesses++;
    output();
    $("#score").html(`Guesses:  ${guesses}\nMistakes: <span style="color: red;">${mistakes/2}</span>`);
  } else if(answer.includes(letter) && !hardMode){
    guesses++;
    output();
    $("#score").html(`Guesses:  ${guesses}\nMistakes: <span style="color: red;">${mistakes}</span>`);
  } else if (!answer.includes(letter) && hardMode) {
    mistakes ++;
    updateCanvas(mistakes);
    mistakes++;
    updateCanvas(mistakes);
    $("#score").html(`Guesses:  ${guesses}\nMistakes: <span style="color: red;">${mistakes/2}</span>`);
  } else if (!answer.includes(letter) && !hardMode){
    mistakes++;
    updateCanvas(mistakes);
    $("#score").html(`Guesses:  ${guesses}\nMistakes: <span style="color: red;">${mistakes}</span>`);
  }
}

//disables all input buttons
function disableLetters() {
  document.getElementById("guessButton").disabled = true;
  let chr = "A";
  for (let i = 0; i < 26; i++) {
    chr = String.fromCharCode(65 + i);
    document.getElementById("letter" + chr).disabled = true;
  }
  document.getElementById("guessedWord").disabled = true;
}

//checks if guess is alphabetic and correct otherwise update mistakes
function guessWord(word) {
  if (/^[a-zA-Z()]+$/.test(word)) {
    if (word.toUpperCase() == answer) {
      guesses++;
      disableLetters();
      sendUserInfo();
      alert("you win!");
    } else {
      mistakes++;
      updateCanvas(mistakes);
      $("#score").html(`Guesses:  ${guesses}\nMistakes: <span style="color: red;">${mistakes}</span>`);
      if (hardMode) {
        mistakes++;
        updateCanvas(mistakes);
        $("#score").html(`Guesses:  ${guesses}\nMistakes: <span style="color: red;">${mistakes/2}</span>`);
      }
    }
    
  } else {
    alert("Alphabetical Characters Only")
  }
}

function changeDifficulty() {
  if (hardMode && (guesses == 0 && mistakes == 0)) {
    document.getElementById("difficulty").innerHTML = "Difficulty: Normal";
    hardMode = false;
  } else if (!hardMode && (guesses == 0 && mistakes == 0)) {
    document.getElementById("difficulty").innerHTML = `Difficulty: <span style="color: red;">Hard</span>`;
    hardMode = true;
  } else {
    alert("You can't change difficulty during the game");
  }
}

let canvas = document.getElementById("theGallows");
let ctx = canvas.getContext("2d");
//draws next part on canvas depending on mistakes made (lines get darker for some reason?)
function updateCanvas(mistakes) {
  ctx.lineWidth = 4;
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
      ctx.moveTo(402, 50);
      ctx.lineTo(248, 50);
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
    sendUserInfo();
    $("#loseScreen").show();
  }
}

function sendUserInfo() {
  if (hardMode) {
    var difficulty = "Hard"
    var userInfo = {
      'guesses': guesses, 
      'mistakes': mistakes/2, 
      'word': answer,
      'difficulty': difficulty,
    }
  } else {
    var difficulty = "Normal"
    var userInfo = {
      'guesses': guesses, 
      'mistakes': mistakes, 
      'word': answer,
      'difficulty': difficulty,
    }
  }
  const request = new XMLHttpRequest()
  request.open('POST', `/processUserInfo/${JSON.stringify(userInfo)}`)
  request.onload = () => {
    const flaskMessage = request.responseText
    console.log(flaskMessage)
  }
  request.send()
}
