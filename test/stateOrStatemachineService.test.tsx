import { expect, test, beforeEach } from '@jest/globals';
import StateOrStateMachineService from "../src/services/stateOrStateMachineService";

let service = new StateOrStateMachineService();

describe('stateOrStateMachineService', () => {
    beforeEach(() => {
        // Clear the state by unregistering all names
        service = new StateOrStateMachineService();
    });

    test('registerName should register a unique name', () => {
        const name = 'uniqueState';
        const result = service.registerName(name);
        expect(result).toBe(true);
        expect(service.isNameUnique(name)).toBe(false); // Now the name is not unique
    });

    test('registerName should not register a duplicate name', () => {
        const name = 'duplicateState';
        service.registerName(name);
        const result = service.registerName(name);
        expect(result).toBe(false);
    });

    test('unregisterName should remove a registered name', () => {
        const name = 'stateToRemove';
        service.registerName(name);
        service.unregisterName(name);
        expect(service.isNameUnique(name)).toBe(true); // Now the name is unique
    });

    test('unregisterName should do nothing if the name is not registered', () => {
        const name = 'nonExistentState';
        service.unregisterName(name); // Should do nothing
        expect(service.isNameUnique(name)).toBe(true); // Still unique
    });

    test('isNameUnique should return true for a unique name', () => {
        const name = 'uniqueState';
        const result = service.isNameUnique(name);
        expect(result).toBe(true);
    });

    test('isNameUnique should return false for a non-unique name', () => {
        const name = 'nonUniqueState';
        service.registerName(name);
        const result = service.isNameUnique(name);
        expect(result).toBe(false);
    });


    // ############################## Name Generation Tests ############################################################

    test('generateUniqueName should generate a unique name when no names are registered', () => {
        const uniqueName = service.generateUniqueName('state');
        expect(service.isNameUnique(uniqueName)).toBe(true); // The name should be unique initially
        service.registerName(uniqueName); // Register the name
        expect(service.isNameUnique(uniqueName)).toBe(false); // The name should now be registered
        expect(uniqueName).toBe('state 0'); // The first name should be 'state 0'
    });

    test('generateUniqueName should generate a unique name when some names are already registered', () => {
        service.registerName('state 0');
        const uniqueName = service.generateUniqueName('state');
        expect(service.isNameUnique(uniqueName)).toBe(true); // The name should be unique initially
        service.registerName(uniqueName); // Register the name
        expect(service.isNameUnique(uniqueName)).toBe(false); // The name should now be registered
        expect(uniqueName).toBe('state 1'); // The next name should be 'state 1'
    });

    test('generateUniqueName should handle multiple calls correctly', () => {
        const uniqueName1 = service.generateUniqueName('state');
        const uniqueName2 = service.generateUniqueName('state');
        expect(uniqueName1).toBe('state 0'); // The first name should be 'state 0'
        expect(uniqueName2).toBe('state 1'); // The second name should be 'state 1'
        expect(service.isNameUnique(uniqueName1)).toBe(true); // Both names should be unique initially
        expect(service.isNameUnique(uniqueName2)).toBe(true);
        service.registerName(uniqueName1); // Register the first name
        service.registerName(uniqueName2); // Register the second name
        expect(service.isNameUnique(uniqueName1)).toBe(false); // Both names should now be registered
        expect(service.isNameUnique(uniqueName2)).toBe(false);
    });

    test('generateUniqueName should increment the id correctly', () => {
        const name1 = service.generateUniqueName('state');
        const name2 = service.generateUniqueName('state');
        expect(name1).toBe('state 0');
        expect(name2).toBe('state 1');
    });

    test('generateUniqueName should generate unique names even when manually added names exist', () => {
        service.registerName('custom 0');
        const uniqueName = service.generateUniqueName('custom');
        expect(service.isNameUnique(uniqueName)).toBe(true); // The name should be unique initially
        service.registerName(uniqueName); // Register the name
        expect(service.isNameUnique(uniqueName)).toBe(false); // The name should now be registered
        expect(uniqueName).toBe('custom 1'); // The next name should be 'custom 1'
        expect(uniqueName).not.toBe('custom 0'); // The name should be different from the registered one
    });
});
