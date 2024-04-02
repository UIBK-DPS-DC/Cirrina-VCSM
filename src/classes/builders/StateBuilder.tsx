import { ActionOrActionReferenceClass, Builder } from "../Interfaces";
import { StateClass } from "../StateClass";
import { ContextClass } from "../context/ContextClass";
import { OnTransitionClass } from "../transition/OnTransitionClass";
import { TransitionClass } from "../transition/TransitionClass";

export class StateBuilder implements Builder<StateClass>{
    private _state : StateClass;

    constructor(){
        this._state = new StateClass();
    }

    public build(): StateClass | undefined{
        if(this.validate()){
            return this._state;
        }
        console.log("Sate name cannot be empty");
        return undefined;

        
    }

    public reset(): void {
        this._state = new StateClass();
        console.log("Builder has been reset");
    }

    private validate() :boolean {
        return (this._state.name != "");
    }


    public setName(name: string): StateBuilder {
        this._state.name = name;
        return this;
    }

    public setIsInitial(value: boolean): StateBuilder{
        this._state.isInitial = value;
        return this;
    }

    public setIsTerminal(value: boolean): StateBuilder{
        this._state.isTerminal = value;
        return this
    }

    
    public setEntryActions(actions: Array<ActionOrActionReferenceClass>) : StateBuilder{
        this._state.entry = actions;
        return this;
    }

    public setExitActions(actions: Array<ActionOrActionReferenceClass>) : StateBuilder{
        this._state.exit = actions;
        return this;
    }

    public setWhileActions(actions: Array<ActionOrActionReferenceClass>): StateBuilder {
        this._state.while = actions;
        return this;
    }

    public setOnEventTransitions(transitions: Array<OnTransitionClass>): StateBuilder{
        this._state.on = transitions;
        return this;
    }

    public setAlwaysTransitions(transitions : Array<TransitionClass>): StateBuilder{
        this._state.always = transitions;
        return this;
    }

    public setLocalContext(context: ContextClass): StateBuilder{
        this._state.localContext = context;
        return this;
    }

    public setPersistentContext(context: ContextClass): StateBuilder{
        this._state.persistentContext = context;
        return this;
    }

    public setStaticContext(context: ContextClass): StateBuilder {
        this._state.staticContext = context;
        return this;
    }

    public setIsVirtual(value: boolean): StateBuilder{
        this._state.isVirtual = value;
        return this;
    }

    public setIsAbstract(value: boolean): StateBuilder{
        this._state.isAbstract = value;
        return this;
    }







}