var card = document.querySelector('.card'),
    canvas = document.querySelector('#card-canvas'),
    context = canvas.getContext('2d'),
    starCanvas = document.createElement('canvas'),
    starContext = starCanvas.getContext('2d');


    canvas.width = card.offsetWidth;
    canvas.height = card.offsetHeight;
    starCanvas.height = starCanvas.width = canvas.width / 15;

var hue = 217, // 52
    stars = [],
    count = 0,
    starsTotal = 30,
    gradientRadius = starCanvas.width / 2,
    starGradient = starContext.createRadialGradient(
      gradientRadius,
      gradientRadius,
      0,
      gradientRadius,
      gradientRadius,
      gradientRadius
    );
    starGradient.addColorStop(0.025, '#fff');
    starGradient.addColorStop(0.1, 'hsla(0, 0%, 100%, 0.3)');
    starGradient.addColorStop(0.2, 'hsla(0, 0%, 100%, 0.05)');
    // starGradient.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%');
    // starGradient.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%');
    starGradient.addColorStop(1, 'transparent');

    starContext.fillStyle = starGradient;
    starContext.beginPath();
    starContext.arc(
      gradientRadius,
      gradientRadius,
      gradientRadius,
      0,
      Math.PI * 2
    );
    starContext.fill();


// context.globalCompositeOperation = 'source-over';
// context.globalAlpha = 0.8;
// context.fillStyle = 'hsla(200, 64%, 6%, 1)';
// context.fillRect(0, 0, canvas.width, canvas.height);

var Lights = function() {
  this.x = canvas.width * Math.random();
  this.y = canvas.height * Math.random();
  // this.y = 0;
};

Lights.prototype.draw = function() {
  // ctx.fillStyle = 'white';
  // ctx.fillRect(this.x, this.y, 3, 3);
  context.drawImage(starCanvas, this.x, this.y);
  console.log('yep');
};

for (var i = 0; i < starsTotal; i++) {
  stars.push(new Lights());
}

for (var i = 0; i < starsTotal; i++) {
  stars[i].draw();
}


console.log(canvas.width);
console.log(canvas.height);

console.log(card.offsetWidth);
console.log(card.offsetHeight);