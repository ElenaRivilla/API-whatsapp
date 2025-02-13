export class User {
    constructor(newUser) {
        this.username = newUser['username'];
        this.bio = newUser['bio'];
        this.image = newUser['image'];
        this.hasOpenChat = false;
        this.lightMode = true;
    }

    setOpenChat(bool) {
        if (typeof (bool) == "boolean") {
            this.hasOpenChat = bool;
            return;
        }
        return new Error("El parametro de setOpenChat ha de ser un booleano");
    }

    setLightMode(bool) {
        if (typeof (bool) == "boolean") {
            this.lightMode = bool;
            return;
        }
        return new Error("El parametro de setOpenChat ha de ser un booleano");
    }

    updateProfile(newUsername, newBio) {
        this.username = newUsername;
        this.bio = newBio;
    }

    toString() {
        return JSON.stringify({
            'username': this.username,
            'bio': this.bio,
            'image': this.image
        });
    }
}