import { ActionOrActionReferenceClass } from "../Interfaces";

export class AssignActionClass implements ActionOrActionReferenceClass{
    private _variable: string;

    constructor (variable: string){
        this._variable = variable;
    }

    public get variable(): string {
        return this._variable;
    }
    public set variable(value: string) {
        this._variable = value;
    }
}

