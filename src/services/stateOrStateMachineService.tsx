// This is a service related to managing our States and Statemachines
// All functions related to this objective should live here

import State from "../classes/state.ts";
import StateMachine from "../classes/stateMachine.ts";
import {CsmNodeProps, isState, isStateMachine} from "../types.ts";
import StateOrStateMachine from "../classes/stateOrStateMachine.ts";
import Action from "../classes/action.ts";
import {ActionCategory} from "../enums.ts";


export type NO_PARENT = "0"
export const NO_PARENT: NO_PARENT = "0"

export default class StateOrStateMachineService {
    private id: number = 0
    private stateOrStatemachineNames : Set<string>;
    private nodeIdToStateOrStatemachineMap = new Map<string,StateOrStateMachine>
    private statemachineIDToStateNamesMap = new Map<string,Set<string>>



    public constructor() {
        this.stateOrStatemachineNames = new Set();
        this.nodeIdToStateOrStatemachineMap = new Map();
        this.statemachineIDToStateNamesMap = new Map();
        this.statemachineIDToStateNamesMap.set(NO_PARENT, new Set<string>());


    }


    /**
     * Links a state name to a state machine in the internal mapping.
     *
     * This method attempts to link a given state `name` to a state machine identified by `stateMachineID`.
     * If the state machine doesn't exist and the `create` flag is true, a new entry is created for that
     * state machine. If the `create` flag is false and the state machine doesn't exist, an error is logged.
     * The function also ensures no duplicate state names are added to the state machine.
     *
     * @param {string} name - The name of the state to link.
     * @param {string} stateMachineID - The ID of the state machine to link the state to.
     * @param {boolean} [create=false] - Optional flag to create the state machine if it doesn't exist.
     */
    public linkStateNameToStatemachine(name: string, stateMachineID: string | NO_PARENT, create?: boolean) {
        let stateNames = this.statemachineIDToStateNamesMap.get(stateMachineID);

        if (!stateNames) {
            if (!create) {
                console.error(`Statemachine ${stateMachineID} does not exist.\n`);
                return;
            }
            // Create new entry for state machine if 'create' is true

            stateNames = new Set([]);
            const stateMachine = this.getLinkedStateOrStatemachine(stateMachineID)
            if(stateMachine){
                stateNames.add(stateMachine.name)
                console.log(`Statemachine ${stateMachine.name} has been added to initial stateNames!`);
            }
            this.statemachineIDToStateNamesMap.set(stateMachineID, stateNames);
        }

        // Avoid duplicates before pushing the state name
        if (!stateNames.has(name)) {
            stateNames.add(name);
            console.log(`${name} has been linked to ${stateMachineID}`)
            return
        }
        else{
            console.error(`State ${name} already exist on Statemachine ${stateMachineID}`)
        }
    }


    public getStateNames(stateMachineID: string): Set<string> | undefined {
        let stateNames = this.statemachineIDToStateNamesMap.get(stateMachineID);
        if (stateNames === undefined) {
            console.log(`No States are linked to ${stateMachineID}`);
            return stateNames;
        }
        return stateNames;
    }

    /**
     * Unlinks a state name from a state machine in the internal mapping.
     *
     * This method attempts to unlink a given state `name` from a state machine identified by `stateMachineID`.
     * If the state exists, it is removed from the state machine. If the state machine no longer has any states
     * after the removal, the state machine entry is deleted. If the state or state machine doesn't exist,
     * an appropriate message is logged.
     *
     * @param {string} name - The name of the state to unlink.
     * @param {string} stateMachineID - The ID of the state machine to unlink the state from.
     * @returns {boolean} - Returns `true` if the state was successfully unlinked, `false` if the state or
     *                      state machine does not exist.
     */
    public unlinkStateNameFromStatemachine(name: string, stateMachineID: string): boolean {
        const states = this.statemachineIDToStateNamesMap.get(stateMachineID);

        if (states) {
            const deleted = states.delete(name);

            if (!deleted) {
                console.log(`State ${name} does not exist in Statemachine ${stateMachineID}.\n`);
                return false;
            } else {
                console.log(`${name} has been unlinked from statemachine with ID ${stateMachineID}`);
            }

            // If no states are left, remove the entire state machine entry
            if (states.size === 0) {
                this.statemachineIDToStateNamesMap.delete(stateMachineID);
                console.log(`Statemachine ${stateMachineID} has no more states and has been removed.`);
            }

            return true;
        } else {
            console.log(`Statemachine ${stateMachineID} does not exist.\n`);
            return false;
        }
    }



