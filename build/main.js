// 08.08.2017
// ZinChen
//
// Visual Effects inspired by and partially using:
// https://codepen.io/giana/pen/qbWNYy - Stars
// https://codepen.io/bigsweater/pen/KbCIh - Interactive Canvas Starfield
// https://codepen.io/ariona/pen/JopOOr - Hover Plane 3d
// https://tympanus.net/Development/TiltHoverEffects/ - Tilt Hover Effect
//
// Audio tracks taken from Linkin Park live performance in Germany Southside Festival 2017 06.25
// #1. One More Light
// #2. Leave Out All The Rest
// #3. Bleed It Out

function random(min, max) {
  return Math.random() * (max - min) + min;
}

// from http://www.quirksmode.org/js/events_properties.html#position
function getMousePos(e) {
  var posx = 0, posy = 0;
  if (!e) var e = window.event;
  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  return { x : posx, y : posy };
}

// Helper vars and functions.
function extend( a, b ) {
  for( var key in b ) {
    if( b.hasOwnProperty( key ) ) {
      a[key] = b[key];
    }
  }
  return a;
}

var Stars = function(options) {
  var card = options.card,
      cardImg = card.querySelector('img'),
      canvas = document.querySelector('#card-canvas'),
      starCanvas = document.createElement('canvas'),
      context = canvas.getContext('2d'),
      canvasZ, starContext,
      hue = 217, // 52
      stars = [],
      speed = 0.1,
      count = 0,
      starSize = 10,
      starsTotal = 200;

  var initCanvas = function() {
    canvas.width = cardImg.offsetWidth;
    canvas.height = cardImg.offsetHeight;
    canvasZ = (canvas.width + canvas.height) / 2;
  };

  var initStarCanvas = function() {
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

  var generateStars = function() {
   for (var i = 0; i < starsTotal; i++) {
      var star = {
        x: canvas.width * Math.random(),
        y: canvas.height * random(-0.1, 1),
        z: random(canvasZ/3, canvasZ),
        baseAlpha: random(0.7, 1),
        alphaRange: random(0.1, 0.3)
      };
      star.alpha = star.baseAlpha;
      star.zRatio = star.z / canvasZ;
      star.width = starCanvas.width * star.zRatio;
      star.height = starCanvas.height * star.zRatio;
      stars.push(star);
    }
  };

  var init = function() {
    initCanvas();
    initStarCanvas();
    generateStars();
  };

  var moveStars = function() {
    stars.forEach(function(star, i, stars){
      if (star.y > -1 * starCanvas.height) {
        stars[i].y = star.y -= speed * star.zRatio;
      } else {
        stars[i].x = canvas.width * Math.random();
        stars[i].y = star.y = canvas.height;
      }
    });
  };

  var countStarAlpha = function(i) {
    var star = stars[i];
    var flick = Math.floor(random(1, 9));
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

  this.onResize = function() {
    var oldWidth = canvas.width,
        oldHeight = canvas.height,
        oldZ = canvasZ;

    initCanvas();
    initStarCanvas();

    var widthRatio = canvas.width / oldWidth,
        heightRatio = canvas.height / oldHeight,
        zRatio = canvasZ / oldZ;

    for (var i = 0; i < starsTotal; i++) {
      stars[i].x *= widthRatio;
      stars[i].y *= heightRatio;
      stars[i].z *= zRatio;
      stars[i].zRatio = stars[i].z / canvasZ;
    }
  };

  init();
};

var Tilt = function(options) {
  var card = options.card,
      shine = card.querySelector('.card-shine'),
      moveOpt = {
        card: {
          t: 0,
          r: 0.01
        },
        shine: {
          t: 0.5,
          r: 0
        }
      };

  var setTransform = function(el, pos, opt) {
    var val = {
      t: {
        x: (window.innerWidth / 2 - pos.x) * opt.t,
        y: (window.innerHeight / 2 - pos.y) * opt.t
      },
      r: {
        x: (window.innerHeight / 2 - pos.y) * opt.r,
        y: -1 * (window.innerWidth / 2 - pos.x) * opt.r
      }
    },
    transformStyle = [
      'translateX(', val.t.x , 'px)',
      'translateY(', val.t.y, 'px)',
      'rotateX(', val.r.x, 'deg)',
      'rotateY(', val.r.y, 'deg)',
    ];
    transformStyle = transformStyle.join('');

    el.style.WebkitTransform =
    el.style.transform = transformStyle;
  };

  this.onMousemove = function() {
    var mousepos = getMousePos();
    setTransform(card, mousepos, moveOpt.card);
    setTransform(shine, mousepos, moveOpt.shine);
  };
};

var Sound = function() {
  var playerControlsEl = document.querySelector('.player-controls'),
      playPauseBtn = playerControlsEl.querySelector('.play-pause'),
      nextBtn = playerControlsEl.querySelector('.next'),
      playIcon = playPauseBtn.querySelector('.fa-play'),
      pauseIcon = playPauseBtn.querySelector('.fa-pause'),
      tracks = [
        'Linkin_Park_2017-06-25_Southside_Festival_Germany_-_One_More_Light.mp3',
        'Linkin_Park_2017-06-25_Southside_Festival_Germany_-_Leave_Out_All_The_Rest.mp3',
        'Linkin_Park_2017-06-25_Southside_Festival_Germany_-_Bleed_It_Out.mp3'
      ],
      folder = 'https://zinchenlab.ru/one-more-light/audio/',
      audio = new Audio(),
      inited = false,
      currentIndex = 0;

  var togglePlayButton = function(action) {
    if (action && action == 'play') {
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
    } else if (action && action == 'pause') {
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
    } else {
      playIcon.classList.toggle('hidden');
      pauseIcon.classList.toggle('hidden');
    }
  };

  var toggleDisabled = function(el) {
    if (el.hasAttribute('disabled')) {
      el.removeAttribute('disabled');
    } else {
      el.setAttribute('disabled', 'disabled');
    }
  };

  var setNextTrack = function() {
    currentIndex = currentIndex == tracks.length - 1 ? 0 : ++currentIndex;
    audio.src = folder + tracks[currentIndex];
    togglePlayButton('play');
    toggleDisabled(playPauseBtn);
    toggleDisabled(nextBtn);
  };

  this.init = function() {

    audio.addEventListener('canplay', function() {
      togglePlayButton('pause');
      toggleDisabled(playPauseBtn);
      toggleDisabled(nextBtn);
      audio.play();
    });

    audio.addEventListener('ended', function() {
      setNextTrack();
    });

    nextBtn.addEventListener('click', function() {
      setNextTrack();
    });

    playPauseBtn.addEventListener('click', function() {
      togglePlayButton();
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    });
  };

  this.start = function() {
    if (!inited) {
      this.init();
    }
    audio.src = folder + tracks[0];
  };
};

var App = function() {
  var animId,
      card = document.querySelector('.card'),
      stars = new Stars({card: card}),
      tilt = new Tilt({card: card}),
      sound = new Sound();

  var render = function() {
    stars.draw();
    animId = window.requestAnimationFrame(render);
  };

  this.start = function() {
    render();
    sound.start();
  };

  this.stop = function() {
    window.cancelAnimationFrame(animId);
  };

  window.addEventListener('resize', function() {
    stars.onResize();
  }, false);

  document.addEventListener('mousemove', function() {
    tilt.onMousemove();
  });
};
var app = new App(),
    imgs = document.images,
    len = imgs.length,
    counter = 0;

[].forEach.call(imgs, function( img ) {
  img.addEventListener( 'load', incrementCounter, false );
});

function incrementCounter() {
  counter++;
  if ( counter === len ) {
    setTimeout(function() {
      app.start();
    }, 1000)
  }
}

