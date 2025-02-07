export class User{
    constructor(newUser){
        this._username = newUser['username'];
        this._token = newUser['token'];
    }

    get username(){
        return this._username;
    }

    get token(){
        return this._token;
    }

    toString(){
        return JSON.stringify({
            'username': this._username,
            'token': this._token
        });
    }
}