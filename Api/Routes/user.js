const express = require('express');
const router = express.Router();

const SocketObj = require('.socket/../../socket');

const Users = require('../Data/data');

//! online users count
router.get('/getUsersCount', (req, res, next) => {
    const usersCount = Users.length;
    
    res.status(200).json({
        usersCount: usersCount
    });

});

//! online users

//! connect 
// http://localhost:3000/user/connect ÖRNEK
router.post('/connect', (req, res, next) => {
    socket = new SocketObj();
    socket.setSocketFuncs();
    // res.send('Connected !');
    
    res.status(200).json({
        message: 'Connected !'
    });
});

//! disconnect
// http://localhost:3000/user/disconnect/iBIsKky1zp3r0hDnAAAJ ÖRNEK
router.post('/disconnect/:id', (req, res, next) => {
    const id = req.params.id;
    var user = Users.filter((e) => { return e.socket.id == id});
    if(user.length > 0){
        global.socketIoObject.of('/room').to(id).emit('disconnect-api', id);
        res.status(200).json({
            message: 'Disconnected !'
        });
    }
    else{
        res.status(404).json({
            message: 'Error !'
        });
    }
});

module.exports = router;