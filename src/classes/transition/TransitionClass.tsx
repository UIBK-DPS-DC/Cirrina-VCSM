import { ActionOrActionReferenceClass, GuardOrGuardReferenceClass } from "../Interfaces";

export class TransitionClass {
    private _target: string;
    private _guards?: Array<GuardOrGuardReferenceClass> | undefined;
    private _actions?: Array<ActionOrActionReferenceClass> | undefined;
    private _else?: string | undefined;
  

    constructor();
    constructor(target:string);
    
    constructor(target?: string){
        this._target = target || "";
    }
    

    public get target(): string {
        return this._target;
    }
    public set target(value: string) {
        this._target = value;
    }

    public get guards(): Array<GuardOrGuardReferenceClass> | undefined {
        return this._guards;
    }
    public set guards(value: Array<GuardOrGuardReferenceClass> | undefined) {
        this._guards = value;
    }
    public get actions(): Array<ActionOrActionReferenceClass> | undefined {
        return this._actions;
    }
    public set actions(value: Array<ActionOrActionReferenceClass> | undefined) {
        this._actions = value;
    }

    public get else(): string | undefined {
        return this._else;
    }
    public set else(value: string | undefined) {
        this._else = value;
    }
}