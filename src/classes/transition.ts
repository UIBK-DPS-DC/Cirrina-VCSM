import Action from "./action.tsx";
import Guard from "./guard.tsx";
import {
    OnTransitionDescription,
    TransitionDescription
} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";

export default class Transition {

    private static _TRANSITION_ID_COUNT = 0;

    private readonly ID: number
    private _edgeId: string
    private source : string
    private target : string
    private _guards : Guard[]
    private _actions : Action[]
    private _else : string
    private _event : string
    private _isStatemachineEdge : boolean
    private _isElseEdge: boolean
    private _elseSourceId: number | undefined // To link else edges to edges with corresponding else statement

    public constructor (sourceState: string, targetState: string, isStatemachineEdge: boolean = false, isElseEdge: boolean = false, elseSourceId: number | undefined = undefined) {
        this.source = sourceState
        this.target = targetState
        this._guards = []
        this._actions = []
        this._else = ""
        this._event = ""
        this._isStatemachineEdge = isStatemachineEdge
        this.ID = this.getNewId()
        this._edgeId = ""
        this._isElseEdge = isElseEdge
        this._elseSourceId = elseSourceId
    }

    get edgeId(): string {
        return this._edgeId;
    }
    set edgeId(value: string) {
        this._edgeId = value;
    }


    get elseSourceId(): number | undefined {
        return this._elseSourceId;
    }

    set elseSourceId(value: number | undefined) {
        this._elseSourceId = value;
    }

    get isElseEdge(): boolean {
        return this._isElseEdge;
    }

    set isElseEdge(value: boolean) {
        this._isElseEdge = value;
    }

    public setSource(sourceState: string): void{
        this.source = sourceState
    }

    public setTarget(targetState: string): void{
        this.target = targetState
    }

    public getSource(): string{
        return this.source
    }

    public getTarget(): string{
        return this.target
    }


    get isStatemachineEdge(): boolean {
        return this._isStatemachineEdge;
    }

    set isStatemachineEdge(value: boolean) {
        this._isStatemachineEdge = value;
    }

    public getGuards(): Guard[] {
        return this._guards;
    }

    public setGuards(value: Guard[]) {
        this._guards = value;
    }

    public getActions(): Action[] {
        return this._actions;
    }

    public setActions(value: Action[]) {
        this._actions = value;
    }

    public getElse(): string {
        return this._else;
    }

    public setElse(value: string) {
        this._else = value;
    }

    public getEvent(): string {
        return this._event;
    }

    public setEvent(value: string) {
        this._event = value;
    }

    public getId() {
        return this.ID;
    }

    /**
     * Adds a guard to the transition.
     *
     * This method adds the provided `guard` string to the `_guards` array,
     * which represents the set of guards associated with this transition.
     * Before adding, it checks if the guard already exists in the array to
     * avoid duplicates. If the guard already exists, a warning is logged
     * and the guard is not added again.
     *
     * @param {string} guard - The guard to be added to the transition.
     */
    //TODO UPDATE THE CHECK FOR THE NEW GUARD CLASS
    public addGuard(guard: Guard): void {
        if (this._guards.some(existingGuard => existingGuard.equals(guard))) {
            console.warn(`Guard ${guard.name} already exists on Transition ${this.source} => ${this.target}!`);
            return;
        }
        this._guards.push(guard);
    }

    public removeGuard(guard: Guard): void {
        this._guards = this._guards.filter((g) => g !== guard);
    }

    public addAction(action: Action): void {
        if(this._actions.some(existingAction => existingAction === action)){
            console.warn(`Action ${action.name} already exists`)
            return;
        }
        this._actions.push(action)
    }

    public removeAction(action: Action): void {
        this._actions = this._actions.filter((a) => a !== action);
    }





    private getNewId(){
        return Transition._TRANSITION_ID_COUNT++;
    }


    public getAllNamedGuards() {
        return this._guards.filter((guard) => {
            return !!guard.name.trim()
        })
    }

    // TODO: Expand for internal transitions.
    public toDescription(): OnTransitionDescription {
        const description: OnTransitionDescription = {
            actions: this.getActions().map((a) => a.toDescription()) ,
            else: this.getElse(),
            event: this.getEvent(),
            guards: this.getGuards().map((guard)=> {return guard.toDescription()}),
            target: this.target

        }
        return description;
    }


    public static fromOnTransitionDescription(description: OnTransitionDescription, sourceState: string): Transition {

        const newTransition = new Transition(sourceState, description.target || "")
        newTransition._guards = description.guards.map((g) => Guard.fromDescription(g));
        newTransition._actions = description.actions.map((a) => Action.fromDescription(a))
        newTransition._else = description.else || ""
        console.log(`AAAAAAAAAAAAAAAAAAAAAAAA ${description.else}`)
        newTransition._event = description.event
        console.log(`NEW TRANSITION ${newTransition.getElse()}`)
        return newTransition;
    }

    public static fromTransitionDescription(description: TransitionDescription, sourceState: string): Transition {
        const newTransition = new Transition(sourceState, description.target || "")
        newTransition._guards = description.guards.map((g) => Guard.fromDescription(g));
        newTransition._actions = description.actions.map((a) => Action.fromDescription(a))
        newTransition._else = description.else || ""
        console.log(`AAAAAAAAAAAAAAAAAAAAAAAA ${description.else}`)
        return newTransition;
    }





}