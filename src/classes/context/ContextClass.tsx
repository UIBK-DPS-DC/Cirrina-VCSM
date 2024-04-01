import { ContextVariableClass } from "./ContextVariableClass"
export class ContextClass {
    private _variables: Array<ContextVariableClass>
    
    constructor(variables: Array<ContextVariableClass>){
        this._variables = variables
    }

    public get variables_1(): Array<ContextVariableClass> {
        return this._variables
    }
    public set variables_1(value: Array<ContextVariableClass>) {
        this._variables = value
    }
}