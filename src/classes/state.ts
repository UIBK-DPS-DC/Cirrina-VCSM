import StateOrStateMachine from "./stateOrStateMachine.ts"

export default class State extends StateOrStateMachine {
    // Static Fields

    _name: string

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

}