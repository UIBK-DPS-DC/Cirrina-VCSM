// This is a service related to managing our States and Statemachines
// All functions related to this objective should live here

import State from "../classes/state.ts";
import StateMachine from "../classes/stateMachine.ts";
import {CsmNodeProps, isState, isStateMachine} from "../types.ts";

export default class StateOrStateMachineService {
    private id: number = 0
    private stateOrStatemachineNames : Set<string>;

    public constructor() {
        this.stateOrStatemachineNames = new Set();

    }

    /**
     * Registers a state or state machine name.
     *
     * This method checks if the provided `stateOrStatemachineName` is unique by
     * comparing it against a collection of already registered names. If the name
     * is not unique, it logs an error message to the console and returns `false`.
     * If the name is unique, it adds the name to the collection and returns `true`.
     *
     * @param {string} stateOrStatemachineName - The name of the state or state machine to register.
     * @returns {boolean} - Returns `true` if the name is unique and successfully registered,
     *                      otherwise returns `false`.
     */
    public registerName(stateOrStatemachineName: string): boolean {
        if(!this.isNameUnique(stateOrStatemachineName)){
            console.error("StateOrStateMachine name already exists!");
            return false;
        }

        this.stateOrStatemachineNames.add(stateOrStatemachineName);
        console.log(stateOrStatemachineName + " has been registered!");
        return true;
    }

    /**
     * Unregisters a state or state machine name.
     *
     * This method removes the provided `stateOrStatemachineName` from the collection
     * of registered names. If the name does not exist in the collection, no action is taken.
     *
     * @param {string} stateOrStatemachineName - The name of the state or state machine to unregister.
     */
    public unregisterName(stateOrStatemachineName: string | unknown): void {
        if(typeof stateOrStatemachineName === "string" ){
            this.stateOrStatemachineNames.delete(stateOrStatemachineName);
            console.log(stateOrStatemachineName + " has been unregistered!");
        }
        else {
            console.warn("Invalid name type: unable to unregister", stateOrStatemachineName);
        }

    }

    /**
     * Checks if a state or state machine name is unique.
     *
     * This method determines whether the provided `stateOrStatemachineName` is unique
     * by checking its presence in the collection of registered names. It returns `true`
     * if the name is not found in the collection, indicating that it is unique.
     * Otherwise, it returns `false`.
     *
     * @param {string} stateOrStatemachineName - The name of the state or state machine to check for uniqueness.
     * @returns {boolean} - Returns `true` if the name is unique (i.e., not found in the collection),
     *                      otherwise returns `false`.
     */
    public isNameUnique(stateOrStatemachineName: string): boolean {
        return ! this.stateOrStatemachineNames.has(stateOrStatemachineName);
    }

    /**
     * Generates a unique name for a state or state machine.
     *
     * This method constructs a unique identifier by concatenating the provided `type`
     * with an incrementing `id`. It checks the generated name against the collection
     * of already registered names to ensure uniqueness. If a collision is found,
     * it continues to increment the `id` and check again until a unique name is generated.
     *
     * @param {string} type - The type of the state or state machine (e.g., 'state', 'custom').
     * @returns {string} - Returns a unique name in the format `type id`.
     */
    public generateUniqueName(type: string): string {
        let newId: string = type + " " + `${this.id++}`
        while(!this.isNameUnique(newId)){
            newId = type + " " + `${this.id++}`
        }

        return newId

    }

    /**
     * Retrieves the name from the provided data object.
     *
     * This function determines the type of the provided `data` object and extracts the name accordingly.
     * The `data` object can be one of the following types:
     * - `{ state: State }`
     * - `{ stateMachine: StateMachine }`
     * - `{ name: string }`
     *
     * If the `data` object contains a `state` property, it returns the `name` property of the `state` object.
     * If the `data` object contains a `stateMachine` property, it returns the `name` property of the `stateMachine` object.
     * If the `data` object contains a `name` property directly, it returns that `name`.
     *
     * @param {CsmNodeProps} data - The data object from which to retrieve the name.
     * @returns {string} The name retrieved from the data object.
     */
    public getName(data: CsmNodeProps): string  {
        return(isState(data) ? data.state.name :
            isStateMachine(data) ? data.stateMachine.name :
                data.name)
    }

    /**
     * Updates the name property in the provided data object.
     *
     * This function determines the type of the provided `data` object and updates the name accordingly.
     * The `data` object can be one of the following types:
     * - `{ state: State }`
     * - `{ stateMachine: StateMachine }`
     * - `{ name: string }`
     *
     * If the `data` object contains a `state` property, it creates a new `data` object with the updated `state.name` property.
     * If the `data` object contains a `stateMachine` property, it creates a new `data` object with the updated `stateMachine.name` property.
     * If the `data` object contains a `name` property directly, it creates a new `data` object with the updated `name`.
     * If the `data` object does not match any of these types, it returns the original `data` object.
     *
     * @param {string} newName - The new name to be set.
     * @param {CsmNodeProps} data - The data object in which to update the name.
     * @returns {CsmNodeProps} A new data object with the updated name.
     */
    public setName(newName: string, data: CsmNodeProps): CsmNodeProps {
        if (isState(data)) {
            return { ...data, state: { ...data.state, name: newName } };
        }
        if (isStateMachine(data)) {
            return { ...data, stateMachine: { ...data.stateMachine, name: newName } };
        }
        return data;
    }


    public getDefaultState(name: string): State {
        // add default config here
        return new State(name);
    }

    public getDefaultStateMachine(name: string): StateMachine {
        // add default config here
        return new StateMachine(name);
    }

    public getDefaultData(type: string, name :string) {
        switch (type) {
            case "state-node":
                return {
                    "state": this.getDefaultState(name ? name : "" ),
                };
            case "state-machine-node":
                return {
                    "stateMachine": this.getDefaultStateMachine(name ? name : ""),
                };
            default:
                return{
                    "name": name ? name : "",
                };

        }
    }

}

