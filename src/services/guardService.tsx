 /**
 * Service for managing named guards and their associated expressions.
 *
 * The GuardService class provides methods to register, unregister, and link named guards
 * to specific expressions. It ensures that guard names are unique within the service.
 */
export default class GuardService {
    // A private map that links guard names to their corresponding expressions.
    private _nameToExpressionMap: Map<string, string>;

    /**
     * Constructor initializes the internal map for storing guard names and their expressions.
     */
    public constructor() {
        this._nameToExpressionMap = new Map();
    }

    /**
     * Checks if a guard name is unique.
     *
     * This method determines whether the provided `name` already exists in the `_nameToExpressionMap`.
     * It returns `true` if the name is unique (i.e., not present in the map), and `false` if the name already exists.
     *
     * @param {string} name - The name to check for uniqueness.
     * @returns {boolean} - Returns `true` if the name is unique, otherwise `false`.
     */
    public isNameUnique(name: string): boolean {
        return !this._nameToExpressionMap.has(name);
    }

    /**
     * Registers a guard with a name and associated expression.
     *
     * This method adds a new guard name and its corresponding expression to the `_nameToExpressionMap`.
     * Before adding, it checks if the guard name is unique. If the name already exists,
     * it logs an error and returns `false`. If the name is unique, it registers the guard and returns `true`.
     *
     * @param {string} guardName - The name of the guard to register.
     * @param {string} expression - The expression associated with the guard.
     * @returns {boolean} - Returns `true` if the guard was successfully registered, otherwise `false`.
     */
    public registerGuard(guardName: string, expression: string): boolean {
        if (!this.isNameUnique(guardName)) {
            console.error("Guard name already exists!");
            return false;
        }
        this._nameToExpressionMap.set(guardName, expression);
        console.log(`${guardName} has been registered and linked to ${expression}!`);
        return true;
    }

    /**
     * Unregisters a guard by its name.
     *
     * This method removes the guard name and its associated expression from the `_nameToExpressionMap`.
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
        this._nameToExpressionMap.delete(name);
    }

    /**
     * Links an existing guard name to a new expression or updates an existing link.
     *
     * This method adds or updates the guard name with the provided expression in the `_nameToExpressionMap`.
     * If the guard name already exists, its associated expression is updated with the new value.
     *
     * @param {string} guardName - The name of the guard to link or update.
     * @param {string} expression - The expression to link to the guard name.
     */
    public linkNameToGuard(guardName: string, expression: string): void {
        this._nameToExpressionMap.set(guardName, expression);
    }

     /**
      * Retrieves the names of all registered guards.
      *
      * This method returns an array containing the names of all guards
      * currently stored in the `_nameToExpressionMap`. The names are extracted
      * using the `Object.keys` method, which returns an array of the map's keys.
      *
      * @returns {string[]} - An array of strings, each representing a guard name.
      */
     public getAllGuardNames(): string[] {
         return Array.from(this._nameToExpressionMap.keys());
     }

     /**
      * Retrieves the expression associated with a given guard name.
      *
      * This method looks up the provided `guardName` in the `_nameToExpressionMap`
      * and returns the corresponding expression. If the guard name is not found,
      * it will return `undefined`.
      *
      * @param {string} guardName - The name of the guard whose expression is to be retrieved.
      * @returns {any} - The expression associated with the guard name, or `undefined` if the name is not found.
      */
     public getGuardExpression(guardName: string): any {
         return this._nameToExpressionMap.get(guardName);
     }



}
