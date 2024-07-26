import StateOrStateMachine from "./stateOrStateMachine.ts"
import Action from "./action.tsx";
import {Context, Transitionn} from "../types.ts";

export default class State extends StateOrStateMachine {

    private _name: string
    private _initial = false;
    private _terminal = false;
    private _virtual = false;
    private _abstract = false;
    private _entry: Action[] = [];
    private _exit: Action[] = [];
    private _while: Action[]  = [];
    private _after: Action[] = [];
    private _on: Transitionn[] = [];
    private _always: Transitionn[] = [];
    private _localContext: Context[] = [];
    private _persistentContext: Context[] = [];
    private _staticContext: Context[] = [];

    public constructor(name: string) {
        super()
        this._name = name
    }

    public get name(): string {
        return this._name
    }

    public set name(name: string){
        this._name = name
    }

    get initial(): boolean {
        return this._initial;
    }

    set initial(value: boolean) {
        this._initial = value;
    }

    get terminal(): boolean {
        return this._terminal;
    }

    set terminal(value: boolean) {
        this._terminal = value;
    }

    get virtual(): boolean {
        return this._virtual;
    }

    set virtual(value: boolean) {
        this._virtual = value;
    }

    get abstract(): boolean {
        return this._abstract;
    }

    set abstract(value: boolean) {
        this._abstract = value;
    }

    get entry(): Action[] {
        return this._entry;
    }

    set entry(value: Action[]) {
        this._entry = value;
    }

    get exit(): Action[] {
        return this._exit;
    }

    set exit(value: Action[]) {
        this._exit = value;
    }

    get while(): Action[] {
        return this._while;
    }

    set while(value: Action[]) {
        this._while = value;
    }

    get after(): Action[] {
        return this._after;
    }

    set after(value: Action[]) {
        this._after = value;
    }

    get on(): Transitionn[] {
        return this._on;
    }

    set on(value: Transitionn[]) {
        this._on = value;
    }

    get always(): Transitionn[] {
        return this._always;
    }

    set always(value: Transitionn[]) {
        this._always = value;
    }

    get localContext(): Context[] {
        return this._localContext;
    }

    set localContext(value: Context[]) {
        this._localContext = value;
    }

    get persistentContext(): Context[] {
        return this._persistentContext;
    }

    set persistentContext(value: Context[]) {
        this._persistentContext = value;
    }

    get staticContext(): Context[] {
        return this._staticContext;
    }

    set staticContext(value: Context[]) {
        this._staticContext = value;
    }



}