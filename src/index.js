var express = require('express');
var http = require('http');
var app = express();
var path = require('path');
var socketio = require('socket.io');
var Filter = require('bad-words');
var {generateMessage, generateLocationMessage} = require('./utils/messages');
var { getUsersInRoom, getUser, addUser, removeUser} = require('./utils/users');

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname,'../public');
const server = http.createServer(app);

//configure websockets using socket.io
const io = socketio(server);
//let count=0;

app.use(express.static(publicDirectoryPath));

io.on('connection',(socket)=>{
    console.log('new Web Socket Connection');


    socket.on('join',({username, room}, callback)=>{
        const {error , user} = addUser({id: socket.id, username, room});
        if(error){
            return callback(error);
        }

        socket.join(user.room);
        socket.emit('Message', generateMessage('Admin','Welcome!'));
        socket.broadcast.to(user.room).emit('Message', generateMessage('Admin',`${user.username} has joined!`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });
        callback()
    })
    socket.on('sendMessage', (message,callback)=>{
        const user = getUser(socket.id);
        const filter = new Filter();
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!!');
        }

        io.to(user.room).emit('Message',generateMessage(user.username,message));
        callback();
    });
    //location share
    socket.on('sendLocation', (coords, callback)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('Message', generateMessage('Admin',`${user.username} has left!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})


server.listen(port, ()=>{
    console.log('Server up on port - ' + port);
});