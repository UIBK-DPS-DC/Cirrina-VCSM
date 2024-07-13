// This is a service related to managing our States and Statemachines
// All functions related to this objective should live here

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







}

