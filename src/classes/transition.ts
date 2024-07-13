import StateOrStateMachine from "./stateOrStateMachine.ts"

export default class Transition {
    private source : StateOrStateMachine
    private target : StateOrStateMachine

    public constructor (sourceState: StateOrStateMachine, targetState: StateOrStateMachine){
        this.source = sourceState
        this.target = targetState
    }


    public setSource(sourceState: StateOrStateMachine): void{
        this.source = sourceState
    }

    public setTarget(targetState: StateOrStateMachine): void{
        this.target = targetState
    }

    public getSource(): StateOrStateMachine{
        return this.source
    }

    public getTarget(): StateOrStateMachine{
        return this.target
    }

    


    



}