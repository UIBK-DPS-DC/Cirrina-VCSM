import StateOrStatemachine from "./stateOrStatemachine"

export default class Transition {
    private source : StateOrStatemachine
    private target : StateOrStatemachine

    public constructor (sourceState: StateOrStatemachine, targetState: StateOrStatemachine){
        this.source = sourceState
        this.target = targetState
    }


    public setSource(sourceState: StateOrStatemachine): void{
        this.source = sourceState
    }

    public setTarget(targetState: StateOrStatemachine): void{
        this.target = targetState
    }

    public getSource(): StateOrStatemachine{
        return this.source
    }

    public getTarget(): StateOrStatemachine{
        return this.target
    }

    


    



}