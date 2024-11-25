/**
 * Placeholder event class. Add fields once we can import the schema.
 */
import {EventChannel} from "../enums.ts";
import ContextVariable from "./contextVariable.tsx";
import {EventDescription} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";

//TODO: Actually use this class. Expand with pkl binds
export default class Event {
    private _name;
    private _channel: EventChannel;
    private _data: ContextVariable[]


    constructor(name: string, channel: EventChannel) {
        this._name = name;
        this._channel = channel
        this._data = []
    }


    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get channel(): EventChannel {
        return this._channel;
    }

    set channel(value: EventChannel) {
        this._channel = value;
    }

    get data(): ContextVariable[] {
        return this._data;
    }

    set data(value: ContextVariable[]) {
        this._data = value;
    }

    public addContextVariable(context: ContextVariable) {
        this._data.push(context);
    }

    public toDescription(): EventDescription {
        return {
            channel: this.channel,
            data: this._data.map((c) => c.toDescription()),
            name: this._name
        }
    }

    public static fromDescription(description: EventDescription): Event {
        const event = new Event(description.name, description.channel as EventChannel)
        event.data = description.data.map((c) => ContextVariable.fromDescription(c));
        return event;

    }



}