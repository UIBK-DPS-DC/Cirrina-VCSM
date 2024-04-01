import { ContextVariableClass } from "./ContextVariableClass"
export class ContextClass {
    private _variables: Array<ContextVariableClass>

    constructor();
    constructor(variables: Array<ContextVariableClass>)

    constructor(variables?: Array<ContextVariableClass>){
        this._variables = variables || new Array<ContextVariableClass>();
    }

    public get variables(): Array<ContextVariableClass> {
        return this._variables
    }
    public set variables(value: Array<ContextVariableClass>) {
        this._variables = value
    }
}