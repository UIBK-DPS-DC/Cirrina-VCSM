import StateMachine from "../classes/stateMachine.ts";
import { Builder } from "../interfaces";

export default class StateMachineBuilder implements Builder<StateMachine> {
    private stateMachine: StateMachine

    public constructor(){
        this.stateMachine = new StateMachine("");
    }


    public setStateMachineName(stateMachineName: string){
        this.stateMachine._name = stateMachineName
    }

    public build(): StateMachine {
        return this.stateMachine
    }

    public reset(): void {
        this.stateMachine = new StateMachine("")
    }

    public validate(): boolean {
        return this.stateMachine.name != ""
    }



    
    

}