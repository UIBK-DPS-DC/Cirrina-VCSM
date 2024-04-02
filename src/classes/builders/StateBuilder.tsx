import { Builder } from "../Interfaces";
import { StateClass } from "../StateClass";

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


    public setName(name: string): void {
        this._state.name = name;
    }



}