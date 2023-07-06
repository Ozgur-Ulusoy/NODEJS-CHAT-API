const express = require('express');
const router = express.Router();

const SocketObj = require('.socket/../../socket');

const Users = require('../Data/data');

var Rooms = require('../Data/rooms');

//! join room without password
router.post('/join/:roomname', async (req, res) => {
    const roomname = req.params.roomname;
    const password = "";
    console.log(roomname + " " + password);

    var room = await Rooms.filter((e) => { return e.name == roomname});

    if(room[0] == undefined){
        socketObject = new SocketObj();
        await socketObject.setSocketFuncs('room');
        await socketObject.socket.emit('join-room', roomname, password, true);
        await socketObject.socket.on('connect', () => {
            console.log("join-roomedddd");
            res.status(200).json({
                'userId' : socketObject.socket.id,
                'roomname' : roomname
            });
        });
        Users.push(socketObject);
    }

    else if (room[0] != undefined && room[0].password == password){
        socketObject = new SocketObj();
        await socketObject.setSocketFuncs('room');
        await socketObject.socket.emit('join-room', roomname, password, false);
        await socketObject.socket.on('connect', () => {
            console.log("join-roomedddd");
            res.status(200).json({
                'userId' : socketObject.socket.id,
                'roomname' : roomname
            });
        });
        Users.push(socketObject);
    }
    else{
        res.status(404).json({
            'message': 'Error !'
        });
        return;
    }
});

//! join room according to roomname and get userId and roomname
router.post('/join/:roomname/:password', async (req, res) => {
    const roomname = req.params.roomname;
    const password = req.params.password;
    console.log(roomname + " " + password);

    var room = await Rooms.filter((e) => { return e.name == roomname});
    // console.log(room[0]);

    if(room[0] == undefined){
        socketObject = new SocketObj();
        await socketObject.setSocketFuncs('room');
        await socketObject.socket.emit('join-room', roomname, password, true);
        await socketObject.socket.on('connect', () => {
            console.log("join-roomedddd");
            res.status(200).json({
                'userId' : socketObject.socket.id,
                'roomname' : roomname,
                'isAdmin' : true
            });
        });
        Users.push(socketObject);
    }

    else if (room[0] != undefined && room[0].password == password){
        socketObject = new SocketObj();
        await socketObject.setSocketFuncs('room');
        await socketObject.socket.emit('join-room', roomname, password, false);
        await socketObject.socket.on('connect', () => {
            console.log("join-roomedddd");
            res.status(200).json({
                'userId' : socketObject.socket.id,
                'roomname' : roomname,
                'isAdmin' : false
            });
        });
        Users.push(socketObject);
    }
    else{
        res.status(404).json({
            'message': 'Error !'
        });
        return;
    }
});

//! get users in room according to roomname
router.get('/getUsers/:roomname', async (req, res) => {
    const roomname = req.params.roomname;

    var users = await global.socketIoObject.of("/room").in(roomname).allSockets();
    users = Array.from(users);

    res.status(200).json({
        users: users,
    });

});

// const Rooms = require('./Api/Data/rooms');
//! get rooms and users in rooms 
router.get('/getRooms', async (req, res) => {
    
        arr = Rooms;

        res.status(200).json({
            rooms: arr,
            });
});

module.exports = router;