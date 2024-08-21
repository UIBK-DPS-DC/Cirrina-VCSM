import StateOrStateMachine from "./stateOrStateMachine.ts"
import {Context} from "../types.ts";
import Action from "./action.tsx";
import State from "./state.ts";
import Guard from "./guard.tsx";

export default class StateMachine implements StateOrStateMachine {

    private _name: string
    private _states: StateOrStateMachine[] = [];
    private _localContext: Context[] = [];
    private _persistentContext: Context[] = [];
    private _guards: string[] = [];
    private _actions: Action[] = [];
    private _abstract = false

    public constructor(name: string) {
        this._name = name
    }

    public get name(): string {
        return this._name
    }

    public set name(name: string) {
        this._name = name
    }

    get states(): StateOrStateMachine[] {
        return this._states;
    }

    set states(value: StateOrStateMachine[]) {
        this._states = value;
    }

    get localContext(): Context[] {
        return this._localContext;
    }

    set localContext(value: Context[]) {
        this._localContext = value;
    }

    get persistentContext(): Context[] {
        return this._persistentContext;
    }

    set persistentContext(value: Context[]) {
        this._persistentContext = value;
    }

    get guards(): string[] {
        return this._guards;
    }

    set guards(value: string[]) {
        this._guards = value;
    }

    get actions(): Action[] {
        return this._actions;
    }

    set actions(value: Action[]) {
        this._actions = value;
    }

    get abstract(): boolean {
        return this._abstract;
    }

    set abstract(value: boolean) {
        this._abstract = value;
    }

    public addState(stateOrStatemachine: StateOrStateMachine): void {
        this._states.push(stateOrStatemachine);
    }

    public clearStates() {
        this._states = [];
    }

    public getAllNamedActions() {
        let actions: Action[] = [];
        this.states.forEach(stateOrStatemachine => {
            actions = actions.concat(stateOrStatemachine.getAllNamedActions())
        })
        return actions.filter((action, index, self) => {
            return index === self.findIndex((a) => {
               return a.equals(action);
            })
        })
    }

    public getAllNamedGuards(): Guard[] {
        let guards: Guard[] = [];
        this.states.forEach(stateOrStatemachine => {
            guards = guards.concat(stateOrStatemachine.getAllNamedGuards())
        })
        return guards.filter((guard, index, self) => {
            return index === self.findIndex((g) => {
                return g.equals(guard);
            })
        })
    }


    public toDICT(): object {
        let dict: {
            states: { [key: string]: object };
            stateMachines: { [key: string]: object };
            guards?: {[key: string] : string};  // Optional guards field
            actions?: {[key: string] : object};  // Optional actions field
        } = {
            states: {} as { [key: string]: object },
            stateMachines: {} as { [key: string]: object }
        };

        this.states.forEach((stateOrStateMachine) => {
            if(stateOrStateMachine instanceof State) {
                dict = {
                    ...dict,
                    states: {
                        ...dict.states,
                        [stateOrStateMachine.name]: stateOrStateMachine.toDICT()

                    }
                }
            }
            if(stateOrStateMachine instanceof StateMachine) {
                dict = {
                    ...dict,
                    stateMachines: {
                        ...dict.stateMachines,
                        [stateOrStateMachine.name]: stateOrStateMachine.toDICT()

                    }
                }
            }

        })


        if(this.getAllNamedActions().length > 0) {
            dict = {...dict, actions:{}}
            this.getAllNamedActions().forEach((action) => {
                dict = {...dict,
                actions: {
                    ...dict.actions,
                    [action.name] : action.properties
                }}
            })
        }

        if(this.getAllNamedGuards().length > 0) {
            dict = {...dict, guards:{}}
            this.getAllNamedGuards().forEach((guard) => {
                dict = {...dict,
                guards: {
                ...dict.guards,
                [guard.name] : guard.expression}
                }
            })
        }


        /**
         * In JavaScript and TypeScript, object properties do not have a guaranteed order.
         * The order in which properties appear when you print or iterate over an object
         * is generally determined by the JavaScript engine and can vary.
         * When you add new properties to an object using the spread operator,
         * the new properties are added at the end of the object literal
         * but may appear earlier when the object is printed,
         * depending on the engine's internal handling.
         * If you need the properties to appear in a specific order
         * when printed or accessed, you can explicitly create a new object with the desired order.
         * This is why the following code exists.
         */

        if(dict.guards && dict.actions){
            dict = {
                states: dict.states,
                stateMachines: dict.stateMachines,
                actions: dict.actions,
                guards: dict.guards,

            }
            return dict
        }

        if(dict.guards){
            dict = {
                states: dict.states,
                stateMachines: dict.stateMachines,
                guards: dict.guards,
            }
            return dict
        }

        if(dict.actions){
            dict = {
                states: dict.states,
                stateMachines: dict.stateMachines,
                actions: dict.actions
            }
            return dict
        }


        return dict;
    }


}