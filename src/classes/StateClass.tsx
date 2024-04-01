import { ActionOrActionReferenceClass, StateOrStatemachineClass } from "./Interfaces";
import { ContextClass } from "./context/ContextClass";
import { OnTransitionClass } from "./transition/OnTransitionClass";
import { TransitionClass } from "./transition/TransitionClass";

/**
 * State construct, represents an atomic state of a state machine.
 * Example:
 * {
 *   name: 'State Name',
 *   isInitial: true,
 *   isTerminal: false,
 *   entry: [...],
 *   exit: [...],
 *   while: [...],
 *   after: [...],
 *   on: [...],
 *   localContext: [...],
 *   persistentContext: [...],
 *   staticContext: [...],
 * }
 */
export class StateClass implements StateOrStatemachineClass{
    private _name: string;

     /**
   * The is initial flag. Indicating if this is the initial state of the state machine. Exactly one state must be the initial state of a
   * state machine. If omitted, the state is not initial.
   */
    private _isInitial: boolean;
  

    /**
   * The is terminal flag. Indicating if this is a terminal state of the state machine. If omitted, the state is not terminal.
   */
    private _isTerminal: boolean;
   

    
   /**
   * The optional entry actions. Can be provided as action references to previously declared actions, or inline actions.
   */
    private _entry?: Array<ActionOrActionReferenceClass> | undefined;
    

    /**
   * The optional exit actions. Can be provided as action references to previously declared actions, or inline actions.
   */
    private _exit?: Array<ActionOrActionReferenceClass> | undefined;
   

    /**
   * The optional while actions. Can be provided as action references to previously declared actions, or inline actions.
   */
    private _while?: Array<ActionOrActionReferenceClass> | undefined;
   

    /**
   * The optional after (timeout) actions. Can be provided as action references to previously declared actions, or inline actions. Actions
   * provided must be raise event actions.
   *
   */
    private _after?: Array<ActionOrActionReferenceClass> | undefined;
    


    /**
   * The optional on transitions. On transitions are taken upon event receiving an event that matches the 'event' keyword of the on
   * transition.
   */
    private _on?: Array<OnTransitionClass> | undefined;
    

    /**
   * The optional always transitions. Always transitions are always taken upon entering a state.
   */
    private _always?: Array<TransitionClass> | undefined;
   

    /**
   * The optional lexical declaration of local context variables.
   */
    private _localContext?: ContextClass | undefined;
   

    
   /**
   * The optional lexical declaration of persistent context variables.
   */
    private _persistentContext?: ContextClass | undefined;
    

    /**
   * The optional lexical declaration of static context variables.
   */
    private _staticContext?: ContextClass | undefined;
  

    /**
   * The optional virtual modifier. If a state is defined as virtual, inherited state machines may override the state.
   */
    private _isVirtual?: boolean | undefined;
    

    /**
   * The optional abstract modifier. If a state is defined as abstract, inherited state machines must override the state.
   */
    private _isAbstract?: boolean | undefined;
   


    constructor();
    constructor(name:string);

    // States should be constructed using a builder, however feel free to add/expand basic constructor.
    constructor(name?: string){
        this._name = name || "";
        this._isInitial = false;
        this._isTerminal = false;

    }



    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get isInitial(): boolean {
        return this._isInitial;
    }
    public set isInitial(value: boolean) {
        this._isInitial = value;
    }

    public get isTerminal(): boolean {
        return this._isTerminal;
    }
    public set isTerminal(value: boolean) {
        this._isTerminal = value;
    }

    public get entry(): Array<ActionOrActionReferenceClass> | undefined {
        return this._entry;
    }
    public set entry(value: Array<ActionOrActionReferenceClass> | undefined) {
        this._entry = value;
    }

    public get exit(): Array<ActionOrActionReferenceClass> | undefined {
        return this._exit;
    }
    public set exit(value: Array<ActionOrActionReferenceClass> | undefined) {
        this._exit = value;
    }

    public get while(): Array<ActionOrActionReferenceClass> | undefined {
        return this._while;
    }
    public set while(value: Array<ActionOrActionReferenceClass> | undefined) {
        this._while = value;
    }

    public get after(): Array<ActionOrActionReferenceClass> | undefined {
        return this._after;
    }
    public set after(value: Array<ActionOrActionReferenceClass> | undefined) {
        this._after = value;
    }

    public get on(): Array<OnTransitionClass> | undefined {
        return this._on;
    }
    public set on(value: Array<OnTransitionClass> | undefined) {
        this._on = value;
    }

    public get always(): Array<TransitionClass> | undefined {
        return this._always;
    }
    public set always(value: Array<TransitionClass> | undefined) {
        this._always = value;
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

    public get staticContext(): ContextClass | undefined {
        return this._staticContext;
    }
    public set staticContext(value: ContextClass | undefined) {
        this._staticContext = value;
    }

    public get isVirtual(): boolean | undefined {
        return this._isVirtual;
    }
    public set isVirtual(value: boolean | undefined) {
        this._isVirtual = value;
    }

    public get isAbstract(): boolean | undefined {
        return this._isAbstract;
    }
    public set isAbstract(value: boolean | undefined) {
        this._isAbstract = value;
    }

    











}