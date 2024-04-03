import { ActionOrActionReferenceClass, Builder, StateOrStatemachineClass } from "../Interfaces";
import { StatemachineClass } from "../StatemachineClass";
import { GuardClass } from "../guard/GuardClass";

export class StatemachineBuilder implements Builder<StatemachineClass>{
    private _statemachine: StatemachineClass;

    constructor(){  
        this._statemachine = new StatemachineClass();
    }

    public build(): StatemachineClass {
        if(this._statemachine.name == "" || this._statemachine.states.length < 1){
            throw new Error("Statemachine must have a name and at least one state");
        }
        else{
            return this._statemachine;
        }
    }

    public reset(): void {
        this._statemachine = new StatemachineClass();
    }

    public setName(name: string): StatemachineBuilder {
        this._statemachine.name = name;
        return this;
    }

    public setStates(states: Array<StateOrStatemachineClass>): StatemachineBuilder{
        this._statemachine.states = states;
        return this;
    }

    public setGuards(guards: Array<GuardClass>): StatemachineBuilder{
        this._statemachine.guards = guards;
        return this;
    }

    public setActions(actions: Array<ActionOrActionReferenceClass>): StatemachineBuilder {
        this._statemachine.actions = actions;
        return this;
    }

    public setInherit(statemachineName: string): StatemachineBuilder{
        this._statemachine.inherit = statemachineName;
        return this;
    }

    public setIsAbstract(value: boolean): StatemachineBuilder {
        this._statemachine.isAbstract = value;
        return this;
    }






}