    /**
     * Checks if a state machine contains a specific state.
     *
     * This method checks whether a state machine, identified by `stateMachineID`, contains a state
     * with the name `stateName`. If the state machine doesn't exist, an appropriate message is logged,
     * and `false` is returned.
     *
     * @param {string} stateName - The name of the state to check.
     * @param {string} stateMachineID - The ID of the state machine to search.
     * @returns {boolean} - Returns `true` if the state machine contains the state, `false` if the state or
     *                      state machine does not exist.
     */
    public stateMachineHasState(stateName: string, stateMachineID: string): boolean {
        const stateNames = this.statemachineIDToStateNamesMap.get(stateMachineID);
        if (!stateNames) {
            console.log(`Statemachine ${stateMachineID} does not exist.\n`);
            return false;
        }

        return stateNames.has(stateName);
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
            const updatedState = data.state
            updatedState.name = newName;
            return { ...data, state: updatedState };
        }
        if (isStateMachine(data)) {
            const updatedStatemachine = data.stateMachine
            updatedStatemachine.name = newName;
            return { ...data, stateMachine: updatedStatemachine };
        }
        if (data.name !== undefined) {
            return { ...data, name: newName };
        }
        return data;  // Return original data unchanged if it doesn't match any type
    }

    /**
     * Adds an action to the specified category of a state.
     *
     * This method adds an `Action` to a specified category within a `State` object contained in the `data` parameter.
     * It modifies the `State` object directly, adding the `Action` to the appropriate array (entry, exit, after, while)
     * based on the provided `actionCategory`.
     *
     * @param {CsmNodeProps} data - The data object containing the state or state machine.
     * @param {Action} action - The action to be added to the state.
     * @param {ActionCategory} actionCategory - The category to which the action belongs (entry, exit, timeout, or while).
     * @returns {CsmNodeProps} - The modified data object with the action added to the appropriate category.
     */
    public addActionToState(data: CsmNodeProps, action: Action, actionCategory: ActionCategory): CsmNodeProps {
            if(isState(data)) {
                switch (actionCategory) {
                    case ActionCategory.ENTRY_ACTION: {
                        if(!data.state.entry.includes(action)){
                            data.state.entry.push(action);
                        }
                        else{
                            console.error(`${action.name} already exists in ${data.state.name}'s ${actionCategory} actions`)
                        }
                        break;
                    }
                    case ActionCategory.EXIT_ACTION: {
                        if(!data.state.exit.includes(action)){
                            data.state.exit.push(action);
                        }
                        else{
                            console.error(`${action.name} already exists in ${data.state.name}'s ${actionCategory} actions`)
                        }
                        break;
                    }//TODO: Handle timeout stuff
                    case ActionCategory.TIMEOUT: {
                        if(!data.state.after.includes(action)){
                            data.state.after.push(action);
                        }
                        else{
                            console.error(`${action.name} already exists in ${data.state.name}'s ${actionCategory} actions`)
                        }
                        break;
                    }
                    case ActionCategory.WHILE_ACTION: {
                        if(!data.state.while.includes(action)){
                            data.state.while.push(action);
                        }
                        else{
                            console.error(`${action.name} already exists in ${data.state.name}'s ${actionCategory} actions`)
                        }
                        break;
                    }
                    default:
                        break;

                }
                return data;
            }

            // TODO: Separate logic for statemachines ?
            return data;


    }

    /**
     * Removes an action from all action arrays within a state.
     *
     * This method takes an `Action` and a `CsmNodeProps` data object,
     * and if the `data` contains a valid state, it attempts to remove the action
     * from the state's `entry`, `while`, `exit`, and `after` action arrays.
     * The removal is performed by filtering out the specified action from each array.
     *
     * - The function checks if `data` contains a valid state using the `isState` helper.
     * - It iterates through each of the state's action arrays (`entry`, `while`, `exit`, `after`)
     *   and removes any occurrence of the given `action` by filtering the array.
     *
     * If the `data` is not a valid state, no action is taken, and the function returns immediately.
     *
     * @param {Action} action - The action to be removed from the state.
     * @param {CsmNodeProps} data - The node properties, which could contain a state.
     *                               The function will modify the state's action arrays if the state is valid.
     */
    public removeActionFromState(action: Action, data: CsmNodeProps) {
        if(isState(data)){
            data.state.entry = data.state.entry.filter((a) => a !== action)
            data.state.while = data.state.while.filter((a) => a !== action)
            data.state.exit = data.state.exit.filter((a) => a !== action)
            data.state.after = data.state.after.filter((a) => a !== action)

        }
        return;
    }

    /**
     * Links a node to a state or state machine.
     *
     * This method associates a given node ID with a corresponding state or state machine based on the provided data.
     * It updates the internal mapping of node IDs to states or state machines.
     * If the data represents a state, it links the node to the state.
     * If the data represents a state machine, it links the node to the state machine.
     * If the data type is unknown, it logs an error message.
     *
     * @param {string} nodeId - The ID of the node to be linked.
     * @param {CsmNodeProps} data - The data object containing the state or state machine information.
     */
    public linkNode(nodeId: string, data: CsmNodeProps) {
        console.log("Entering link node")
        if(isState(data)) {
            this.nodeIdToStateOrStatemachineMap.set(nodeId, data.state);
            console.log(`Linked ${nodeId} to ${data.state.name}`)
            return;
        }
        if(isStateMachine(data)){
            this.nodeIdToStateOrStatemachineMap.set(nodeId,data.stateMachine);
            console.log(`Linked ${nodeId} to ${data.stateMachine.name}`)
            return;
        }

        console.error(`Node could not be linked, unknown type of data ${data}`);
        return;

    }

    /**
     * Unlinks a node from its associated state or state machine.
     *
     * This method removes the association of a given node ID from the internal mapping of node IDs to states or state machines.
     * If the node ID is not found in the mapping, it logs a message indicating that the node was not found.
     *
     * @param {string} nodeId - The ID of the node to be unlinked.
     */
    public unlinkNode(nodeId: string) {
        const res = this.nodeIdToStateOrStatemachineMap.delete(nodeId)
        if(!res){
            console.log(`Node: ${nodeId} not found!`);
        }
        console.log(`${nodeId} has been unlinked!`);
    }

    /**
     * Retrieves the state or state machine linked to a given node ID.
     *
     * This method fetches the state or state machine associated with the provided node ID from the internal mapping.
     * If the node ID is not found in the mapping, it logs an error message and returns `undefined`.
     *
     * @param {string} nodeId - The ID of the node whose linked state or state machine is to be retrieved.
     * @returns {StateOrStateMachine | undefined} - The state or state machine linked to the node ID, or `undefined` if not found.
     */
    public getLinkedStateOrStatemachine(nodeId: string): StateOrStateMachine | undefined {
        const stateOrStateMachine = this.nodeIdToStateOrStatemachineMap.get(nodeId);
        if(stateOrStateMachine === undefined){
            console.error(`State or Statemachine with id ${nodeId} could not be found`)
            return stateOrStateMachine;
        }
        return stateOrStateMachine
    }

    /**
     * Gets the state or state machine by name.
     *
     * @param name - The name of the state or state machine to find.
     * @returns The state or state machine if found, otherwise undefined.
     */
    public getStateOrStateMachineByName(name: string): StateOrStateMachine | undefined {
        for (const stateOrStateMachine of this.nodeIdToStateOrStatemachineMap.values()) {
            if (stateOrStateMachine.name === name) {
                return stateOrStateMachine;
            }
        }
        console.log(`Statemachine ${name} not found!`);
        return undefined;
    }

    public addStateToStatemachine(stateMachine :StateMachine, data: CsmNodeProps ) {
        if(isState(data)){
            stateMachine.addState(data.state);
            console.log(`Added ${data.state.name} to ${stateMachine.name} as state!`);
            return;
        }
        if(isStateMachine(data)){
            console.log(`Added ${data.stateMachine.name} to ${stateMachine.name} as state!`);
            stateMachine.addState(data.stateMachine)
            return;
        }
        console.error("Unknown data type")
        return;
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


