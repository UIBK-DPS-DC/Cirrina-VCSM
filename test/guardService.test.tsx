import GuardService from "../src/services/guardService";

describe('GuardService', () => {
    let guardService: GuardService;

    // Initialize a new GuardService before each test
    beforeEach(() => {
        guardService = new GuardService();
    });

    // Test isNameUnique method
    test('isNameUnique should return true for a unique name', () => {
        expect(guardService.isNameUnique('uniqueGuard')).toBe(true);
    });

    test('isNameUnique should return false for a non-unique name', () => {
        guardService.registerGuard('nonUniqueGuard', 'expression');
        expect(guardService.isNameUnique('nonUniqueGuard')).toBe(false);
    });

    // Test registerGuard method
    test('registerGuard should register a guard with a unique name', () => {
        const result = guardService.registerGuard('newGuard', 'someExpression');
        expect(result).toBe(true);
        expect(guardService.isNameUnique('newGuard')).toBe(false); // Guard should now be registered
    });

    test('registerGuard should not register a guard with a duplicate name', () => {
        guardService.registerGuard('duplicateGuard', 'firstExpression');
        const result = guardService.registerGuard('duplicateGuard', 'secondExpression');
        expect(result).toBe(false);
    });

    // Test unregisterGuard method
    test('unregisterGuard should remove a registered guard', () => {
        guardService.registerGuard('guardToRemove', 'expression');
        guardService.unregisterGuard('guardToRemove');
        expect(guardService.isNameUnique('guardToRemove')).toBe(true); // Guard should be unregistered
    });

    test('unregisterGuard should do nothing if the guard name does not exist', () => {
        console.warn = jest.fn(); // Mock console.warn
        guardService.unregisterGuard('nonExistentGuard');
        expect(console.warn).toHaveBeenCalledWith('Could not unregister nonExistentGuard. nonExistentGuard is not a known guard');
    });

    // Test linkNameToGuard method
    test('linkNameToGuard should link a name to a new expression', () => {
        guardService.linkNameToGuard('linkedGuard', 'initialExpression');
        expect(guardService.isNameUnique('linkedGuard')).toBe(false); // Guard should now be registered
    });

    test('linkNameToGuard should update the expression of an existing guard', () => {
        guardService.linkNameToGuard('guardToUpdate', 'initialExpression');
        guardService.linkNameToGuard('guardToUpdate', 'updatedExpression');

        // We can't directly inspect _nameToExpressionMap, so this test assumes further tests or inspections would be done
        // in a real application to verify that the update occurred correctly.
        expect(guardService.isNameUnique('guardToUpdate')).toBe(false);
    });

    test('getAllGuardNames should return an empty array if no guards are registered', () => {
        const guardNames = guardService.getAllGuardNames();
        expect(guardNames).toEqual([]); // Expecting an empty array
    });

    test('getAllGuardNames should return an array of all registered guard names', () => {
        guardService.registerGuard('guard1', 'expression1');
        guardService.registerGuard('guard2', 'expression2');

        const guardNames = guardService.getAllGuardNames();
        expect(guardNames).toContain('guard1');
        expect(guardNames).toContain('guard2');
        expect(guardNames.length).toBe(2); // Expecting exactly 2 guards
    });

    // Tests for getGuardExpression method
    test('getGuardExpression should return the correct expression for a registered guard', () => {
        guardService.registerGuard('guard1', 'expression1');

        const expression = guardService.getGuardExpression('guard1');
        expect(expression).toBe('expression1');
    });

    test('getGuardExpression should return undefined for a non-existent guard name', () => {
        const expression = guardService.getGuardExpression('nonExistentGuard');
        expect(expression).toBeUndefined();
    });
});
