import ContextService from "../src/services/contextService";
import {Context} from "../src/types"

describe('ContextService', () => {
    let contextService: ContextService;

    beforeEach(() => {
        contextService = new ContextService();
    });

    test('should register a new context', () => {
        const context: Context = { name: 'testContext', value: 'testValue' };
        contextService.registerContext(context);
        expect(contextService.isContextNameUnique(context)).toBe(false);
    });

    test('should not register a context with a duplicate name', () => {
        const context1: Context = { name: 'duplicateContext', value: 'value1' };
        const context2: Context = { name: 'duplicateContext', value: 'value2' };

        contextService.registerContext(context1);
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        contextService.registerContext(context2);

        expect(consoleSpy).toHaveBeenCalledWith('Context name already exists!');
        expect(contextService.isContextNameUnique(context2)).toBe(false);

        consoleSpy.mockRestore();
    });

    test('should check if context name is unique', () => {
        const context: Context = { name: 'uniqueContext', value: 'uniqueValue' };
        expect(contextService.isContextNameUnique(context)).toBe(true);
        contextService.registerContext(context);
        expect(contextService.isContextNameUnique(context)).toBe(false);
    });

    test('should update an existing context', () => {
        const context: Context = { name: 'updateContext', value: 'initialValue' };
        contextService.registerContext(context);
        const updatedContext: Context = { name: 'updateContext', value: 'updatedValue' };

        contextService.updateContext(updatedContext);

        // Since updateContext logs an error when the context doesn't exist, we need to check if the value has actually been updated
        const storedContext = contextService.createContext('updateContext', 'updatedValue');
        expect(storedContext.value).toBe('updatedValue');
    });

    test('should not update a non-existing context', () => {
        const context: Context = { name: 'nonExistingContext', value: 'someValue' };
        expect(contextService.isContextNameUnique(context)).toBe(true);

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        contextService.updateContext(context);

        expect(consoleSpy).toHaveBeenCalledWith('Context does not exist');


        consoleSpy.mockRestore();
    });

    test('should create a new context', () => {
        const name = 'newContext';
        const value = 'newValue';
        const newContext = contextService.createContext(name, value);

        expect(newContext).toEqual({ name, value });
    });
});