import { ContextVariableReference } from "./ContextVariableReference";
export class ContextVariableClass {
    private _name: string;

    private _value: ContextVariableReference;
   

    constructor();
    constructor(name:string, value: ContextVariableReference)
    constructor(name?:string, value?: ContextVariableReference){
        this._name = name || "";
        this._value = value || new ContextVariableReference();
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get value(): ContextVariableReference {
        return this._value;
    }
    public set value(value: ContextVariableReference) {
        this._value = value;
    }
}