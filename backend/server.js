const express = require('express');
const path = require('path');
const bodyParser=require("body-parser");
const socket = require('socket.io');
const cors = require('cors');
const app = express();



app.use(cors());
app.use(bodyParser.json());

app.get("/",function(req,res){
    res.send("landing");
});

const server = app.listen(process.env.PORT||5000,process.env.IP,function(){
    console.log('server has started')
   });

const io = socket(server);

// test for connection
io.on('connection', socket => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // Join room when 'room' event is emitted
  socket.on('room', data => {
    socket.join(data.room, err => {
      if (err) console.error(err);
    });
    console.log(`User ${socket.id} joined room ${data.room}`);
    console.log(io.sockets.adapter.rooms);
  });

  // TODO: Handle leave room event when user switches room

  // handle coding event
  socket.on('coding', data => {
    console.log(data);
    socket.broadcast.to(data.room).emit('code sent from server', data);
  });
});