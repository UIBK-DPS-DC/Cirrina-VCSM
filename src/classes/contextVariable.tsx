import {ContextVariableDescription} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";

export default class ContextVariable {
    private _name: string
    private _value: string

    constructor(name: string, value: string) {
        this._name = name
        this._value = value
    }


    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
    }


    public toDescription(): ContextVariableDescription {
        return {
            name: this.name,
            value: this.value
        }
    }
}