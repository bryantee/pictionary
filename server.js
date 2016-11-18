import http from 'http';
import express from 'express';
import socket_io from 'socket.io';
import path from 'path';

const app = express();
app.use(express.static('public'));

const server = http.Server(app);
const io = socket_io(server);

// app.get('/', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'public/index.html'));
// });

io.on('connection', socket => {
  console.log('User connected');

  socket.on('disconnect', socket => {
    console.log('User disconnected');
  });
});

server.listen(process.env.PORT || 8080, () => {
  console.log('Listening on', process.env.PORT || 8080  );
});
