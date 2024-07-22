import ActionService from "../src/services/actionService";

let service: ActionService;

beforeEach(() => {
    // Reset the service before each test
    service = new ActionService();
});

describe('ActionService', () => {

    test('registerName should register a unique action name', () => {
        const name = 'uniqueAction';
        const result = service.registerName(name);
        expect(result).toBe(true);
        expect(service.isNameUnique(name)).toBe(false); // Now the name is not unique
    });

    test('registerName should not register a duplicate action name', () => {
        const name = 'duplicateAction';
        service.registerName(name);
        const result = service.registerName(name);
        expect(result).toBe(false);
    });

    test('unregisterName should remove a registered action name', () => {
        const name = 'actionToRemove';
        service.registerName(name);
        service.unregisterName(name);
        expect(service.isNameUnique(name)).toBe(true); // Now the name is unique
    });

    test('unregisterName should do nothing if the action name is not registered', () => {
        const name = 'nonExistentAction';
        service.unregisterName(name); // Should do nothing
        expect(service.isNameUnique(name)).toBe(true); // Still unique
    });

    test('unregisterName should log a warning for invalid name type', () => {
        console.warn = jest.fn(); // Mock console.warn
        service.unregisterName(123); // Invalid name type
        expect(console.warn).toHaveBeenCalledWith("Invalid name type: unable to unregister", 123);
    });

    test('isNameUnique should return true for a unique action name', () => {
        const name = 'uniqueAction';
        const result = service.isNameUnique(name);
        expect(result).toBe(true);
    });

    test('isNameUnique should return false for a non-unique action name', () => {
        const name = 'nonUniqueAction';
        service.registerName(name);
        const result = service.isNameUnique(name);
        expect(result).toBe(false);
    });
});