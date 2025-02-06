import StateOrStateMachine from "./stateOrStateMachine.ts"
import Action from "./action.tsx";
import ContextVariable from "./contextVariable.tsx";
import Transition from "./transition.ts";
import Guard from "./guard.tsx";
import Event from "./event.ts";
import {StateDescription} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";
import {ActionType} from "../enums.ts";
import {InvokeActionProps, MatchActionProps, RaiseEventActionProps, TimeoutActionProps} from "../types.ts";
import {NO_PARENT} from "../services/stateOrStateMachineService.tsx";


export default class State implements StateOrStateMachine {

    static TARGET_HANDLES: [{ id: "t-t"; }, { id: "r-t"; }, {id: "l-t"; }, {id: "b-t"; }] = [{id: "t-t"}, {id: "r-t"}, {id: "l-t"}, {id: "b-t"}]
    static SOURCE_HANDLES: [{ id: "t-s"; }, { id: "r-s"; }, { id: "l-s"; }, { id: "b-s"; }] =  [{id: "t-s"}, {id: "r-s"}, {id: "l-s"}, {id: "b-s"}]
    static INTERNAL_SOURCE_HANDLES =  ["s","s-1","s-2","s-3"]



    private _nodeId: string | NO_PARENT
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
    private _usedInternalSourceHandles: Set<string>


    public constructor(name: string) {
        this._name = name
        this._nodeId = NO_PARENT
        this._usedInternalSourceHandles = new Set<string>();

    }


    get nodeId(): string  {
        return this._nodeId;
    }

    set nodeId(value: string) {
        this._nodeId = value;
    }

    public addSourceHandle(handle: string){
        this._usedInternalSourceHandles.add(handle);
    }

    public removeSourceHandle(handle: string){
        this._usedInternalSourceHandles.delete(handle);
    }

    public isSourceHandleUsed (handle: string): boolean {
        return this._usedInternalSourceHandles.has(handle)
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

    public getAllContextVariables(): ContextVariable[] {
        return this.persistentContext.concat(this.localContext.concat(this._staticContext))
    }

    removeContext(context: ContextVariable): void {
        // Remove the context from the localContext array by reference comparison
        this._localContext = this._localContext.filter(existingContext => existingContext !== context);

        // Remove the context from the persistentContext array by reference comparison
        this._persistentContext = this._persistentContext.filter(existingContext => existingContext !== context);

        this._staticContext = this._staticContext.filter(existingContext => existingContext !== context);
    }


    private getAllNestedRaiseActions (action: Action, invokeActions:Action[] = []){
        let raiseActions: Action[] = []
        if(action.type !== ActionType.MATCH){
            return raiseActions
        }

        const matchActionProps = (action.properties as MatchActionProps).cases
        matchActionProps.forEach((a) => {
            if(a.action.type === ActionType.RAISE_EVENT){
                raiseActions.push(a.action)
            }
            if(a.action.type === ActionType.INVOKE){
                invokeActions.push(a.action)
            }
            if(a.action.type === ActionType.MATCH){
                raiseActions = raiseActions.concat(this.getAllNestedRaiseActions(a.action, invokeActions))
            }


        })


        return raiseActions

    }




    public getAllRaisedEvents(): Event[] {


        let raiseEventEvents =  this.getAllActions().filter((a) => a.type === ActionType.RAISE_EVENT)
            .map((a) => {
                const props = a.properties as RaiseEventActionProps
                return props.event
            })

        const timeoutActions = this.getAllActions().filter((a) => a.type === ActionType.TIMEOUT)
        timeoutActions.forEach((a) => {
            const timeoutProps = a.properties as TimeoutActionProps
            if( timeoutProps.action && timeoutProps.action.type === ActionType.RAISE_EVENT){
                const raiseProps = timeoutProps.action.properties as RaiseEventActionProps
                raiseEventEvents.push(raiseProps.event)
            }
        })




        let invokeActions = this.getAllActions().filter((a) => a.type === ActionType.INVOKE)
        this.getAllTransitions().forEach((t) => {
            t.getActions().forEach((a) => {
                if(a.type === ActionType.RAISE_EVENT) {
                    const raiseProps = a.properties as RaiseEventActionProps
                    raiseEventEvents.push(raiseProps.event)
                }
                if(a.type === ActionType.INVOKE) {
                    invokeActions.push(a)
                }
                if(a.type === ActionType.MATCH){
                    this.getAllNestedRaiseActions(a, invokeActions).forEach((ra) => {
                        const raiseProps = ra.properties as RaiseEventActionProps
                        raiseEventEvents.push(raiseProps.event)
                    })
                }

            })
        })

        this.getAllActions().filter((a) => a.type === ActionType.MATCH).forEach((a) => {
            this.getAllNestedRaiseActions(a, invokeActions).forEach((ra) => {
                const raiseProps = ra.properties as RaiseEventActionProps
                raiseEventEvents.push(raiseProps.event)
            })
        })

        invokeActions.forEach((a) => {
            const invokeProps = a.properties as InvokeActionProps
            invokeProps.done.forEach((e) => {
                raiseEventEvents.push(e)
            })

        })

        return raiseEventEvents
    }


    public getAllConsumedEvents() {
        return this.on.map((t) => t.getEvent()).filter((e) => !!e.trim())
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
           // console.log(`Added Transition ${newTransition.getId()} to State ${this.name}`)
            this.on.push(newTransition);
        }

    }

    public removeTransition (transition: Transition): void {
        this.on = this.on.filter((t) => t !== transition);
        this.always = this.always.filter((t) => t !== transition)

    }


    public toDescription(): StateDescription {
        const description: StateDescription = {
            after: this.after.map((action) => action.toDescription()),
            always: this.always.map((transition) => transition.toDescription()),
            entry: this.entry.map((action) => action.toDescription()),
            exit: this.exit.map((action) => action.toDescription()),
            initial: this.initial,
            localContext: { variables: this.localContext.map((v) => v.toDescription()) },
            name: this.name,
            on: this.on.map((transition) => transition.toDescription()),
            persistentContext: { variables: this.persistentContext.map((v) => v.toDescription()) },
            staticContext: { variables: this.staticContext.map((v) => v.toDescription() ) },
            terminal: this.terminal,
            while: this.while.map((action) => action.toDescription())
        };

        return description;


    }

    public static fromDescription(description: StateDescription): State {
        const newState = new State(description.name)
        newState.initial = description.initial
        newState.terminal = description.terminal
        newState.entry = description.entry.map((e) => Action.fromDescription(e))
        newState.exit = description.exit.map((e) => Action.fromDescription(e))
        newState.while = description.while.map((w) => Action.fromDescription(w))
        newState.after = description.after.map((a) => Action.fromDescription(a))
        newState.on = description.on.map((o) => Transition.fromOnTransitionDescription(o,description.name))
        newState.always = description.always.map((a) => Transition.fromTransitionDescription(a, description.name))
        newState.localContext = description.localContext.variables.map((v) => ContextVariable.fromDescription(v))
        newState.persistentContext = description.persistentContext.variables.map((v) => ContextVariable.fromDescription(v))
        newState.staticContext = description.staticContext.variables.map((v) => ContextVariable.fromDescription(v))

        return newState

    }

    public rearrangeTransitions() {
        this._on = this._on.concat(this._always.filter((t) => t.getEvent().trim() !== ""))
        this._always = this._on.filter((t) => t.getEvent().trim() === "").concat(this._always.filter((t) => t.getEvent().trim() === ""))
        this.on = this.on.filter((t) => t.getEvent().trim() !== "")



    }








}