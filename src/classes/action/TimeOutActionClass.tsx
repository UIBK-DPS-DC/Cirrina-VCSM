import { ExpressionClass } from "../Expression";
import { ActionOrActionReferenceClass } from "../Interfaces";

export class TimeoutActionClass implements ActionOrActionReferenceClass{
    private _delay: ExpressionClass;
  
    private _actions: Array<ActionOrActionReferenceClass>;


    constructor();
    constructor(delay: ExpressionClass, actions: Array<ActionOrActionReferenceClass>);
    constructor(delay?: ExpressionClass, actions?: Array<ActionOrActionReferenceClass>){
        this._delay = delay || new ExpressionClass();
        this._actions = actions || new Array<ActionOrActionReferenceClass>();
    }

    public get delay(): ExpressionClass {
        return this._delay;
    }
    public set delay(value: ExpressionClass) {
        this._delay = value;
    }

    public get actions(): Array<ActionOrActionReferenceClass> {
        return this._actions;
    }
    public set actions(value: Array<ActionOrActionReferenceClass>) {
        this._actions = value;
    }

}