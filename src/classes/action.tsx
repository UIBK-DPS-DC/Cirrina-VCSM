import {ActionType} from "../enums.tsx";

/**
 * Placeholder Action class. Expand once we have the Schema
 */
export default class Action {
    private _name: string;
    private _type: ActionType
    private _delay: number
    private _properties: {}

    constructor(name: string, type: ActionType, delay = 0) {
        this._name = name;
        this._type = type;
        this._properties = this.createActionProperties(type)
        this._delay = delay

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

    get properties() {
        return this._properties;
    }

    set properties(props) {
        this._properties = props;
    }

    get delay() {
        return this._delay;
    }

    set delay(value) {
        this._delay = value;
    }

    private createActionProperties(type: ActionType) {
        switch (type) {
            case ActionType.RAISE_EVENT: {
                return {
                    event: ""
                }
            }
            default: {
                return {}
            }
        }
    }



}