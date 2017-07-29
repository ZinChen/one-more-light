var card = document.querySelector('.card'),
    canvas = document.querySelector('#card-canvas'),
    context = canvas.getContext('2d');

var hue = 217,
    stars = [],
    count = 0,
    starsTotal = 30;

canvas.width = card.offsetWidth;
canvas.height = card.offsetHeight;

// context.globalCompositeOperation = 'source-over';
// context.globalAlpha = 0.8;
// context.fillStyle = 'hsla(200, 64%, 6%, 1)';
// context.fillRect(0, 0, canvas.width, canvas.height);

var Star = function() {
  this.x = canvas.width * Math.random();
  this.y = canvas.height * Math.random();
  // this.y = 0;
};

Star.prototype.draw = function(ctx) {
  ctx.fillStyle = 'white';
  ctx.fillRect(this.x, this.y, 3, 3);
  console.log('yep');
};

for (var i = 0; i < starsTotal; i++) {
  stars.push(new Star());
}

for (var i = 0; i < starsTotal; i++) {
  stars[i].draw(context);
}


console.log(canvas.width);
console.log(canvas.height);

console.log(card.offsetWidth);
console.log(card.offsetHeight);