const { Socket } = require('engine.io-client');
const io = require('socket.io-client');

class SocketIoObject{
    socket = null ;
    socketId = null;
    chat = [];

    async setSocketFuncs(path = '') {
        
        path = 'http://localhost:3000/' + path;
        console.log(path);
        this.socket = await io.connect( path , {reconnection: true, reconnectionDelay: 1000, reconnectionDelayMax : 5000, reconnectionAttempts: Infinity});
        this.socketId = this.socket.id;
        this.socket.on('message', (msg, senderid, messageObj) => {
            console.log('message: ' + msg + ' senderid: ' + senderid);
            console.log(messageObj);
            this.chat.push(messageObj);
            console.log(this.chat);
        }

        );
        
        this.socket.on('connect', () => {
            console.log('connected');
            this.socketId = this.socket.id;
            console.log(this.socket.id);
        }
        );

        this.socket.on('disconnect-api', (id) => {
            console.log('disconnected from api event triggered');
            if(id == this.socket.id) {
                this.socket.disconnect();
            }
        }
        );
    }

    returnId() {
        return this.socketId;
    }

}

module.exports = SocketIoObject;
