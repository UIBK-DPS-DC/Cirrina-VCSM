import { ContextVariableReference } from "./ContextVariableReference";
export class ContextVariableClass {
    private _name: string;
    private _value: ContextVariableReference;

    constructor(name:string, value : ContextVariableReference){
        this._name = name;
        this._value = value
    }
}