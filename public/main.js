function pictionary() {
  let canvas, context;

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
    let offset = canvas.offset();
    let position = {x: event.pageX - offset.left,
                    y: event.pageY - offset.top};
    draw(position);
  });
};

$(document).ready(function() {
  const socket = io();
  pictionary();
});
