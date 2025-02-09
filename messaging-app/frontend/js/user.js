export class User{
    constructor(newUser){
        this._username = newUser['username'];
        this._bio = newUser['bio'];
        this._token = newUser['token'];
    }

    get username(){
        return this._username;
    }

    get bio(){
        return this.bio;
    }

    get token(){
        return this._token;
    }

    toString(){
        return JSON.stringify({
            'username': this._username,
            'bio': this._bio,
            'token': this._token
        });
    }
}