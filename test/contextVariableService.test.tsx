import ContextVariableService from "../src/services/contextVariableService";
import ContextVariable from "../src/classes/contextVariable";

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

        expect(contextService.isContextNameUnique(context)).toBe(true);

        contextService.registerContext(context);

        expect(contextService.isContextNameUnique(context)).toBe(false);
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
});
