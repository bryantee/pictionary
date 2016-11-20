'use strict'

// import http from 'http';
// import express from 'express';
// import socket_io from 'socket.io';
// import path from 'path';

// Using CommonJS require for Heroku sake...
const http = require('http');
const express = require('express');
const socket_io = require('socket.io');
const path = require('path');
// NOTE: Abandoning module for now
// const drawActions = require('./modules/draw-actions');

const app = express();
app.use(express.static('public'));

const server = http.Server(app);
const io = socket_io(server);

const APPSTATE = {
  userCount: 0
}

io.on('connection', socket => {
  APPSTATE.userCount++;
  console.log(`User connected: ${APPSTATE.userCount}`);

  // TODO: Modularize the following code
  // Handle designation of drawer and guessers
  // Sends events to client to setup DOM correctly
  
  let assignment = (APPSTATE.userCount === 1) ? 'drawer' : 'guesser';

  socket.emit('on connect', assignment);

  socket.on('disconnect', socket => {
    APPSTATE.userCount--;
    console.log(`User disconnected: ${APPSTATE.userCount}`);
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
