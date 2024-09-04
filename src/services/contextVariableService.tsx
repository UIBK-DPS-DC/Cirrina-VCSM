import ContextVariable from "../classes/contextVariable.tsx";
import {CsmNodeProps, isState, isStateMachine} from "../types.ts";
import {ContextType} from "../enums.ts";


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
        if(! this.isContextUnique(context)){
            console.error("Context name already exists!");
            return;
        }
        this._contextMap.set(context.name, context);
    }

    public deregisterContextByName(name: string): void {
        this._contextMap.delete(name);
    }

    public getContextByName(name: string): ContextVariable | undefined {
        return this._contextMap.get(name);
    }

    /**
     * Checks if the context name is unique.
     *
     * This method checks if a context with the same name already exists in the _contextMap.
     *
     * @param {Context} context - The context to check.
     * @returns {boolean} - Returns true if the context name is unique, false otherwise.
     */
    public isContextUnique(context: ContextVariable): boolean {
        return ! this._contextMap.has(context.name);
    }

    /**
     * Checks if a context name is unique.
     *
     * This method checks whether a given context name is already registered in the `_contextMap`.
     * It returns `true` if the name is unique (i.e., not found in the map), meaning the context name
     * does not already exist. If the name is already present in the map, it returns `false`,
     * indicating that the context name is not unique.
     *
     * @param {string} name - The name of the context to check for uniqueness.
     * @returns {boolean} - Returns `true` if the context name is unique (not found in the map),
     *                      otherwise returns `false`.
     */
    public isContextNameUnique(name: string): boolean {
        return ! this._contextMap.has(name);
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
        if(this.isContextUnique(context)){
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

    /**
     * Removes a context variable from a given state or state machine.
     *
     * This function attempts to remove a `ContextVariable` from the provided `data`,
     * which could represent either a state or a state machine. It first checks the type
     * of the `data` to determine whether it's a state or a state machine and calls the
     * appropriate `removeContext` method on that object. If the type of `data` is not
     * recognized as either a state or a state machine, it logs an error to the console.
     *
     * @param {ContextVariable} context - The context variable to be removed.
     * @param {CsmNodeProps} data - The data object, which can represent a state or a state machine.
     */
    public removeContext(context: ContextVariable, data: CsmNodeProps): void {
        if(isState(data)){
            data.state.removeContext(context)
            return
        }
        if(isStateMachine(data)){
            data.stateMachine.removeContext(context)
            return
        }
        console.error("Unknown data type")
        return
    }

    public addContext(context: ContextVariable, data: CsmNodeProps, type: ContextType): void {
        if(isState(data)){
            switch (type) {
                case ContextType.PERSISTENT: {
                    data.state.persistentContext.push(context)
                    break
                }
                case ContextType.LOCAL: {
                    data.state.localContext.push(context)
                    break;
                }
                case ContextType.STATIC: {
                    data.state.staticContext.push(context)
                    break;
                }
                default: {
                    console.error(`Unknown Context type. ${type} does not exist on State class`)
                    return
                }
            }
            return;
        }
        if(isStateMachine(data)) {
            switch (type) {
                case ContextType.PERSISTENT: {
                    data.stateMachine.persistentContext.push(context)
                    break;
                }
                case ContextType.LOCAL: {
                    data.stateMachine.localContext.push(context)
                    break;
                }
                default: {
                    console.error(`Unknown Context type. ${type} does not exist on StateMachine class`)
                    return;
                }
            }
            return;
        }

        console.error("Unknown data type")
        return;
    }

    /**
     * Retrieves the persistent context variables from the provided data.
     *
     * This method checks whether the provided `data` represents a state or a state machine.
     * If it's a state, the method returns the `persistentContext` array from the state.
     * If it's a state machine, the method returns the `persistentContext` array from the state machine.
     * If the data type is unrecognized, an error is logged and an empty array is returned.
     *
     * @param {CsmNodeProps} data - The data object, which can represent either a state or a state machine.
     * @returns {ContextVariable[]} An array of persistent context variables, or an empty array if the data type is unknown.
     */
    public getPersistentContext(data: CsmNodeProps) {
        if(isState(data)){
            return data.state.persistentContext;
        }

        if(isStateMachine(data)){
            return data.stateMachine.persistentContext
        }

        console.error("Unknown data type")
        return []
    }

    /**
     * Retrieves the local context variables from the provided data.
     *
     * This method checks whether the provided `data` represents a state or a state machine.
     * If it's a state, the method returns the `localContext` array from the state.
     * If it's a state machine, the method returns the `localContext` array from the state machine.
     * If the data type is unrecognized, an error is logged and an empty array is returned.
     *
     * @param {CsmNodeProps} data - The data object, which can represent either a state or a state machine.
     * @returns {ContextVariable[]} An array of local context variables, or an empty array if the data type is unknown.
     */
    public getLocalContext(data: CsmNodeProps) {
        if(isState(data)){
            return data.state.localContext;
        }

        if(isStateMachine(data)){
            return data.stateMachine.localContext
        }

        console.error("Unknown data type")
        return [];


    }

    /**
     * Retrieves the static context variables from the provided data.
     *
     * This method checks whether the provided `data` represents a state.
     * If it's a state, the method returns the `staticContext` array from the state.
     * If the data represents a state machine, an error is logged indicating that a state machine cannot have static context, and an empty array is returned.
     * If the data type is unrecognized, an error is logged and an empty array is returned.
     *
     * @param {CsmNodeProps} data - The data object, which can represent either a state or a state machine.
     * @returns {ContextVariable[]} An array of static context variables, or an empty array if the data type is unknown or invalid for static context.
     */
    public getStaticContext(data: CsmNodeProps) {
        if(isState(data)){
            return data.state.staticContext;
        }
        if(isStateMachine(data)){
            return []
        }
        console.error("Unknown data type")
        return [];
    }



}