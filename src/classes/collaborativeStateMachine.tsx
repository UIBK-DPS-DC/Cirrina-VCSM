import {Version} from "../types.ts";
import StateMachine from "./stateMachine.ts";
import ContextVariable from "./contextVariable.tsx";


export default class CollaborativeStateMachine {
    private _name: string
    private _version: Version
    private _stateMachines: StateMachine[]
    private _localContext: ContextVariable[]
    private _persistentContext: ContextVariable[]

    public constructor(name: string, version: Version) {
        this._name = name;
        this._version = version;
        this._stateMachines = []
        this._localContext = []
        this._persistentContext = []

    }


    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get version(): Version {
        return this._version;
    }

    set version(value: Version) {
        this._version = value;
    }

    get stateMachines(): StateMachine[] {
        return this._stateMachines;
    }

    set stateMachines(value: StateMachine[]) {
        this._stateMachines = value;
    }

    get localContext(): ContextVariable[] {
        return this._localContext;
    }

    set localContext(value: ContextVariable[]) {
        this._localContext = value;
    }

    get persistentContext(): ContextVariable[] {
        return this._persistentContext;
    }

    set persistentContext(value: ContextVariable[]) {
        this._persistentContext = value;
    }
}