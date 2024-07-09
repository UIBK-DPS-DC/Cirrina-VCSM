import { ActionOrActionReferenceClass, Builder, StateOrStatemachineClass } from "../Interfaces";
import { StatemachineClass } from "../StatemachineClass";
import { ContextClass } from "../context/ContextClass";
import { GuardClass } from "../guard/GuardClass";

export class StatemachineBuilder implements Builder<StatemachineClass>{
    private _statemachine: StatemachineClass;

    constructor(){  
        this._statemachine = new StatemachineClass();
    }

    public build(): StatemachineClass {
        if(this.validate()){
            return this._statemachine;
        }
        else{
            throw new Error("Statemachine must have a name and at least one state");
        }
    }

    public reset(): void {
        this._statemachine = new StatemachineClass();
    }

    public setName(name: string): StatemachineBuilder {
        this._statemachine.name = name;
        return this;
    }

    public setLocalContext(context: ContextClass): StatemachineBuilder{
        this._statemachine.localContext = context;
        return this;
    }

    public setPersistentContext(context: ContextClass): StatemachineBuilder{
        this._statemachine.persistentContext = context;
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

    private validate(): boolean{
        return (!(this._statemachine.name == "" || this._statemachine.states.length < 1))
    }






}