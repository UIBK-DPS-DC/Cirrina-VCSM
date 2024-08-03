import {Context} from "../types.ts";

/**
 * ContextService Class
 *
 * This class is responsible for managing contexts using a Map. It provides methods
 * to register, update, and create contexts. Each context is identified by a unique name.
 */
export default class ContextService {
    private _contextMap: Map<string, Context>;

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
    public registerContext(context: Context): void {
        if(this.isContextNameUnique(context)){
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
    public isContextNameUnique(context: Context): boolean {
        return this._contextMap.has(context.name);
    }

    /**
     * Updates an existing context.
     *
     * This method updates the context in the _contextMap if it already exists.
     * Logs an error if the context does not exist.
     *
     * @param {Context} context - The context to be updated.
     */
    public updateContext(context: Context): void {
        if(this.isContextNameUnique(context)){
            console.error("Context does not exist");
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
    public createContext(name: string, value: string): Context {
        return {
            name: name,
            value: value
        }
    }



}