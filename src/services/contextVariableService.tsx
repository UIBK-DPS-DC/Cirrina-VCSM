import ContextVariable from "../classes/contextVariable.tsx";
import {CsmNodeProps, isState, isStateMachine} from "../types.ts";
import {ContextType} from "../enums.ts";
import StateOrStateMachine from "../classes/stateOrStateMachine.ts";
import State from "../classes/state.ts";
import StateMachine from "../classes/stateMachine.ts";


/**
 * ContextService Class
 *
 * This class is responsible for managing contexts using a Map. It provides methods
 * to register, update, and create contexts. Each context is identified by a unique name.
 */
export default class ContextVariableService {
    private _nameToContextMap: Map<string, ContextVariable>;
    private _contextToSateOrStateMachineMap: Map<string,StateOrStateMachine>


    public constructor() {
        this._nameToContextMap = new Map();
        this._contextToSateOrStateMachineMap = new Map();
    }

    /**
     * Registers a new context.
     *
     * This method adds a new context to the _nameToContextMap if the context name is unique.
     * Logs an error if the context name already exists.
     *
     * @param {Context} context - The context to be registered.
     */
    public registerContext(context: ContextVariable): void {
        if(! this.isContextUnique(context)){
            console.error("Context name already exists!");
            return;
        }
        this._nameToContextMap.set(context.name, context);
    }

    /**
     * Links a context variable to a state or state machine.
     *
     * This method associates a `ContextVariable` with a `StateOrStateMachine` by storing the relationship
     * in a map. The context variable's name is used as the key to store the corresponding state.
     * This allows easy lookup of the state linked to a specific context.
     *
     * @param {ContextVariable} context - The context variable to link.
     * @param {StateOrStateMachine} state - The state or state machine to be linked to the context variable.
     */
    public linkContextToState(context: ContextVariable, state: StateOrStateMachine): void {
        this._contextToSateOrStateMachineMap.set(context.name, state);
    }

    /**
     * Links a given context variable to a state or state machine based on the provided data.
     *
     * This function attempts to link the specified `context` to either a `State` or `StateMachine`
     * within the provided `data`. It first checks if the `data` represents a `State` or a `StateMachine`,
     * and then invokes the `linkContextToState` method to establish the link between the context and the state or state machine.
     *
     * If the `data` is neither a `State` nor a `StateMachine`, an error is logged to the console.
     *
     * @param {ContextVariable} context - The context variable to be linked to the state or state machine.
     * @param {CsmNodeProps} data - The data object which contains either a state or a state machine.
     *
     * Example usage:
     *
     * linkContextToStateByData(someContext, nodeData);
     *
     * - If the `data` contains a valid `State`, the context will be linked to it.
     * - If the `data` contains a valid `StateMachine`, the context will be linked to the state machine.
     * - If the `data` is invalid, an error will be logged.
     */
    public linkContextToStateByData(context: ContextVariable, data: CsmNodeProps){
        const stateOrStatemachine = isState(data) ? data.state : isStateMachine(data) ? data.stateMachine : null;
        if(stateOrStatemachine){
            this.linkContextToState(context, stateOrStatemachine);
        }
        else{
            console.error("Invalid Data");
        }

    }

    /**
     * Retrieves the state or state machine linked to a given context variable.
     *
     * This method looks up the state or state machine associated with the provided `ContextVariable`
     * by calling `getLinkedStateByContextName` using the context variable's name as the key.
     *
     * @param {ContextVariable} context - The context variable whose linked state is to be retrieved.
     * @returns {StateOrStateMachine | undefined} - The state or state machine linked to the context variable,
     *                                              or undefined if no such link exists.
     */
    public getLinkedState(context: ContextVariable): StateOrStateMachine | undefined {
        return this.getLinkedStateByContextName(context.name)
    }

    /**
     * Retrieves the state or state machine linked to a context variable by its name.
     *
     * This method retrieves the `StateOrStateMachine` that has been linked to a specific context name.
     * It uses the context name as the key to search the internal map that tracks these relationships.
     *
     * @param {string} contextName - The name of the context variable whose linked state is to be retrieved.
     * @returns {StateOrStateMachine | undefined} - The linked state or state machine, or undefined if none is found.
     */
    public getLinkedStateByContextName(contextName: string): StateOrStateMachine | undefined {
        return this._contextToSateOrStateMachineMap.get(contextName);
    }


    /**
     * Retrieves the type of the given `ContextVariable`.
     *
     * This function determines the type of the provided context variable by checking its association
     * with a `State` or `StateMachine`. It first retrieves the linked state or state machine using
     * the context's name, and based on the context's association with either the persistent, local,
     * or static context arrays, it returns the corresponding `ContextType`.
     *
     * - For a `State`, it checks the `persistentContext`, `localContext`, and defaults to `ContextType.STATIC`.
     * - For a `StateMachine`, it checks only the `persistentContext` and defaults to `ContextType.LOCAL`.
     *
     * @param {ContextVariable} context - The context variable whose type needs to be determined.
     * @returns {ContextType | undefined} - The type of the context variable (`PERSISTENT`, `LOCAL`, `STATIC`), or `undefined` if the context is not linked to any state or state machine.
     */
    public getContextType(context: ContextVariable): ContextType | undefined {
        const linkedStateOrStateMachine = this.getLinkedStateByContextName(context.name);
        if(!linkedStateOrStateMachine) {
            return undefined;
        }

        if(linkedStateOrStateMachine instanceof State){

            if(linkedStateOrStateMachine.persistentContext.includes(context)){
                return ContextType.PERSISTENT;
            }

            if(linkedStateOrStateMachine.localContext.includes(context)){
                return ContextType.LOCAL;
            }

            return ContextType.STATIC;

        }

        if(linkedStateOrStateMachine instanceof StateMachine){

            if(linkedStateOrStateMachine.persistentContext.includes(context)){
                return ContextType.PERSISTENT;
            }

            return ContextType.LOCAL


        }

    }

