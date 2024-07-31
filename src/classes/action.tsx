import {ActionType} from "../enums.tsx";

/**
 * Placeholder Action class. Expand once we have the Schema
 */
export default class Action {
    private _name: string;
    private _type: ActionType

    constructor(name: string, type: ActionType) {
        this._name = name;
        this._type = type;

    }


    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get type(){
        return this._type;
    }
    set type(value) {
        this._type = value;
    }

}