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
}