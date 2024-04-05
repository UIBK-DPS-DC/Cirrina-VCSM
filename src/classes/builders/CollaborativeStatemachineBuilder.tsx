import { CollaborativeStatemachineClass } from "../CollaborativeStatemachineClass";
import { MemoryMode, Version } from "../Enums";
import { Builder } from "../Interfaces";
import { StatemachineClass } from "../StatemachineClass";
import { ContextClass } from "../context/ContextClass";

export class CollaborativeStatemachineBuilder implements Builder<CollaborativeStatemachineClass> {
    private _collaborativeSatemachine : CollaborativeStatemachineClass;

    constructor(){
        this._collaborativeSatemachine = new CollaborativeStatemachineClass();
    }

    public build(): CollaborativeStatemachineClass{
        if(this.validate()){
            return this._collaborativeSatemachine;
        }
        throw new Error("Invalid Collaborative Statemachine cannot be constructed");
         
        
    }

    public reset(): void {
        this._collaborativeSatemachine = new CollaborativeStatemachineClass();
    }

    public setName(name: string): CollaborativeStatemachineBuilder{
        this._collaborativeSatemachine.name = name;
        return this;
    }

    public setVersion(version: Version): CollaborativeStatemachineBuilder{
        this._collaborativeSatemachine.version = version;
        return this;
    }

    public setMemoryMode(mode: MemoryMode): CollaborativeStatemachineBuilder{
        this._collaborativeSatemachine.memoryMode = mode;
        return this;
    }

    public setStatemachines(statemachines: Array<StatemachineClass>): CollaborativeStatemachineBuilder{
        this._collaborativeSatemachine.stateMachines = statemachines;
        return this;
    }

    public setLocalContext(context: ContextClass): CollaborativeStatemachineBuilder{
        this._collaborativeSatemachine.localContext = context;
        return this;
    }

    public setPersistentContext(context: ContextClass): CollaborativeStatemachineBuilder{
        this._collaborativeSatemachine.persistentContext = context;
        return this;
    }

    private validate(): boolean{
        return(
            (this._collaborativeSatemachine.name != "")
            &&(this._collaborativeSatemachine.version != Version.UNDEFINED)
            &&(this._collaborativeSatemachine.memoryMode != MemoryMode.UNDEFINED)
            &&(this._collaborativeSatemachine.stateMachines.length > 0)
        );
    }



}