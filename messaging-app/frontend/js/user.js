export class User{
    constructor(newUser){
        this._username = newUser['username'];
        this._bio = newUser['bio'];
    }

    get username(){
        return this._username;
    }

    get bio(){
        return this.bio;
    }

    toString(){
        return JSON.stringify({
            'username': this._username,
            'bio': this._bio
        });
    }
}