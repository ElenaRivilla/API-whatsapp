class Group {
    constructor(newGroup){
        this._id = newGroup['id'];
        this._name = newGroup['name']
        this._description = newGroup['description']
        this._size = newGroup['size']
        this._creation_date = newGroup['creation_date']
    }

    get id() {
        return this._id;
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

    toString() {
        return JSON.stringify({
            'id': this._id,
            'name': this._name,
            'description': this._description,
            'size': this._size,
            'creation_date': this._creation_date
        });
    }
}