const express = require('express');
const router = express.Router();

const messageModul = require('../Models/chat');
const Users = require('../Data/data');


//! KULLANICI ID SİNE GÖRE MESAJLARI GETİR
router.get('/messageGet/:userId', (req, res) => {
    const userId = req.params.userId;

    const user = Users.find(u => u.socketId === userId);

    res.status(200).json({
        'messages': user.chat
    });

});

//! MESAJ GÖNDER - ODAYA 
router.post('/send/:senderid/:roomName/:message', (req, res) => {

    const senderid = req.params.senderid;
    const roomName = req.params.roomName;
    const message = req.params.message;

    const messageObj = new messageModul(senderid, message, Date.now());

    global.socketIoObject.of('/room').to(roomName).emit('message', message, senderid, messageObj);

    res.status(200).json({
        message: 'Message sent !'
    });
    
});

module.exports = router;