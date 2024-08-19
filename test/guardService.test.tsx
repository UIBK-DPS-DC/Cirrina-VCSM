import GuardService from "../src/services/guardService";
import Guard from "../src/classes/guard";

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
        const newGuard = new Guard('expression', 'nonUniqueGuard')
        guardService.registerGuard(newGuard);
        expect(guardService.isNameUnique('nonUniqueGuard')).toBe(false);
    });

    // Test registerGuard method
    test('registerGuard should register a guard with a unique name', () => {
        const newGuard = new Guard('someExpression', 'newGuard');
        const result = guardService.registerGuard(newGuard);
        expect(result).toBe(true);
        expect(guardService.isNameUnique('newGuard')).toBe(false); // Guard should now be registered
    });

    test('registerGuard should not register a guard with a duplicate name', () => {
        const newGuard = new Guard('firstExpression', 'duplicateGuard')
        guardService.registerGuard(newGuard);
        const result = guardService.registerGuard(newGuard);
        expect(result).toBe(false);
    });

    // Test unregisterGuard method
    test('unregisterGuard should remove a registered guard', () => {
        const newGuard = new Guard('expression', 'guardToRemove')
        guardService.registerGuard(newGuard);
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
        const newGuard = new Guard('initialExpression', "linkedGuard")
        guardService.linkGuard(newGuard);
        expect(guardService.isNameUnique('linkedGuard')).toBe(false); // Guard should now be registered
    });

    test('linkNameToGuard should update the expression of an existing guard', () => {
        const newGuard = new Guard('initialExpression','guardToUpdate')
        const updatedGuard = new Guard('updatedExpression','guardToUpdate')
        guardService.linkGuard(newGuard);
        guardService.linkGuard(updatedGuard);

        expect(guardService.isNameUnique('guardToUpdate')).toBe(false);
        expect(guardService.getGuardExpression("guardToUpdate")).toEqual("updatedExpression")
    });

    test('getAllGuardNames should return an empty array if no guards are registered', () => {
        const guardNames = guardService.getAllGuardNames();
        expect(guardNames).toEqual([]); // Expecting an empty array
    });

    test('getAllGuardNames should return an array of all registered guard names', () => {
        const guard1 = new Guard("expression1", "guard1")
        const guard2 = new Guard("expression2", "guard2")
        guardService.registerGuard(guard1);
        guardService.registerGuard(guard2);

        const guardNames = guardService.getAllGuardNames();
        expect(guardNames).toContain('guard1');
        expect(guardNames).toContain('guard2');
        expect(guardNames.length).toBe(2); // Expecting exactly 2 guards
    });

    // Tests for getGuardExpression method
    test('getGuardExpression should return the correct expression for a registered guard', () => {
        const newGuard = new Guard("expression1", "guard1")
        guardService.registerGuard(newGuard);

        const expression = guardService.getGuardExpression('guard1');
        expect(expression).toBe('expression1');
    });

    test('getGuardExpression should return undefined for a non-existent guard name', () => {
        const expression = guardService.getGuardExpression('nonExistentGuard');
        expect(expression).toBeUndefined();
    });
});
