import { EventChannel } from "../Enums";
import { ContextVariableClass } from "../context/ContextVariableClass";

export class EventClass {
    private _name: string;
    private _channel: EventChannel;
    private _data: Array<ContextVariableClass>;
    
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    
    public get channel(): EventChannel {
        return this._channel;
    }
    public set channel(value: EventChannel) {
        this._channel = value;
    }
    
    public get data(): Array<ContextVariableClass> {
        return this._data;
    }
    public set data(value: Array<ContextVariableClass>) {
        this._data = value;
    }

    constructor()
    constructor(name: string, channel: EventChannel)
    constructor(name: string, channel: EventChannel, data: Array<ContextVariableClass>)

    constructor(name?: string, channel?: EventChannel,data?: Array<ContextVariableClass>){
        this._name = name || "";
        this._channel = channel || EventChannel.UNDEFINED;
        this._data = data || new Array<ContextVariableClass>();
    } 






}