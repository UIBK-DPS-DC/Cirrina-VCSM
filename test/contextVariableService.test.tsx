import ContextVariableService from "../src/services/contextVariableService";
import ContextVariable from "../src/classes/contextVariable";
import State from "../src/classes/state";
import StateMachine from "../src/classes/stateMachine";
import { CsmNodeProps } from "../src/types";
import {ContextType} from "../src/enums";

describe('ContextService', () => {
    let contextService: ContextVariableService;

    beforeEach(() => {
        contextService = new ContextVariableService();
    });

    test('registerContext should add a context if the name is unique', () => {
        const context = new ContextVariable("uniqueContext", "value1");
        contextService.registerContext(context);

        const allContextNames = contextService.getAllContextNames();
        expect(allContextNames).toContain("uniqueContext");
    });

    test('registerContext should not add a context if the name already exists', () => {
        const context1 = new ContextVariable("duplicateContext", "value1");
        const context2 = new ContextVariable("duplicateContext", "value2");

        console.error = jest.fn();  // Mock console.error to verify it gets called

        contextService.registerContext(context1);
        contextService.registerContext(context2);

        const allContextNames = contextService.getAllContextNames();
        expect(allContextNames.length).toBe(1);  // Only one context should be registered
        expect(allContextNames).toContain("duplicateContext");
        expect(console.error).toHaveBeenCalledWith("Context name already exists!");
    });

    test('isContextNameUnique should return true for a unique context name', () => {
        const context = new ContextVariable("uniqueContext", "value1");

        expect(contextService.isContextUnique(context)).toBe(true);

        contextService.registerContext(context);

        expect(contextService.isContextUnique(context)).toBe(false);
    });

    test('updateContext should update an existing context', () => {
        const context = new ContextVariable("existingContext", "oldValue");
        contextService.registerContext(context);

        const updatedContext = new ContextVariable("existingContext", "newValue");
        contextService.updateContext(updatedContext);

        const allContextNames = contextService.getAllContextNames();
        expect(allContextNames).toContain("existingContext");

        const retrievedContext = contextService.createContext("existingContext", "newValue");
        expect(retrievedContext.value).toBe("newValue");
    });

    test('updateContext should not update a non-existent context', () => {
        const context = new ContextVariable("nonExistentContext", "value");

        console.error = jest.fn();  // Mock console.error to verify it gets called

        contextService.updateContext(context);

        expect(console.error).toHaveBeenCalledWith("Context does not exist");
    });

    test('createContext should create a new context', () => {
        const context = contextService.createContext("newContext", "newValue");

        expect(context.name).toBe("newContext");
        expect(context.value).toBe("newValue");
    });

    test('getAllContextNames should return an array of all context names', () => {
        const context1 = new ContextVariable("context1", "value1");
        const context2 = new ContextVariable("context2", "value2");

        contextService.registerContext(context1);
        contextService.registerContext(context2);

        const allContextNames = contextService.getAllContextNames();
        expect(allContextNames).toEqual(expect.arrayContaining(["context1", "context2"]));
    });

    // Tests for getPersistentContext, getLocalContext, and getStaticContext

    test('getPersistentContext should return the persistent context for a state', () => {
        const state = new State('TestState');
        const contextVariable = new ContextVariable('TestVariable', 'TestValue');
        state.persistentContext.push(contextVariable);
        const data: CsmNodeProps = { state };

        const persistentContext = contextService.getPersistentContext(data);

        expect(persistentContext).toContain(contextVariable);
    });

    test('getPersistentContext should return the persistent context for a state machine', () => {
        const stateMachine = new StateMachine('TestStateMachine');
        const contextVariable = new ContextVariable('TestVariable', 'TestValue');
        stateMachine.persistentContext.push(contextVariable);
        const data: CsmNodeProps = { stateMachine };

        const persistentContext = contextService.getPersistentContext(data);

        expect(persistentContext).toContain(contextVariable);
    });

    test('getLocalContext should return the local context for a state', () => {
        const state = new State('TestState');
        const contextVariable = new ContextVariable('TestVariable', 'TestValue');
        state.localContext.push(contextVariable);
        const data: CsmNodeProps = { state };

        const localContext = contextService.getLocalContext(data);

        expect(localContext).toContain(contextVariable);
    });

    test('getLocalContext should return the local context for a state machine', () => {
        const stateMachine = new StateMachine('TestStateMachine');
        const contextVariable = new ContextVariable('TestVariable', 'TestValue');
        stateMachine.localContext.push(contextVariable);
        const data: CsmNodeProps = { stateMachine };

        const localContext = contextService.getLocalContext(data);

        expect(localContext).toContain(contextVariable);
    });

    test('getStaticContext should return the static context for a state', () => {
        const state = new State('TestState');
        const contextVariable = new ContextVariable('TestVariable', 'TestValue');
        state.staticContext.push(contextVariable);
        const data: CsmNodeProps = { state };

        const staticContext = contextService.getStaticContext(data);

        expect(staticContext).toContain(contextVariable);
    });

    test('getStaticContext should return an empty array if called on a  state machine', () => {
        const stateMachine = new StateMachine('TestStateMachine');
        const data: CsmNodeProps = { stateMachine };
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        const staticContext = contextService.getStaticContext(data);

        expect(staticContext).toEqual([]);

        consoleErrorSpy.mockRestore();
    });

    test('getPersistentContext should log an error for an unknown data type', () => {
        const data: CsmNodeProps = {} as CsmNodeProps;
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        const persistentContext = contextService.getPersistentContext(data);

        expect(persistentContext).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalledWith("Unknown data type");

        consoleErrorSpy.mockRestore();
    });

    test('getLocalContext should log an error for an unknown data type', () => {
        const data: CsmNodeProps = {} as CsmNodeProps;
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        const localContext = contextService.getLocalContext(data);

        expect(localContext).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalledWith("Unknown data type");

        consoleErrorSpy.mockRestore();
    });

    test('getStaticContext should log an error for an unknown data type', () => {
        const data: CsmNodeProps = {} as CsmNodeProps;
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        const staticContext = contextService.getStaticContext(data);

        expect(staticContext).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalledWith("Unknown data type");

        consoleErrorSpy.mockRestore();
    });
});


