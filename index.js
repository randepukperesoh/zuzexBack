const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
let messages = [];
let users = [];

io.on('connection', (socket) => {
    socket.on("join", (user) => {
        users.push(user)
        socket.broadcast.emit('concectNewUser', {user: {name:'Админ', img:'100'}, message: `Подключился пользователь ${user.name}`})
        socket.broadcast.emit('allUsers', users)
        socket.emit("getDefaultValues", {messages:messages, users: users})

        socket.on('disc', (id) => {
            users = users.filter(user => user.id !== id); 
            console.log(users); 
            socket.broadcast.emit('allUsers', users); 
        });
        console.log(users)
    })
    
    socket.on('sendMessage', (data) => {
        console.log(data)
        messages.push(data)
        socket.broadcast.emit('message', data) 
    })

})

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