    /**
     * Retrieves the type of the context variable using its name.
     *
     * This function looks up the `ContextVariable` by its name and then determines its type
     * by calling `getContextType`. If the context is not found, it returns `undefined`.
     *
     * @param {string} contextName - The name of the context variable whose type needs to be determined.
     * @returns {ContextType | undefined} - The type of the context variable (`PERSISTENT`, `LOCAL`, `STATIC`), or `undefined` if the context is not found.
     */
    public getContextTypeByContextName(contextName: string): ContextType | undefined {
        const context = this.getContextByName(contextName);
        if(!context) {
            return undefined;
        }

        return this.getContextType(context);

    }

    /**
     * Renames a context variable and updates all associated mappings.
     *
     * This method renames the provided `ContextVariable` to a new name if the current context exists
     * and the new name is unique. It updates the internal mappings that track context variables and
     * their linked states. If the context has a linked state, the mapping between the old context name
     * and the state is updated to reflect the new context name.
     *
     * Only ever use this function to rename existing Context Variables!
     *
     * @param {ContextVariable} context - The context variable to rename.
     * @param {string} newName - The new name to assign to the context variable.
     */
    public renameContext(context: ContextVariable, newName: string){
        if(!this._nameToContextMap.has(context.name)){
            console.error("Context does not exist!");
            return;
        }
        if(!this.isContextNameUnique(newName)){
            console.error(`Context with name ${newName} already exists!`);
            return
        }

        this._nameToContextMap.delete(context.name);
        this._nameToContextMap.set(newName,context)

        const linkedState = this.getLinkedState(context);
        if(linkedState){
            this._contextToSateOrStateMachineMap.delete(context.name);
            this._contextToSateOrStateMachineMap.set(newName, linkedState);

        }

        context.name = newName;


    }

    /**
     * Deregisters (removes) a context variable by its name.
     *
     * This method removes a context variable from the `_nameToContextMap` and
     * also removes any association it has in the `_contextToSateOrStateMachineMap`.
     * It ensures that both the context variable and its links to any state or state machine
     * are completely removed from the system.
     *
     * Logs a message to the console once the context is successfully deregistered.
     *
     * @param {string} name - The name of the context variable to remove.
     */
    public deregisterContextByName(name: string): void {
        if(this.isContextNameUnique(name)){
            return;
        }
        this._nameToContextMap.delete(name);
        this._contextToSateOrStateMachineMap.delete(name)
        console.log(`Context Variable ${name} has been deregistered!`)
    }

    /**
     * Retrieves a context variable by its name.
     *
     * This method looks up and returns a `ContextVariable` from the `_nameToContextMap`
     * based on the provided name. If a context with the given name is found, it
     * is returned. If not, `undefined` is returned.
     *
     * @param {string} name - The name of the context variable to retrieve.
     * @returns {ContextVariable | undefined} - The `ContextVariable` if found, or `undefined` if not found.
     */
    public getContextByName(name: string): ContextVariable | undefined {
        return this._nameToContextMap.get(name);
    }

    /**
     * Checks if the context name is unique.
     *
     * This method checks if a context with the same name already exists in the _nameToContextMap.
     *
     * @param {Context} context - The context to check.
     * @returns {boolean} - Returns true if the context name is unique, false otherwise.
     */
    public isContextUnique(context: ContextVariable): boolean {
        return ! this._nameToContextMap.has(context.name);
    }

    /**
     * Checks if a context name is unique.
     *
     * This method checks whether a given context name is already registered in the `_nameToContextMap`.
     * It returns `true` if the name is unique (i.e., not found in the map), meaning the context name
     * does not already exist. If the name is already present in the map, it returns `false`,
     * indicating that the context name is not unique.
     *
     * @param {string} name - The name of the context to check for uniqueness.
     * @returns {boolean} - Returns `true` if the context name is unique (not found in the map),
     *                      otherwise returns `false`.
     */
    public isContextNameUnique(name: string): boolean {
        return ! this._nameToContextMap.has(name);
    }



    /**
     * Updates an existing context.
     *
     * This method updates the context in the _nameToContextMap if it already exists.
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
        this._nameToContextMap.set(context.name, context);

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
     * This function returns an array of all the unique context names currently stored in the _nameToContextMap.
     *
     * @returns {string[]} An array of context names.
     */
    public getAllContextNames(): string[] {
        return Array.from(this._nameToContextMap.keys());
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
    public getPersistentContext(data: CsmNodeProps):ContextVariable[] {
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
    public getLocalContext(data: CsmNodeProps):ContextVariable[] {
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
    public getStaticContext(data: CsmNodeProps): ContextVariable[] {
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