describe('ContextVariableService - Linking and Renaming Contexts', () => {
    let contextService: ContextVariableService;

    beforeEach(() => {
        contextService = new ContextVariableService();
    });

    test('linkContextToState should link a context to a state', () => {
        const context = new ContextVariable('TestContext', 'value1');
        const state = new State('TestState');

        contextService.linkContextToState(context, state);

        const linkedState = contextService.getLinkedState(context);
        expect(linkedState).toBe(state);
    });

    test('getLinkedState should return undefined if the context is not linked', () => {
        const context = new ContextVariable('TestContext', 'value1');

        const linkedState = contextService.getLinkedState(context);
        expect(linkedState).toBeUndefined();
    });

    test('getLinkedStateByContextName should return the correct state for a given context name', () => {
        const context = new ContextVariable('TestContext', 'value1');
        const state = new State('TestState');

        contextService.linkContextToState(context, state);

        const linkedState = contextService.getLinkedStateByContextName('TestContext');
        expect(linkedState).toBe(state);
    });

    test('getLinkedStateByContextName should return undefined for a non-existent context name', () => {
        const linkedState = contextService.getLinkedStateByContextName('NonExistentContext');
        expect(linkedState).toBeUndefined();
    });

    test('renameContext should rename a context and update all mappings', () => {
        const context = new ContextVariable('OldName', 'value1');
        const state = new State('TestState');

        contextService.registerContext(context);
        contextService.linkContextToState(context, state);

        contextService.renameContext(context, 'NewName');

        // Check the context was renamed in the name-to-context map
        const updatedContext = contextService.getContextByName('NewName');
        expect(updatedContext).toBe(context);

        // Ensure the old name is no longer in the map
        const oldContext = contextService.getContextByName('OldName');
        expect(oldContext).toBeUndefined();

        // Check the linked state has been updated
        const linkedState = contextService.getLinkedStateByContextName('NewName');
        expect(linkedState).toBe(state);

        // Ensure the old link is gone
        const oldLinkedState = contextService.getLinkedStateByContextName('OldName');
        expect(oldLinkedState).toBeUndefined();

        // Verify the context itself was updated
        expect(context.name).toBe('NewName');
    });

    test('renameContext should not rename a context if the original context does not exist', () => {
        const context = new ContextVariable('NonExistentContext', 'value1');
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        contextService.renameContext(context, 'NewName');

        expect(consoleErrorSpy).toHaveBeenCalledWith('Context does not exist!');
        consoleErrorSpy.mockRestore();
    });

    test('renameContext should not rename if the new name already exists', () => {
        const context1 = new ContextVariable('ExistingContext', 'value1');
        const context2 = new ContextVariable('AnotherContext', 'value2');

        contextService.registerContext(context1);
        contextService.registerContext(context2);

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        contextService.renameContext(context2, 'ExistingContext');

        expect(consoleErrorSpy).toHaveBeenCalledWith('Context with name ExistingContext already exists!');
        consoleErrorSpy.mockRestore();

        // Ensure the original name remains unchanged
        expect(context2.name).toBe('AnotherContext');
    });

    test('renameContext should update linked state when renaming a context', () => {
        const context = new ContextVariable('ContextToRename', 'value1');
        const stateMachine = new StateMachine('TestStateMachine');

        contextService.registerContext(context);
        contextService.linkContextToState(context, stateMachine);

        contextService.renameContext(context, 'RenamedContext');

        // Ensure the new name links to the same state machine
        const linkedStateMachine = contextService.getLinkedStateByContextName('RenamedContext');
        expect(linkedStateMachine).toBe(stateMachine);

        // Ensure the old name does not link to any state
        const oldLinkedStateMachine = contextService.getLinkedStateByContextName('ContextToRename');
        expect(oldLinkedStateMachine).toBeUndefined();
    });

    test('linkContextToState should update the linked state for the same context', () => {
        const context = new ContextVariable('TestContext', 'value1');
        const state1 = new State('TestState1');
        const state2 = new State('TestState2');

        // Link to state1 first
        contextService.linkContextToState(context, state1);
        let linkedState = contextService.getLinkedState(context);
        expect(linkedState).toBe(state1);

        // Link to state2, overwriting the first link
        contextService.linkContextToState(context, state2);
        linkedState = contextService.getLinkedState(context);
        expect(linkedState).toBe(state2);
    });

    test('renameContext should retain link to state even after renaming the context', () => {
        const context = new ContextVariable('ContextToRename', 'value1');
        const state = new State('TestState');

        contextService.registerContext(context);
        contextService.linkContextToState(context, state);

        contextService.renameContext(context, 'RenamedContext');

        // Verify the link to the state still exists after renaming
        const linkedState = contextService.getLinkedStateByContextName('RenamedContext');
        expect(linkedState).toBe(state);
    });

    test('renameContext should update both maps and context variable when context is renamed', () => {
        const context = new ContextVariable('InitialContext', 'value1');
        const state = new State('LinkedState');

        contextService.registerContext(context);
        contextService.linkContextToState(context, state);

        contextService.renameContext(context, 'UpdatedContext');

        expect(contextService.getContextByName('UpdatedContext')).toBe(context);
        expect(contextService.getLinkedStateByContextName('UpdatedContext')).toBe(state);
        expect(context.name).toBe('UpdatedContext');
    });

});

