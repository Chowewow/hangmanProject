"use strict";

function wordleLab(target, value) {
  if (target.length != 5 || value.length != 5) {
    alert("Enter a 5 letter word");
  } else {
    let first = target;
    let second = value;
    let answer = "The ";
    let track = 0;
    let location = "";
    for (let x of first) {
      switch (track) {
        case 0:
          location = "first";
          break;
        case 1:
          location = "second";
          break;
        case 2:
          location = "third";
          break;
        case 3:
          location = "fourth";
          break;
        case 4:
          location = "fifth";
          break;
      }
      let track2 = 0;
      for (let y of second) {
        if (x == y && track == track2) {
          answer += `${location} letter is in the correct position, `;
          break;
        } else if (x == y && track != track2) {
          answer += `${location} letter is in the wrong position, `;
          break;
        }
        if (track2 == 4) {
          answer += `${location} letter doesn't appear in the word ${second}, `;
          break;
        }
        track2 += 1;
      }
      track += 1;
      console.log(x, second.charAt(track), track);
    }
    document.getElementById("demo").innerHTML =
      answer.substring(answer.length - 2, 0) + ".";
    return answer;
  }
}

$(window).on('load', () => {
  document.getElementById('target').value = "hehe";
})