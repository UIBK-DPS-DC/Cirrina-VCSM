import { TransitionClass } from "./TransitionClass";

export class OnTransitionClass extends TransitionClass{
    private _event: string;
    

    constructor();
    constructor(target:string, event:string)

    constructor(target?:string, event?:string){
        super(target || "")
        this._event = event || "";
    }


    public get event(): string {
        return this._event;
    }
    public set event(value: string) {
        this._event = value;
    }


}