import { ExpressionClass } from "../Expression";
import { ActionOrActionReferenceClass } from "../Interfaces";

// Not sure if this class is needed on our side. Implemented for now just in case.

export class MatchActionClass implements ActionOrActionReferenceClass{
    private _value: ExpressionClass;
    private _case: Map<ExpressionClass, ActionOrActionReferenceClass>;
   

    constructor()
    constructor(value: ExpressionClass, case_map:Map<ExpressionClass, ActionOrActionReferenceClass>);

    constructor(value?: ExpressionClass, case_map?:Map<ExpressionClass, ActionOrActionReferenceClass>){
        this._value = value || new ExpressionClass();
        this._case = case_map || new Map<ExpressionClass, ActionOrActionReferenceClass>()

    }



    public get value(): ExpressionClass {
        return this._value;
    }
    public set value(value: ExpressionClass) {
        this._value = value;
    }
    
    public get case(): Map<ExpressionClass, ActionOrActionReferenceClass> {
        return this._case;
    }
    public set case(value: Map<ExpressionClass, ActionOrActionReferenceClass>) {
        this._case = value;
    }
}