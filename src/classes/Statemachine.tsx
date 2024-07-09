import StateOrStatemachine from "./stateOrStatemachine"

export default class StateMachine extends StateOrStatemachine {
    // Static Fields



    //Object Fields
    private name: string

    public constructor(statemachineName: string) {
        super()
        this.name = statemachineName
    }

    public getName(): string {
        return this.name
    }

    public setName(statemachineName: string){
        this.name = statemachineName
    }




}