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

let c = document.getElementById("theGallows");
let ctx = c.getContext("2d");
ctx.moveTo(100, 350);
ctx.lineTo(500, 350);
ctx.moveTo(400, 350);
ctx.lineTo(400, 50);
ctx.moveTo(400, 50);
ctx.lineTo(250, 50);
ctx.moveTo(250, 50);
ctx.lineTo(250, 100);
ctx.arc(250, 120, 20, 0, 2 * Math.PI);
ctx.moveTo(250, 140);
ctx.lineTo(250, 250);
ctx.moveTo(250, 160);
ctx.lineTo(200, 210);
ctx.moveTo(250, 160);
ctx.lineTo(300, 210);
ctx.moveTo(250, 250);
ctx.lineTo(200, 300);
ctx.moveTo(250, 250);
ctx.lineTo(300, 300)

ctx.stroke();
