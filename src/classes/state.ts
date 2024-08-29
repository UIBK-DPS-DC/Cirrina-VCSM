import StateOrStateMachine from "./stateOrStateMachine.ts"
import Action from "./action.tsx";
import ContextVariable from "./contextVariable.tsx";
import Transition from "./transition.ts";
import Guard from "./guard.tsx";
import {StateDescription} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";


export default class State implements StateOrStateMachine {

    private _name: string
    private _initial = false;
    private _terminal = false;
    private _virtual = false;
    private _abstract = false;
    private _entry: Action[] = [];
    private _exit: Action[] = [];
    private _while: Action[]  = [];
    private _after: Action[] = [];
    private _on: Transition[] = [];
    private _always: Transition[] = [];
    private _localContext: ContextVariable[] = [];
    private _persistentContext: ContextVariable[] = [];
    private _staticContext: ContextVariable[] = [];

    public constructor(name: string) {
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

    get on(): Transition[] {
        return this._on;
    }

    set on(value: Transition[]) {
        this._on = value;
    }

    get always(): Transition[] {
        return this._always;
    }

    set always(value: Transition[]) {
        this._always = value;
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

    get staticContext(): ContextVariable[] {
        return this._staticContext;
    }

    set staticContext(value: ContextVariable[]) {
        this._staticContext = value;
    }

    /**
     * Retrieves all actions associated with the state.
     *
     * This method consolidates all the actions defined for entry, while, after, and exit phases of the state.
     * It ensures that if any of these arrays are undefined, they are treated as empty arrays.
     *
     * @returns {Action[]} An array containing all the actions in the following order:
     *                     - Entry actions
     *                     - While actions
     *                     - After actions
     *                     - Exit actions
     */
    public getAllActions(): Action[] {
        return (this._entry || [])
            .concat(this._while || [], this._after || [], this._exit || []);
    }


    public getAllNamedActions(): Action[] {
        return this.getAllActions().filter((action, index, self) => {
            return action.name && index === self.findIndex((a) => a.equals(action));
        });
    }


    public getAllTransitions(): Transition[] {
        return (this.always || []).concat(this._on || [])
    }

    public getAllNamedGuards() :Guard[] {
        let guards: Guard[] = [];
        this.getAllTransitions().forEach((transition) => {
            guards = guards.concat(transition.getAllNamedGuards())
        })
        return guards.filter((guard, index, self) => {
            return index === self.findIndex((g) => g.equals(guard))
        });
    }


    /**
     * Adds a new transition to the state's "on" transitions if it doesn't already exist.
     *
     * This method checks if the provided `newTransition` already exists in the state's `_on` array
     * (which represents the transitions that can occur from this state). The check is based on the transition's ID.
     * If the transition does not already exist, it is added to the `_on` array, and a message is logged to the console.
     * Only ever add Transitions to States using this function. This is to avoid adding duplicate Transitions to a State
     * when fields of an existing Transition on a State are updated.
     *
     * @param {Transition} newTransition - The transition to be added to the state's "on" transitions.
     */
    public addOnTransition(newTransition: Transition): void {
        let found = false;
        this._on.forEach((transition: Transition) => {
            if(newTransition.getId() === transition.getId()) {
                found = true;
                return;
            }
        })
        if(!found){
            console.log(`Added Transition ${newTransition.getId()} to State ${this.name}`)
            this.on.push(newTransition);
        }

    }


    public toDescription(): StateDescription {
        const description: StateDescription = {
            after: [],
            always: [],
            entry: this.entry.map((action) => action.toDescription()),
            exit: this.exit.map((action) => action.toDescription()),
            initial: this.initial,
            localContext: { variables: [] },
            name: this.name,
            on: this.on.map((transition) => transition.toDescription()),
            persistentContext: { variables: [] },
            staticContext: { variables: [] },
            terminal: this.terminal,
            while: []
        };

        return description;


    }






}