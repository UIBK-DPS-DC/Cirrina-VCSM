import StateOrStateMachine from "./stateOrStateMachine.ts"
import Action from "./action.tsx";
import {Context} from "../types.ts";
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
    private _localContext: Context[] = [];
    private _persistentContext: Context[] = [];
    private _staticContext: Context[] = [];

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


    private actionsAsDictArray (actions: Action[]) {
        return actions.map((action: Action) => {return action.toDICT()})
    }

    private contextAsDict (context: Context[]) {
        let dict = {}
        context.forEach((context) => {
            dict = {...dict, [context.name] : {value: context.value}}
        })
        return dict;
    }

    public toDICT() {
        let dict = {}

        if(this.entry.length >= 1) {
            dict = {...dict, entry: this.actionsAsDictArray(this.entry)};
        }

        if(this.while.length >= 1) {
            dict = {...dict, while: this.actionsAsDictArray(this.while)};
        }

        if(this.exit .length >= 1) {
            dict = {...dict, exit: this.actionsAsDictArray(this.exit)};
        }

        if(this.after.length >= 1) {
            dict = {...dict, after: this.actionsAsDictArray(this.after)};
        }

        if(this.on.length >= 1) {
            dict = {...dict, on: this.on.map((transition) => { return transition.toDICT()})};
        }

        if(this.localContext.length >= 1) {
            dict = {...dict, localContext: this.contextAsDict(this.localContext)}
        }

        if(this.persistentContext.length >= 1) {
            dict = {...dict, persistentContext: this.contextAsDict(this.persistentContext)}
        }

        if(this.staticContext.length >= 1) {
            dict = {...dict, staticContext: this.contextAsDict(this.staticContext)}
        }

        return dict;

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