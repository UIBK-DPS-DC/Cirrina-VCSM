import Action from "./action.tsx";

export default class Transition {
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


    get guards(): string[] {
        return this._guards;
    }

    set guards(value: string[]) {
        this._guards = value;
    }

    get actions(): Action[] {
        return this._actions;
    }

    set actions(value: Action[]) {
        this._actions = value;
    }

    get else(): string[] {
        return this._else;
    }

    set else(value: string[]) {
        this._else = value;
    }

    get event(): string {
        return this._event;
    }

    set event(value: string) {
        this._event = value;
    }
}