describe('ContextService - getContextType and getContextTypeByContextName', () => {
    let contextService: ContextVariableService;

    beforeEach(() => {
        contextService = new ContextVariableService();
    });

    // Test for getContextType function
    test('getContextType should return PERSISTENT for context linked to persistentContext in a State', () => {
        const state = new State('TestState');
        const contextVariable = new ContextVariable('PersistentVariable', 'value1');
        state.persistentContext.push(contextVariable);

        contextService.linkContextToState(contextVariable, state);

        const contextType = contextService.getContextType(contextVariable);
        expect(contextType).toBe(ContextType.PERSISTENT);
    });

    test('getContextType should return LOCAL for context linked to localContext in a State', () => {
        const state = new State('TestState');
        const contextVariable = new ContextVariable('LocalVariable', 'value2');
        state.localContext.push(contextVariable);

        contextService.linkContextToState(contextVariable, state);

        const contextType = contextService.getContextType(contextVariable);
        expect(contextType).toBe(ContextType.LOCAL);
    });

    test('getContextType should return STATIC for context not linked to persistent or local in a State', () => {
        const state = new State('TestState');
        const contextVariable = new ContextVariable('StaticVariable', 'value3');
        state.staticContext.push(contextVariable); // For clarity, but not checked directly

        contextService.linkContextToState(contextVariable, state);

        const contextType = contextService.getContextType(contextVariable);
        expect(contextType).toBe(ContextType.STATIC);
    });

    test('getContextType should return PERSISTENT for context linked to persistentContext in a StateMachine', () => {
        const stateMachine = new StateMachine('TestStateMachine');
        const contextVariable = new ContextVariable('PersistentVariableInSM', 'value4');
        stateMachine.persistentContext.push(contextVariable);

        contextService.linkContextToState(contextVariable, stateMachine);

        const contextType = contextService.getContextType(contextVariable);
        expect(contextType).toBe(ContextType.PERSISTENT);
    });

    test('getContextType should return LOCAL for context linked to localContext in a StateMachine', () => {
        const stateMachine = new StateMachine('TestStateMachine');
        const contextVariable = new ContextVariable('LocalVariableInSM', 'value5');
        stateMachine.localContext.push(contextVariable);

        contextService.linkContextToState(contextVariable, stateMachine);

        const contextType = contextService.getContextType(contextVariable);
        expect(contextType).toBe(ContextType.LOCAL);
    });

    test('getContextType should return undefined if the context is not linked to any State or StateMachine', () => {
        const contextVariable = new ContextVariable('OrphanVariable', 'value6');

        const contextType = contextService.getContextType(contextVariable);
        expect(contextType).toBeUndefined();
    });

    // Tests for getContextTypeByContextName function
    test('getContextTypeByContextName should return PERSISTENT for context name linked to persistentContext in a State', () => {
        const state = new State('TestState');
        const contextVariable = new ContextVariable('PersistentContextName', 'value7');
        state.persistentContext.push(contextVariable);

        contextService.registerContext(contextVariable);
        contextService.linkContextToState(contextVariable, state);

        const contextType = contextService.getContextTypeByContextName('PersistentContextName');
        expect(contextType).toBe(ContextType.PERSISTENT);
    });

    test('getContextTypeByContextName should return LOCAL for context name linked to localContext in a StateMachine', () => {
        const stateMachine = new StateMachine('TestStateMachine');
        const contextVariable = new ContextVariable('LocalContextName', 'value8');
        stateMachine.localContext.push(contextVariable);

        contextService.registerContext(contextVariable);
        contextService.linkContextToState(contextVariable, stateMachine);

        const contextType = contextService.getContextTypeByContextName('LocalContextName');
        expect(contextType).toBe(ContextType.LOCAL);
    });

    test('getContextTypeByContextName should return undefined if the context does not exist', () => {
        const contextType = contextService.getContextTypeByContextName('NonExistentContext');
        expect(contextType).toBeUndefined();
    });

    test('getContextTypeByContextName should return undefined if the context exists but is not linked to any state or state machine', () => {
        const contextVariable = new ContextVariable('UnlinkedContext', 'value9');

        contextService.registerContext(contextVariable);

        const contextType = contextService.getContextTypeByContextName('UnlinkedContext');
        expect(contextType).toBeUndefined();
    });
});

