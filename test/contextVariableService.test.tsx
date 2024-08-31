import ContextVariableService from "../src/services/contextVariableService";
import ContextVariable from "../src/classes/contextVariable";
import State from "../src/classes/state";
import StateMachine from "../src/classes/stateMachine";
import { ContextType } from "../src/enums";
import { CsmNodeProps } from "../src/types";

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

    // New tests for addContext and removeContext
    test('addContext should add a context variable to a state\'s persistent context', () => {
        const state = new State('TestState');
        const contextVariable = new ContextVariable('TestVariable', 'TestValue');
        const data: CsmNodeProps = { state };

        contextService.addContext(contextVariable, data, ContextType.PERSISTENT);

        expect(state.persistentContext).toContain(contextVariable);
    });

    test('addContext should add a context variable to a state\'s local context', () => {
        const state = new State('TestState');
        const contextVariable = new ContextVariable('TestVariable', 'TestValue');
        const data: CsmNodeProps = { state };

        contextService.addContext(contextVariable, data, ContextType.LOCAL);

        expect(state.localContext).toContain(contextVariable);
    });

    test('addContext should add a context variable to a state\'s static context', () => {
        const state = new State('TestState');
        const contextVariable = new ContextVariable('TestVariable', 'TestValue');
        const data: CsmNodeProps = { state };

        contextService.addContext(contextVariable, data, ContextType.STATIC);

        expect(state.staticContext).toContain(contextVariable);
    });

    test('addContext should add a context variable to a state machine\'s persistent context', () => {
        const stateMachine = new StateMachine('TestStateMachine');
        const contextVariable = new ContextVariable('TestVariable', 'TestValue');
        const data: CsmNodeProps = { stateMachine };

        contextService.addContext(contextVariable, data, ContextType.PERSISTENT);

        expect(stateMachine.persistentContext).toContain(contextVariable);
    });

    test('addContext should add a context variable to a state machine\'s local context', () => {
        const stateMachine = new StateMachine('TestStateMachine');
        const contextVariable = new ContextVariable('TestVariable', 'TestValue');
        const data: CsmNodeProps = { stateMachine };

        contextService.addContext(contextVariable, data, ContextType.LOCAL);

        expect(stateMachine.localContext).toContain(contextVariable);
    });

    test('removeContext should remove a context variable from a state\'s persistent context', () => {
        const state = new State('TestState');
        const contextVariable = new ContextVariable('TestVariable', 'TestValue');
        state.persistentContext.push(contextVariable);
        const data: CsmNodeProps = { state };

        contextService.removeContext(contextVariable, data);

        expect(state.persistentContext).not.toContain(contextVariable);
    });

    test('removeContext should remove a context variable from a state\'s local context', () => {
        const state = new State('TestState');
        const contextVariable = new ContextVariable('TestVariable', 'TestValue');
        state.localContext.push(contextVariable);
        const data: CsmNodeProps = { state };

        contextService.removeContext(contextVariable, data);

        expect(state.localContext).not.toContain(contextVariable);
    });

    test('removeContext should remove a context variable from a state\'s static context', () => {
        const state = new State('TestState');
        const contextVariable = new ContextVariable('TestVariable', 'TestValue');
        state.staticContext.push(contextVariable);
        const data: CsmNodeProps = { state };

        contextService.removeContext(contextVariable, data);

        expect(state.staticContext).not.toContain(contextVariable);
    });

    test('removeContext should remove a context variable from a state machine\'s persistent context', () => {
        const stateMachine = new StateMachine('TestStateMachine');
        const contextVariable = new ContextVariable('TestVariable', 'TestValue');
        stateMachine.persistentContext.push(contextVariable);
        const data: CsmNodeProps = { stateMachine };

        contextService.removeContext(contextVariable, data);

        expect(stateMachine.persistentContext).not.toContain(contextVariable);
    });

    test('removeContext should remove a context variable from a state machine\'s local context', () => {
        const stateMachine = new StateMachine('TestStateMachine');
        const contextVariable = new ContextVariable('TestVariable', 'TestValue');
        stateMachine.localContext.push(contextVariable);
        const data: CsmNodeProps = { stateMachine };

        contextService.removeContext(contextVariable, data);

        expect(stateMachine.localContext).not.toContain(contextVariable);
    });

    test('addContext should log an error for an unknown context type', () => {
        const state = new State('TestState');
        const contextVariable = new ContextVariable('TestVariable', 'TestValue');
        const data: CsmNodeProps = { state };
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        contextService.addContext(contextVariable, data, "UNKNOWN_TYPE" as ContextType);

        expect(consoleErrorSpy).toHaveBeenCalledWith("Unknown Context type. UNKNOWN_TYPE does not exist on State class");

        consoleErrorSpy.mockRestore();
    });

    test('removeContext should log an error for an unknown data type', () => {
        const contextVariable = new ContextVariable('TestVariable', 'TestValue');
        const data: CsmNodeProps = {} as CsmNodeProps;
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        contextService.removeContext(contextVariable, data);

        expect(consoleErrorSpy).toHaveBeenCalledWith("Unknown data type");

        consoleErrorSpy.mockRestore();
    });
});
