import http from 'http';
import express from 'express';
import socket_io from 'socket.io';
import path from 'path';

const app = express();
app.use(express.static('public'));

const server = http.Server(app);
const io = socket_io(server);

io.on('connection', socket => {
  console.log('User connected');

  socket.on('disconnect', socket => {
    console.log('User disconnected');
  });

  socket.on('draw event', position => {
    socket.broadcast.emit('draw event', position);
  });

  socket.on('guess', guess => {
    console.log(`A user guessed: ${guess}`);
    socket.broadcast.emit('guess', guess);
  });
});

server.listen(process.env.PORT || 8080, () => {
  console.log('Listening on', process.env.PORT || 8080  );
});
