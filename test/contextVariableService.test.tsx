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

    test('linkContextToStateByData should link context to a state if data contains a state', () => {
        const state = new State('TestState');
        const contextVariable = new ContextVariable('TestContext', 'TestValue');
        const data: CsmNodeProps = { state };

        contextService.linkContextToStateByData(contextVariable, data);

        const linkedState = contextService.getLinkedState(contextVariable);
        expect(linkedState).toBe(state);
    });

    test('linkContextToStateByData should link context to a state machine if data contains a state machine', () => {
        const stateMachine = new StateMachine('TestStateMachine');
        const contextVariable = new ContextVariable('TestContext', 'TestValue');
        const data: CsmNodeProps = { stateMachine };

        contextService.linkContextToStateByData(contextVariable, data);

        const linkedStateMachine = contextService.getLinkedState(contextVariable);
        expect(linkedStateMachine).toBe(stateMachine);
    });

    test('linkContextToStateByData should log error for invalid data type', () => {
        const contextVariable = new ContextVariable('TestContext', 'TestValue');
        const data: CsmNodeProps = {} as CsmNodeProps;  // Invalid data (not a state or state machine)

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        contextService.linkContextToStateByData(contextVariable, data);

        expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid Data");
        expect(contextService.getLinkedState(contextVariable)).toBeUndefined();

        consoleErrorSpy.mockRestore();
    });

    test('linkContextToStateByData should not link context if data is null', () => {
        const contextVariable = new ContextVariable('TestContext', 'TestValue');
        const data = null as unknown as CsmNodeProps;  // Null data

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        contextService.linkContextToStateByData(contextVariable, data);

        expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid Data");
        expect(contextService.getLinkedState(contextVariable)).toBeUndefined();

        consoleErrorSpy.mockRestore();
    });

    test('linkContextToStateByData should not overwrite an existing linked state unless valid new data is provided', () => {
        const state1 = new State('State1');
        const state2 = new State('State2');
        const contextVariable = new ContextVariable('TestContext', 'TestValue');

        // Link context to the first state
        const data1: CsmNodeProps = { state: state1 };
        contextService.linkContextToStateByData(contextVariable, data1);

        expect(contextService.getLinkedState(contextVariable)).toBe(state1);

        // Try to link context to invalid data (shouldn't change the linked state)
        const invalidData: CsmNodeProps = {} as CsmNodeProps;
        contextService.linkContextToStateByData(contextVariable, invalidData);

        expect(contextService.getLinkedState(contextVariable)).toBe(state1);  // Still linked to state1

        // Now link to a valid new state
        const data2: CsmNodeProps = { state: state2 };
        contextService.linkContextToStateByData(contextVariable, data2);

        expect(contextService.getLinkedState(contextVariable)).toBe(state2);  // Linked to state2 now
    });

});

