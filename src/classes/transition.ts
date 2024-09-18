import Action from "./action.tsx";
import Guard from "./guard.tsx";
import {OnTransitionDescription} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";

export default class Transition {
    private static _TRANSITION_ID_COUNT = 0;

    private readonly ID: number
    private source : string
    private target : string
    private _guards : Guard[]
    private _actions : Action[]
    private _else : string []
    private _event : string

    public constructor (sourceState: string, targetState: string){
        this.source = sourceState
        this.target = targetState
        this._guards = []
        this._actions = []
        this._else = []
        this._event = ""
        this.ID = this.getNewId()
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

    public getElse(): string[] {
        return this._else;
    }

    public setElse(value: string[]) {
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
            actions: [], else: null, event: this.getEvent(),
            guards: this.getGuards().map((guard)=> {return guard.toDescription()}),
            target: this.target

        }
        return description;
    }





}