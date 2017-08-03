
var Stars = function() {
  var card = document.querySelector('.card'),
      canvas = document.querySelector('#card-canvas'),
      context = canvas.getContext('2d'),
      starCanvas, starContext,
      hue = 217, // 52
      stars = [],
      count = 0,
      starSize = 12,
      starsTotal = 30;

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
  };

  var init = function() {
    canvas.width = card.offsetWidth;
    canvas.height = card.offsetHeight;
    initStarCanvas();

    for (var i = 0; i < starsTotal; i++) {
      var star = {
        x: canvas.width * Math.random(),
        y: canvas.height * Math.random(),
        alpha: 1
      };
       // this.y = 0;
      stars.push(star);
    }
  };

  var moveStars = function() {
    stars.forEach(function(star, i, stars){
      if (star.y > -1 * starCanvas.height / 2) {
        stars[i].y = star.y -= 0.5;
      } else {
        stars[i].y = star.y = canvas.height;
      }
    });
  };

  this.draw = function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(function(star) {
      var flick = Math.floor(Math.random() * 20 + 1);
      if (flick == 1 && star.alpha > 0) { star.alpha -= 0.05; }
      if (flick == 2 && star.alpha < 1) { star.alpha += 0.05; }
      context.globalAlpha = star.alpha;
      context.drawImage(starCanvas, star.x, star.y);
    });
    moveStars();
  };

  init();
};

var App = function() {
  var animId,
      stars = new Stars();;

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