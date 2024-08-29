import ContextVariable from "../classes/contextVariable.tsx";

/**
 * ContextService Class
 *
 * This class is responsible for managing contexts using a Map. It provides methods
 * to register, update, and create contexts. Each context is identified by a unique name.
 */
export default class ContextVariableService {
    private _contextMap: Map<string, ContextVariable>;

    public constructor() {
        this._contextMap = new Map();
    }

    /**
     * Registers a new context.
     *
     * This method adds a new context to the _contextMap if the context name is unique.
     * Logs an error if the context name already exists.
     *
     * @param {Context} context - The context to be registered.
     */
    public registerContext(context: ContextVariable): void {
        if(! this.isContextNameUnique(context)){
            console.error("Context name already exists!");
            return;
        }
        this._contextMap.set(context.name, context);
    }

    /**
     * Checks if the context name is unique.
     *
     * This method checks if a context with the same name already exists in the _contextMap.
     *
     * @param {Context} context - The context to check.
     * @returns {boolean} - Returns true if the context name is unique, false otherwise.
     */
    public isContextNameUnique(context: ContextVariable): boolean {
        return ! this._contextMap.has(context.name);
    }

    /**
     * Updates an existing context.
     *
     * This method updates the context in the _contextMap if it already exists.
     * Logs an error if the context does not exist.
     *
     * @param {Context} context - The context to be updated.
     */
    public updateContext(context: ContextVariable): void {
        if(this.isContextNameUnique(context)){
            console.log(context.name);
            console.error(`Context does not exist`);
            return;
        }
        this._contextMap.set(context.name, context);

    }
    /**
     * Creates a new context.
     *
     * This method creates a new context with the specified name and value.
     * The created Context is not registered.
     *
     * @param {string} name - The name of the context.
     * @param {string} value - The value of the context.
     * @returns {Context} - Returns the created context object.
     */
    // TODO: Expression validation could be added here
    public createContext(name: string, value: string): ContextVariable {
        return new ContextVariable(name, value);
    }

    /**
     * Retrieves all context names.
     *
     * This function returns an array of all the unique context names currently stored in the _contextMap.
     *
     * @returns {string[]} An array of context names.
     */
    public getAllContextNames(): string[] {
        return Array.from(this._contextMap.keys());
    }



}