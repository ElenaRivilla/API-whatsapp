export class User{
    constructor(newUser){
        this.username = newUser['username'];
        this.bio = newUser['bio'];
        this.image = newUser['image'];
    }

    toString(){
        return JSON.stringify({
            'username': this.username,
            'bio': this.bio,
            'image': this.image
        });
    }
}