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
  userCount: 0,
  drawerID: 0,
  clientList: []
}

io.on('connection', socket => {
  APPSTATE.userCount++;
  APPSTATE.clientList.push(socket.id);
  console.log(`User connected: ${APPSTATE.userCount}`);

  // TODO: Modularize the following code
  // Handle designation of drawer and guessers
  // Sends events to client to setup DOM correctly

  // let assignment = (APPSTATE.userCount === 1) ? 'drawer' : 'guesser';

  let assignment = 'guess' //set to guesser by default

  if (APPSTATE.userCount === 1) {
    // set user to drawer and get ID
    APPSTATE.drawerID = socket.id;
    console.log(`DrawerID set: ${APPSTATE.drawerID}`);
    assignment = 'drawer';
  }

  // send out assignment
  socket.emit('on connect', assignment);

  // for disconnect events
  socket.on('disconnect', () => {
    APPSTATE.userCount--;
    console.log(`Socket: ${socket}`);
    console.log(`User disconnecting: ${socket.id}`);

    // remove sockiet.id from clientList
    // First, get the index
    let index = APPSTATE.clientList.indexOf(socket.id);
    APPSTATE.clientList.splice(index, 1)

    // check if disconnecting user is drawerID
    // Reassign if so
    if (APPSTATE.drawerID === socket.id) {
      console.log(`Drawer disconnected, ID: ${APPSTATE.drawerID}`);
      APPSTATE.drawerID = APPSTATE.clientList[0];
      console.log(`New drawerID: ${APPSTATE.drawerID}`);
      io.sockets.connected[APPSTATE.drawerID].emit('on connect', 'drawer');
    }
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
