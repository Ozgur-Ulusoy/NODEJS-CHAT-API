const http = require('http'); 
const app = require('./app'); //* import app from app.js
// console.log(app);
const port =  process.env.port || 3000 //* project should run on this port

// socket.io
const server = http.createServer(app); 
const io = require("socket.io")(server);

const Users = require('./Api/Data/data');


// global.users = users;

// const roomNsp = io.of("/room/:roomid");

// io.of('/a').on("connection", async (socket) => {
//     console.log("Server-Client Connected!");
//     // users.push(socket);
// });

const room = io.of("/room");
const Rooms = require('./Api/Data/rooms');

// const workspaces = io.of('/room') io.of(/^\/\w+$/);

// room.on("connection", async (socket) => {
//     console.log("Server-Client Connected!");
//     // users.push(socket);
// });

var roomModul = require('./Api/Models/room');


room.on("connection", async (socket) => {
    socket.on('join-room', async (roomid, pass, isAdmin) => {
        console.log("room - "+roomid);

        if(isAdmin){
            console.log("admin girdi");
            var roomToAdd = new roomModul(roomid, pass == undefined ? "" : pass, socket.id);
            console.log(roomToAdd);
            await Rooms.push(roomToAdd);
        }

        else{
            console.log("user girdi");
        }

        socket.join(roomid);
        io.of('/room').in(roomid).emit('connectToRoom', (socket.id + " joined room = " +roomid));
        var room = await Rooms.filter((e) => { return e.name == roomid})[0];
        room.users.push(socket.id);
    });

    socket.on('connectToRoom', (message) => {
        console.log(message);
    });
    
    socket.on("disconnect", async () => {
    console.log("Server-Client Disconnected!");
    Users.splice(Users.indexOf(socket), 1);

    Rooms.filter((e) => { return e.users.includes(socket.id)}).forEach((e) => { e.users.splice(e.users.indexOf(socket.id), 1)});

    await socket.emit('leave-room');
    });

    socket.on('disconnect-api', async (id) => {
        console.log('disconnected from api event triggered');
        if(id == socket.id) {
            await socket.emit('leave-room');
            await socket.disconnect();
        }
    }
    );

    socket.on('leave-room', async (id) => {
        console.log('leave-room event triggered');
        await socket.leave(id);
    }
    );
});



const socketIoObject = io;
global.socketIoObject = socketIoObject;

server.listen(port, () => console.log(`Server is running on port ${port}`));