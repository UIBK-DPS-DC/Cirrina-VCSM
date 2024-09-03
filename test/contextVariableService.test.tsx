import ContextVariableService from "../src/services/contextVariableService";
import ContextVariable from "../src/classes/contextVariable";
import State from "../src/classes/state";
import StateMachine from "../src/classes/stateMachine";
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
