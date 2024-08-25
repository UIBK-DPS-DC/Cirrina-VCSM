import {GuardDescription} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";

export default class Guard {
    private _name: string;
    private _expression: string;

    public constructor(expression: string, name = "") {
        this._name = name;
        this._expression = expression;

    }

    public get expression() {
        return this._expression;
    }

    public get name() {
        return this._name;
    }

    public set name(value) {
        this._name = value;
    }

    public set expression(value) {
        this._expression = value;
    }

    public equals(other: Guard): boolean {
        if(this.name){
            return this.name === other.name;
        }
        return this._expression === other._expression
    }

    public toDescription(): GuardDescription {
        return {
            expression: this.expression
        };
    }

}