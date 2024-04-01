import { TransitionClass } from "./TransitionClass";

/**
 * On transition construct. Represents a transition that is to be taken based on a received event.
 * Example:
 * {
 *   target: 'State Name',
 *   guards: [...],
 *   actions: [...],
 *   event: 'Event Name'
 * }
 */

export class OnTransitionClass extends TransitionClass{
/*
   * The event that triggers this on transition.
*/
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