import Guard from "../classes/guard.tsx";

/**
 * Service for managing named guards and their associated expressions.
 *
 * The GuardService class provides methods to register, unregister, and link named guards
 * to specific expressions. It ensures that guard names are unique within the service.
 */
export default class GuardService {
    // A private map that links guard names to their corresponding expressions.
    private nameToGuardMap: Map<string, Guard>;

    /**
     * Constructor initializes the internal map for storing guard names and their expressions.
     */
    public constructor() {
        this.nameToGuardMap = new Map();
    }


    /**
     * Checks if a guard name is unique.
     *
     * This method determines whether the provided `name` already exists in the `nameToGuardMap`.
     * It returns `true` if the name is unique (i.e., not present in the map), and `false` if the name already exists.
     *
     * @param {string} name - The name to check for uniqueness.
     * @returns {boolean} - Returns `true` if the name is unique, otherwise `false`.
     */
    public isNameUnique(name: string): boolean {
        return !this.nameToGuardMap.has(name);
    }

    /**
     * Registers a guard with a name and associated expression.
     *
     * This method adds a new guard name and its corresponding expression to the `nameToGuardMap`.
     * Before adding, it checks if the guard name is unique. If the name already exists,
     * it logs an error and returns `false`. If the name is unique, it registers the guard and returns `true`.
     *
     * @param {string} guardName - The name of the guard to register.
     * @param {string} expression - The expression associated with the guard.
     * @returns {boolean} - Returns `true` if the guard was successfully registered, otherwise `false`.
     */
    public registerGuard(guard: Guard): boolean {
        if (!this.isNameUnique(guard.name)) {
            console.error("Guard name already exists!");
            return false;
        }
        this.linkGuard(guard);
        console.log(`${guard.name} has been registered and linked to ${guard.expression}!`);
        return true;
    }

    /**
     * Unregisters a guard by its name.
     *
     * This method removes the guard name and its associated expression from the `nameToGuardMap`.
     * Before attempting to unregister, it checks if the guard name exists. If the name is not found,
     * it logs a warning and does nothing.
     *
     * @param {string} name - The name of the guard to unregister.
     */
    public unregisterGuard(name: string): void {
        if (this.isNameUnique(name)) {
            console.warn(`Could not unregister ${name}. ${name} is not a known guard`);
            return;
        }
        this.nameToGuardMap.delete(name);
    }


    public linkGuard(guard: Guard): void {
        if(! guard.name){
            return;
        }
        this.nameToGuardMap.set(guard.name, guard);
    }

    /**
     * Retrieves the names of all registered guards.
     *
     * This method returns an array containing the names of all guards
     * currently stored in the `nameToGuardMap`. The names are extracted
     * using the `Object.keys` method, which returns an array of the map's keys.
     *
     * @returns {string[]} - An array of strings, each representing a guard name.
     */
    public getAllGuardNames(): string[] {
        return Array.from(this.nameToGuardMap.keys());
    }

    /**
     * Retrieves the expression associated with a given guard name.
     *
     * This method looks up the provided `guardName` in the `nameToGuardMap`
     * and returns the corresponding expression. If the guard name is not found,
     * it will return `undefined`.
     *
     * @param {string} guardName - The name of the guard whose expression is to be retrieved.
     * @returns The expression associated with the guard name, or `undefined` if the name is not found.
     */
    public getGuardExpression(guardName: string) {
        return this.nameToGuardMap.get(guardName)?.expression;
    }

    public getGuardByName(name: string): Guard | undefined {
        return this.nameToGuardMap.get(name);
    }


    public resetService():void {
        this.nameToGuardMap = new Map();
    }





}
