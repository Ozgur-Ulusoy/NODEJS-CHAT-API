class chat{
    sender;
    message;
    time;
    constructor(sender, message, time){
        this.sender = sender;
        this.message = message;
        this.time = time;
    }
}

module.exports = chat;