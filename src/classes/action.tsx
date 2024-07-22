/**
 * Placeholder Action class. Expand once we have the Schema
 */
export default class Action {
    private _name: string;

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