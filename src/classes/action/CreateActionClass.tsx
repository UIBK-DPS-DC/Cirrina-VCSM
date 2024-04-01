import { ContextVariableClass } from "../context/ContextVariableClass"

export class CreateActionClass{

    private _variable: ContextVariableClass;
    private _isPersistent: boolean;

    public get variable(): ContextVariableClass {
        return this._variable;
    }
    public set variable(value: ContextVariableClass) {
        this._variable = value;
    }
    

    public get isPersistent(): boolean {
        return this._isPersistent;
    }
    public set isPersistent(value: boolean) {
        this._isPersistent = value;
    }

    constructor(variable: ContextVariableClass, isPersistent: boolean){
        this._variable = variable;
        this._isPersistent = isPersistent;

    }
    

    

}