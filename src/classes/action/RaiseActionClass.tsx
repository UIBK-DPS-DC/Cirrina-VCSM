import { EventClass } from "../event/EventClass";

export class RaiseActionClass {
    private _event: EventClass;

    constructor();
    constructor(event: EventClass);

    constructor(event?: EventClass){
        this._event = event || new EventClass();
    }

    public get event_1(): EventClass {
        return this._event;
    }
    public set event_1(value: EventClass) {
        this._event = value;
    }
}