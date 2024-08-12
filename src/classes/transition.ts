import Action from "./action.tsx";

export default class Transition {
    private static _TRANSITION_ID_COUNT = 0;

    private readonly ID: number
    private source : string
    private target : string
    private _guards : string[]
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


    public getGuards(): string[] {
        return this._guards;
    }

    public setGuards(value: string[]) {
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


    public addGuard(guard: string): void {
        if(this._guards.includes(guard)){
            console.warn(`Guard ${guard} already exists on Transition ${this.source} => ${this.target}!`)
            return;
        }
        this._guards.push(guard);
    }

    private getNewId(){
        return Transition._TRANSITION_ID_COUNT++;
    }

}