import { ActionOrActionReferenceClass } from "../Interfaces";

export class TimeoutResetActionClass implements ActionOrActionReferenceClass{
    private _action: string;
    
    public set action(value: string) {
        this._action = value;
    }

    constructor();
    constructor(action: string);

    constructor(action?: string){
        this._action = action || "";

    }

    public get action(): string {
        return this._action;
    }

    
}