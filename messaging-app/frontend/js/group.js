class Group {
    constructor(newGroup){
        this._name = newGroup['name'];
        this._description = newGroup['description'];
        this._size = newGroup['size'];
        this._creation_date = newGroup['creation_date'];
        this._token = newGroup['token'];
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    get size() {
        return this._size;
    }

    get creation_date() {
        return this._creation_date;
    }

    get token(){
        return this._token;
    }

    toString() {
        return JSON.stringify({
            'name': this._name,
            'description': this._description,
            'size': this._size,
            'creation_date': this._creation_date,
            'token': this._token
        });
    }
}