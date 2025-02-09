export class User{
    constructor(newUser){
        this._username = newUser['username'];
        this._bio = newUser['bio'];
        this._img = newUser['img'];
    }

    get username(){
        return this._username;
    }

    get bio(){
        return this._bio;
    }

    get img(){
        return this._img;
    }

    toString(){
        return JSON.stringify({
            'username': this._username,
            'bio': this._bio,
            'img': this._img
        });
    }
}