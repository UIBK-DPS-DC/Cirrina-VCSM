import { ActionOrActionReferenceClass } from "../Interfaces";
import { ContextVariableClass } from "../context/ContextVariableClass";
import { ContextVariableReference } from "../context/ContextVariableReference";
import { EventClass } from "../event/EventClass";


export class InvokeActionClass implements ActionOrActionReferenceClass{
    private _serviceType: string;
    private _isLocal: boolean;
    private _input: Array<ContextVariableClass>;
    private _done: Array<EventClass>;

    /**
   * The optional output variable.
   * Used to automatically store service output to a local context variable. The variable must exist at runtime.
   */
    private _output?: ContextVariableReference | undefined;

    

    constructor();
    constructor(serviceType: string, isLocal: boolean);
    constructor(serviceType: string, isLocal: boolean, input: Array<ContextVariableClass>)

    constructor(serviceType?: string, isLocal?: boolean, input?: Array<ContextVariableClass>){
        this._serviceType = serviceType || "";
        this._isLocal = isLocal || false
        this._input = input || new Array<ContextVariableClass>();
        this._done = new Array<EventClass>();

    }

    public get serviceType(): string {
        return this._serviceType;
    }
    public set serviceType(value: string) {
        this._serviceType = value;
    }
   
    public get isLocal(): boolean {
        return this._isLocal;
    }
    public set isLocal(value: boolean) {
        this._isLocal = value;
    }
    
    public get input(): Array<ContextVariableClass> {
        return this._input;
    }
    public set input(value: Array<ContextVariableClass>) {
        this._input = value;
    }
    
    public get done(): Array<EventClass> {
        return this._done;
    }
    public set done(value: Array<EventClass>) {
        this._done = value;
    }
    
    public get output(): ContextVariableReference | undefined {
        return this._output;
    }
    public set output(value: ContextVariableReference | undefined) {
        this._output = value;
    }




}