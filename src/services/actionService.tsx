import Action from "../classes/action.tsx";

export default class ActionService {
    private nameToActionMap: Map<string,Action>;

    public constructor() {
        this.nameToActionMap = new Map();
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
    public getAllActionNames() {
        return Array.from(this.nameToActionMap.keys());
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