describe('ContextVariableService - Renaming with contextCreatedByStateMap', () => {
    let contextService: ContextVariableService;
    let context: ContextVariable;
    let state: State;

    beforeEach(() => {
        contextService = new ContextVariableService();
        context = new ContextVariable('InitialContext', 'TestValue');
        state = new State('TestState');
    });

    test('renameContext should update contextCreatedByStateMap when renaming', () => {
        // Register and link the context
        contextService.registerContext(context);
        contextService.setContextCreatedBy(context, state);

        // Rename the context
        contextService.renameContext(context, 'RenamedContext');

        // Check the new name in contextCreatedByStateMap
        const creatingState = contextService.getCreatingState(context);
        expect(creatingState).toBe(state);

        // Ensure the old name no longer exists in contextCreatedByStateMap
        const oldCreatingState = contextService.getCreatingState(new ContextVariable('InitialContext', 'TestValue'));
        expect(oldCreatingState).toBeUndefined();
    });

    test('renameContext should handle contextCreatedByStateMap update when no creating state exists', () => {
        // Register the context but don't set the creating state
        contextService.registerContext(context);

        // Rename the context
        contextService.renameContext(context, 'RenamedContext');

        // Ensure the context is renamed correctly
        expect(context.name).toBe('RenamedContext');

        // Ensure no state is returned for the old or new name
        const creatingState = contextService.getCreatingState(context);
        expect(creatingState).toBeUndefined();
    });

    test('renameContext should not update contextCreatedByStateMap if context does not exist', () => {
        const nonExistentContext = new ContextVariable('NonExistentContext', 'TestValue');
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        contextService.renameContext(nonExistentContext, 'RenamedContext');

        // Ensure error message is shown and no change in contextCreatedByStateMap
        expect(consoleErrorSpy).toHaveBeenCalledWith('Context does not exist!');
        expect(contextService.getCreatingState(nonExistentContext)).toBeUndefined();

        consoleErrorSpy.mockRestore();
    });

    test('renameContext should not update contextCreatedByStateMap if new name already exists', () => {
        const existingContext = new ContextVariable('ExistingContext', 'TestValue');
        contextService.registerContext(existingContext);

        contextService.registerContext(context);
        contextService.setContextCreatedBy(context, state);

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        contextService.renameContext(context, 'ExistingContext');

        // Ensure error message is shown and contextCreatedByStateMap is unchanged
        expect(consoleErrorSpy).toHaveBeenCalledWith('Context with name ExistingContext already exists!');
        expect(contextService.getCreatingState(context)).toBe(state); // Old state should still be linked

        consoleErrorSpy.mockRestore();
    });

    test('renameContext should correctly handle updates in both maps', () => {
        contextService.registerContext(context);
        contextService.setContextCreatedBy(context, state);
        contextService.linkContextToState(context, state);

        contextService.renameContext(context, 'RenamedContext');

        // Ensure both maps are updated
        expect(contextService.getContextByName('RenamedContext')).toBe(context);
        expect(contextService.getCreatingState(context)).toBe(state);
        expect(contextService.getLinkedStateByContextName('RenamedContext')).toBe(state);

        // Ensure old name mappings are gone
        expect(contextService.getContextByName('InitialContext')).toBeUndefined();
        expect(contextService.getLinkedStateByContextName('InitialContext')).toBeUndefined();
        expect(contextService.getCreatingState(new ContextVariable('InitialContext', 'TestValue'))).toBeUndefined();
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

describe('ContextVariableService - deregisterContextByName', () => {
    let contextService: ContextVariableService;
    let context: ContextVariable;
    let state: State;

    beforeEach(() => {
        contextService = new ContextVariableService();
        context = new ContextVariable("testContext", "testValue");
        state = new State("testState");
    });

    test('deregisterContextByName should remove context from _nameToContextMap', () => {
        // Register the context and link it to a state
        contextService.registerContext(context);
        contextService.linkContextToState(context, state);

        // Ensure the context is registered
        expect(contextService.getContextByName("testContext")).toBe(context);

        // Deregister the context
        contextService.deregisterContextByName("testContext");

        // Verify the context is removed from _nameToContextMap
        expect(contextService.getContextByName("testContext")).toBeUndefined();
    });

    test('deregisterContextByName should remove linked state from _contextToSateOrStateMachineMap', () => {
        // Register the context and link it to a state
        contextService.registerContext(context);
        contextService.linkContextToState(context, state);

        // Ensure the context is linked to the state
        expect(contextService.getLinkedState(context)).toBe(state);

        // Deregister the context
        contextService.deregisterContextByName("testContext");

        // Verify the context is removed from _contextToSateOrStateMachineMap
        expect(contextService.getLinkedState(context)).toBeUndefined();
    });

    test('deregisterContextByName should log to console after removal', () => {
        // Mock the console.log function
        console.log = jest.fn();

        // Register the context
        contextService.registerContext(context);

        // Deregister the context
        contextService.deregisterContextByName("testContext");

        // Verify that the correct log message was printed
        expect(console.log).toHaveBeenCalledWith("Context Variable testContext has been deregistered!");
    });

    test('deregisterContextByName should handle non-existent context gracefully', () => {
        // Mock the console.log function
        console.log = jest.fn();

        // Attempt to deregister a non-existent context
        contextService.deregisterContextByName("nonExistentContext");

        // Verify no error is thrown, and no log message is printed (since it doesn't exist)
        expect(console.log).not.toHaveBeenCalled();
    });

    test('deregisterContextByName should not throw an error when no such context exists', () => {
        // Attempt to deregister a context that has not been registered
        expect(() => {
            contextService.deregisterContextByName("nonExistentContext");
        }).not.toThrow();
    });
});

describe('ContextVariableService - Created by State', () => {
    let contextService: ContextVariableService;
    let state: State;
    let stateMachine: StateMachine;
    let contextVariable: ContextVariable;

    beforeEach(() => {
        contextService = new ContextVariableService();
        state = new State("TestState");
        stateMachine = new StateMachine("TestStateMachine");
        contextVariable = new ContextVariable("TestVariable", "TestValue");
    });

    describe('setContextCreatedBy', () => {
        it('should associate the context variable with the given state', () => {
            contextService.setContextCreatedBy(contextVariable, state);

            const associatedState = contextService.getCreatingState(contextVariable);
            expect(associatedState).toBe(state);
        });

        it('should associate the context variable with the given state machine', () => {
            contextService.setContextCreatedBy(contextVariable, stateMachine);

            const associatedStateMachine = contextService.getCreatingState(contextVariable);
            expect(associatedStateMachine).toBe(stateMachine);
        });
    });

    describe('getCreatingState', () => {
        it('should return the state that created the context variable', () => {
            contextService.setContextCreatedBy(contextVariable, state);

            const creatingState = contextService.getCreatingState(contextVariable);
            expect(creatingState).toBe(state);
        });

        it('should return the state machine that created the context variable', () => {
            contextService.setContextCreatedBy(contextVariable, stateMachine);

            const creatingStateMachine = contextService.getCreatingState(contextVariable);
            expect(creatingStateMachine).toBe(stateMachine);
        });

        it('should return undefined if no state or state machine has been associated with the context variable', () => {
            const creatingState = contextService.getCreatingState(contextVariable);
            expect(creatingState).toBeUndefined();
        });
    });
});

describe('ContextVariableService - deregisterContextByName', () => {
    let contextService: ContextVariableService;
    let context: ContextVariable;
    let state: State;

    beforeEach(() => {
        contextService = new ContextVariableService();
        context = new ContextVariable('TestContext', 'TestValue');
        state = new State('TestState');
    });

    test('deregisterContextByName should remove the context from _nameToContextMap', () => {
        contextService.registerContext(context);

        expect(contextService.getContextByName('TestContext')).toBe(context);

        contextService.deregisterContextByName('TestContext');

        expect(contextService.getContextByName('TestContext')).toBeUndefined();
    });

    test('deregisterContextByName should remove links from _contextToSateOrStateMachineMap', () => {
        contextService.registerContext(context);
        contextService.linkContextToState(context, state);

        expect(contextService.getLinkedState(context)).toBe(state);

        contextService.deregisterContextByName('TestContext');

        expect(contextService.getLinkedState(context)).toBeUndefined();
    });

    test('deregisterContextByName should remove links from _contextCreatedByStateMap', () => {
        contextService.registerContext(context);
        contextService.setContextCreatedBy(context, state);

        expect(contextService.getCreatingState(context)).toBe(state);

        contextService.deregisterContextByName('TestContext');

        expect(contextService.getCreatingState(context)).toBeUndefined();
    });

    test('deregisterContextByName should log a message when context is successfully deregistered', () => {
        contextService.registerContext(context);

        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

        contextService.deregisterContextByName('TestContext');

        expect(consoleLogSpy).toHaveBeenCalledWith('Context Variable TestContext has been deregistered!');
        consoleLogSpy.mockRestore();
    });

    test('deregisterContextByName should do nothing if the context name does not exist', () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

        contextService.deregisterContextByName('NonExistentContext');

        expect(consoleLogSpy).not.toHaveBeenCalled();
        consoleLogSpy.mockRestore();
    });

    test('deregisterContextByName should not throw an error if maps are empty', () => {
        expect(() => {
            contextService.deregisterContextByName('TestContext');
        }).not.toThrow();
    });
});


