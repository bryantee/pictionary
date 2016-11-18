function pictionary() {
  const socket = io();
  let canvas, context, drawing = false;

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
  canvas.on('mousemove', event => {
    if (drawing) {
      let offset = canvas.offset();
      let position = {x: event.pageX - offset.left,
                      y: event.pageY - offset.top};
      draw(position);
      socket.emit('draw event', position);
    }
  });

  socket.on('draw event', position => {
    draw(position);
  });

  canvas.on('mousedown', event => {
    drawing = true;
  });

  canvas.on('mouseup', event => {
    drawing = false;
  });
};

$(document).ready(function() {
  pictionary();
});
