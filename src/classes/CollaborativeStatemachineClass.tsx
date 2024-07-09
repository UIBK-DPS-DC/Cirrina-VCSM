import { MemoryMode, Version } from "./Enums";
import { StateOrStatemachineClass } from "./Interfaces";
import { StatemachineClass } from "./StatemachineClass";
import { ContextClass } from "./context/ContextClass";

/**
 * Collaborative state machine construct. Represents the highest level entity in a description.
 * Example:
 * {
 *   name: 'Collaborative State Machine Name',
 *   version: '0.1',
 *   memoryMode: 'distributed',
 *   stateMachines: [...],
 *   localContext: [...],
 *   persistentContext: [...]
 * }
 */
export class CollaborativeStatemachineClass implements StateOrStatemachineClass{

    private _name: string;
    

    private _version: Version;
   

    private _memoryMode: MemoryMode;
    

    private _stateMachines: Array<StatemachineClass>;
    

    private _localContext?: ContextClass | undefined;
    
    
    private _persistentContext?: ContextClass | undefined;
   

    constructor();
    constructor(name: string, version: Version, memoryMode :MemoryMode)

    constructor(name?: string, version?: Version, memoryMode?:MemoryMode){
        this._name = name || "";
        this._version = version || Version.UNDEFINED;
        this._memoryMode = memoryMode || MemoryMode.UNDEFINED;
        this._stateMachines = new Array<StatemachineClass>();
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get version(): Version {
        return this._version;
    }
    public set version(value: Version) {
        this._version = value;
    }

    public get memoryMode(): MemoryMode {
        return this._memoryMode;
    }
    public set memoryMode(value: MemoryMode) {
        this._memoryMode = value;
    }

    public get stateMachines(): Array<StatemachineClass> {
        return this._stateMachines;
    }
    public set stateMachines(value: Array<StatemachineClass>) {
        this._stateMachines = value;
    }

    public get localContext(): ContextClass | undefined {
        return this._localContext;
    }
    public set localContext(value: ContextClass | undefined) {
        this._localContext = value;
    }

    public get persistentContext(): ContextClass | undefined {
        return this._persistentContext;
    }
    public set persistentContext(value: ContextClass | undefined) {
        this._persistentContext = value;
    }

    

}