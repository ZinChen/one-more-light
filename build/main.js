//
// Inspired by
//
// https://codepen.io/giana/pen/qbWNYy - Stars
// https://codepen.io/bigsweater/pen/KbCIh - Interactive Canvas Starfield

function random(min, max) {
  return Math.random() * (max - min) + min;
}

var Stars = function() {
  var card = document.querySelector('.card'),
      canvas = document.querySelector('#card-canvas'),
      context = canvas.getContext('2d'),
      canvasZ, starCanvas, starContext,
      hue = 217, // 52
      stars = [],
      count = 0,
      starSize = 6,
      starsTotal = 100;

  var initStarCanvas = function() {
    starCanvas = document.createElement('canvas');
    starCanvas.height = starCanvas.width = canvas.width  * starSize / 100;
    starContext = starCanvas.getContext('2d');
    var gradientRadius = starCanvas.width / 2,
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
    starGradient.addColorStop(0.3, 'hsla(0, 0%, 100%, 0.05)');
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
  };

  var init = function() {
    canvas.width = card.offsetWidth;
    canvas.height = card.offsetHeight;
    canvasZ = (canvas.width + canvas.height) / 2;
    initStarCanvas();

    for (var i = 0; i < starsTotal; i++) {
      var star = {
        x: canvas.width * Math.random(),
        y: canvas.height * Math.random(),
        z: random(canvasZ/3, canvasZ),
        baseAlpha: Math.random(),
        alphaRange: random(0, 0.25)
      };
      star.alpha = star.baseAlpha;
      star.zRatio = star.z / canvasZ;
      star.width = starCanvas.width * star.zRatio;
      star.height = starCanvas.height * star.zRatio;
      stars.push(star);
    }
  };

  var moveStars = function() {
    stars.forEach(function(star, i, stars){
      if (star.y > -1 * starCanvas.height / 2) {
        stars[i].y = star.y -= 0.5 * star.zRatio;
      } else {
        stars[i].x = canvas.width * Math.random();
        stars[i].y = star.y = canvas.height;
      }
    });
  };

  var countStarAlpha = function(i) {
    var star = stars[i];
    var flick = Math.floor(random(1, 15));
    var alphaLowRange = star.baseAlpha - star.alphaRange;
    var alphaHighRange = star.baseAlpha + star.alphaRange;
    if (flick == 1 && star.alpha > alphaLowRange) {
      star.alpha -= 0.05;
    }
    if (flick == 2 && star.alpha < alphaHighRange) {
      star.alpha += 0.05;
    }
    stars[i] = star;
  };

  this.draw = function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(function(star, i) {
      countStarAlpha(i);
      context.globalAlpha = star.alpha;
      context.drawImage(starCanvas, star.x, star.y, star.width, star.height);
    });
    moveStars();
  };

  init();
};

var App = function() {
  var animId,
      stars = new Stars();

  var render = function() {
    stars.draw();
    animId = window.requestAnimationFrame(render);
  };

  this.start = function() {
    render();
  };

  this.stop = function() {
    window.cancelAnimationFrame(animId);
  };
};

var app = new App();
app.start();

// console.log(canvas.width);
// console.log(canvas.height);

// console.log(card.offsetWidth);
// console.log(card.offsetHeight);