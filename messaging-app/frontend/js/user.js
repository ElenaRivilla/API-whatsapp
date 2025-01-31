class User{
    constructor(newUser){
        this._id = newUser['id'];
        this._username = newUser['username'];
        this._token = newUser['token'];
    }

    get id(){
        return this._id;
    }

    get username(){
        return this._username;
    }

    get token(){
        return this._token;
    }

    toString(){
        return JSON.stringify({
            'id': this._id, 
            'username': this._username,
            'token': this._token
        });
    }
}