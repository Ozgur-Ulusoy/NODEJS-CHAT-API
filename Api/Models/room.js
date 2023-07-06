class Room{
    name;
    password;
    adminId;
    users;
    constructor(name, password, adminId){
        this.name = name;
        this.password = password;
        this.adminId = adminId;
        this.users = new Array();
    }
}

module.exports = Room;