/**
 * Placeholder event class. Add fields once we can import the schema.
 */
export default class Event {
    private _name;


    constructor(name: string) {
        this._name = name;
    }


    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }



}