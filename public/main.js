function pictionary() {
  const socket = io();
  let canvas, context, guessBox, drawing = false;

  const CLIENTSTATE = {
    drawer: false,
  };

  // handle rendering of guesses
  function displayGuess(guess) {
    let lastGuessBox = $('#last-guess');
    lastGuessBox.empty().text(guess);
  }

  // TODO: Refactor this to use form submission instead
  function onKeyDown(event) {
    if (event.keyCode != 13) {
      return;
    }

    console.log(guessBox.val());
    socket.emit('guess', guessBox.val());
    guessBox.val('');
  };

  guessBox = $('#guess input');
  guessBox.on('keydown', onKeyDown);

  // draw function takes position and
  function draw(position) {
    // QUTESTION: where do these methods come from on context?
    context.beginPath(); // <-- start drawing
    context.arc(position.x, position.y, 6, 0, 2 * Math.PI);  // <-- Draw circle
    context.fillStyle = "purple";
    context.fill();
  };

  canvas = $('canvas');
  context = canvas[0].getContext('2d');     // <-- What does this canvas object look like?
  canvas[0].width = canvas[0].offsetWidth;
  canvas[0].height = canvas[0].offsetHeight;

  // Check for touchstart support, use if it has
  // Use mousedown if not
  let clickDown = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'mousedown';
  let clickUp = ('ontouchstart' in document.documentElement) ? 'touchend' : 'mouseup';
  let cursorMove = ('ontouchstart' in document.documentElement) ? 'touchmove' : 'mousemove';

  // console.log(`clickDown: ${clickDown}`);
  // console.log(`clickUp: ${clickUp}`);
  // console.log(`cursorMove: ${cursorMove}`);

  canvas.on(cursorMove, event => {
    if (drawing) {
      let position;
      if (cursorMove === 'touchmove') {
        let offset = canvas.offset();
        position = {x: event.originalEvent.changedTouches[0].pageX - offset.left,
                        y: event.originalEvent.changedTouches[0].pageY - offset.top};
      } else {
        let offset = canvas.offset();
        position = {x: event.pageX - offset.left,
                        y: event.pageY - offset.top};
      }
      draw(position);
      socket.emit('draw event', position);
    }
  });

  socket.on('on connect', assignment => {
    console.log(assignment);
    if (assignment === 'drawer') {
      CLIENTSTATE.drawer = true;
    } else {
      CLIENTSTATE.drawer = false;
    }
  });

  socket.on('draw event', position => {
    draw(position);
  });

  canvas.on(clickDown, event => {
    drawing = true;
  });

  canvas.on(clickUp, event => {
    drawing = false;
  });

  socket.on('guess', guess => {
    console.log(guess);
    displayGuess(guess);
  });
};

$(document).ready(function() {
  pictionary();
});
