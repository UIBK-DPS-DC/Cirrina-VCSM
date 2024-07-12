import StateMachine from "../classes/statemachine";
import { Builder } from "../interfaces";

export default class StateMachineBuilder implements Builder<StateMachine> {
    private stateMachine: StateMachine

    public constructor(){
        this.stateMachine = new StateMachine("");
    }

    public build(): StateMachine {
        return this.stateMachine
    }

    public reset(): void {
        this.stateMachine = new StateMachine("")
    }

    public validate(): boolean {
        return this.stateMachine.getName() != ""
    }


    
    

}