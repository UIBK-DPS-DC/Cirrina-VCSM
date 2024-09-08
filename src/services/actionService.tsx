import Action from "../classes/action.ts";
import {CsmNodeProps, isState} from "../types.ts";
import {ActionCategory, ActionType} from "../enums.ts";

export default class ActionService {
    private nameToActionMap: Map<string,Action>;
    private typeToActionsMap: Map<ActionType,Action[]>;

    public constructor() {
        this.nameToActionMap = new Map();
        this.typeToActionsMap = new Map();

        Object.values(ActionType).forEach(type => {
            this.typeToActionsMap.set(type as ActionType, []); // Initialize each ActionType with an empty array.
        });

    }


    /**
     * Registers an action name.
     *
     * This method checks if the provided `actionName` is unique by comparing it against
     * a collection of already registered names. If the name is not unique, it logs an
     * error message to the console and returns `false`. If the name is unique, it adds
     * the name to the collection and returns `true`.
     *
     * @param {string} actionName - The name of the action to register.
     * @returns {boolean} - Returns `true` if the name is unique and successfully registered,
     *                      otherwise returns `false`.
     */
    public registerName(actionName: string, action: Action): boolean {
        if(!this.isNameUnique(actionName)){
            console.error("Action name already exists!");
            return false;
        }

        this.nameToActionMap.set(actionName,action);
        console.log(actionName + " has been registered!");
        return true;
    }

    /**
     * Registers an action into the type-to-actions map.
     *
     * This method takes an action object and checks whether it has a valid type. If the action has no type,
     * it logs an error and exits. If the action has a valid type, it retrieves the corresponding array from
     * the `typeToActionsMap` and pushes the action into that array. If the action type does not exist in the map,
     * it logs an error message.
     *
     * @param {Action} action - The action object to register.
     */
    public registerAction(action: Action): void {
        if(!action.type){
            console.error("Action does not have a type");
            return
        }

        const arr = this.typeToActionsMap.get(action.type);
        if(!arr) {
            console.error(`Action type ${action.type} does not exist.`);
        }
        else{
            arr.push(action);
        }


    }

    /**
     * Deregisters (removes) an action from the type-to-actions map.
     *
     * This method takes an action object and checks whether it has a valid type. If the action has no type,
     * it logs an error and exits. If the action has a valid type, it retrieves the corresponding array from
     * the `typeToActionsMap` and removes the action from that array. If the action type or the action itself
     * does not exist in the array, the function logs an error.
     *
     * @param {Action} action - The action object to deregister (remove).
     */
    public deregisterAction(action: Action): void {
        if (!action.type) {
            console.error("Action does not have a type");
            return;
        }

        const arr = this.typeToActionsMap.get(action.type);
        console.log(arr?.length)
        if (!arr) {
            console.error(`Action type ${action.type} does not exist.`);
            return;
        }

        // Find the index of the action and remove it in place if it exists
        const index = arr.indexOf(action);
        if (index !== -1) {
            arr.splice(index, 1); // Removes the action from the array
        }
    }

    /**
     * Retrieves all actions of a specific type.
     *
     * This method takes an `ActionType` and returns an array of actions that correspond to that type.
     * It looks up the `typeToActionsMap` using the provided type and returns the array of actions.
     * If no actions are found for the given type, it returns an empty array.
     *
     * @param {ActionType} type - The type of actions to retrieve.
     * @returns {Action[]} - An array of actions matching the given type, or an empty array if no actions exist for the type.
     */
    public getActionsByType(type: ActionType): Action[] {
        return this.typeToActionsMap.get(type) || [];
    }


    /**
     * Unregisters an action name.
     *
     * This method removes the provided `actionName` from the collection of registered names.
     * If the name is not of type `string`, it logs a warning message to the console.
     *
     * @param {string | unknown} actionName - The name of the action to unregister.
     */
    public unregisterName(actionName: string | unknown): void {
        if(typeof actionName === "string" ){
            this.nameToActionMap.delete(actionName);
            console.log(actionName + " has been unregistered!");
        }
        else {
            console.warn("Invalid name type: unable to unregister", actionName);
        }

    }

    /**
     * Checks if an action name is unique.
     *
     * This method determines whether the provided `actionName` is unique by checking its
     * presence in the collection of registered names. It returns `true` if the name is
     * not found in the collection, indicating that it is unique. Otherwise, it returns `false`.
     *
     * @param {string} actionName - The name of the action to check for uniqueness.
     * @returns {boolean} - Returns `true` if the name is unique (i.e., not found in the collection),
     *                      otherwise returns `false`.
     */
    public isNameUnique(actionName: string): boolean {
        return ! this.nameToActionMap.has(actionName);
    }


    /**
     * Retrieves the names of all registered actions.
     *
     * This method returns an array containing all the keys (names) from the `nameToActionMap`.
     * The `nameToActionMap` is assumed to be a Map object where the keys are action names and
     * the values are the corresponding Action objects.
     *
     * @returns {string[]} - An array of strings, each representing the name of a registered action.
     */
    public getAllActionNames(): string[] {
        return Array.from(this.nameToActionMap.keys());
    }

    /**
     * Determines the category of an action within a specific state.
     *
     * This method inspects the `CsmNodeProps` data, checking if it contains a state.
     * If the `data` represents a state, it identifies the category of the given `action`
     * based on the state's action arrays (`entry`, `exit`, `while`, and `after`).
     *
     * - If the action is found in the state's `entry` array, it is classified as an `ENTRY_ACTION`.
     * - If the action is in the `exit` array, it is classified as an `EXIT_ACTION`.
     * - If the action is in the `while` array, it is classified as a `WHILE_ACTION`.
     * - If the action is in the `after` array, it is categorized as a `TIMEOUT`.
     * - If none of these conditions are met, the function returns `undefined`.
     *
     * @param {Action} action - The action for which to determine the category.
     * @param {CsmNodeProps} data - The node properties, which could contain a state.
     * @returns {ActionCategory | undefined} - The category of the action (`ENTRY_ACTION`, `EXIT_ACTION`, `WHILE_ACTION`, `TIMEOUT`),
     *                                         or `undefined` if the action is not found in the state's actions.
     */
    public getActionCategory(action: Action, data: CsmNodeProps): ActionCategory | undefined{
        if(isState(data)){
            const state = data.state;

            if(state.entry.includes(action)){
                return ActionCategory.ENTRY_ACTION
            }

            if(state.exit.includes(action)){
                return ActionCategory.EXIT_ACTION
            }

            if(state.while.includes(action)){
                return ActionCategory.WHILE_ACTION
            }

            if(state.after.includes(action)){
                return ActionCategory.TIMEOUT
            }

        }

        return undefined
    }



    /**
     * Retrieves an action by its name.
     *
     * This method looks up the provided `name` in the `nameToActionMap` and returns the associated
     * `Action` object if it exists. If no action is found with the given name, it logs an error to the console
     * and returns `undefined`.
     *
     * @param {string} name - The name of the action to retrieve.
     * @returns {Action | undefined} - The `Action` object associated with the given name, or `undefined` if not found.
     */
    public getActionByName(name: string): Action | undefined {
        const res =  this.nameToActionMap.get(name);
        if(!res) {
            console.error(`No action named ${name} found!`);
        }
        return res;
    }


}