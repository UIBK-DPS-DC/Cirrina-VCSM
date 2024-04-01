import { ActionOrActionReferenceClass } from "../Interfaces";
import { ContextVariableClass } from "../context/ContextVariableClass"

export class CreateActionClass implements ActionOrActionReferenceClass{

    private _variable: ContextVariableClass;
    private _isPersistent: boolean;

   
    constructor(variable: ContextVariableClass, isPersistent: boolean){
        this._variable = variable;
        this._isPersistent = isPersistent;

    }

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


    

}