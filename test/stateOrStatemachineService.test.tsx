import { expect, test, beforeEach } from '@jest/globals';
import StateOrStateMachineService from "../src/services/stateOrStateMachineService";

let stateOrStateMachineService = new StateOrStateMachineService();

describe('stateOrStateMachineService', () => {
    beforeEach(() => {
        // Clear the state by unregistering all names
        stateOrStateMachineService = new StateOrStateMachineService();
    });

    test('registerName should register a unique name', () => {
        const name = 'uniqueState';
        const result = stateOrStateMachineService.registerName(name);
        expect(result).toBe(true);
        expect(stateOrStateMachineService.isNameUnique(name)).toBe(false); // Now the name is not unique
    });

    test('registerName should not register a duplicate name', () => {
        const name = 'duplicateState';
        stateOrStateMachineService.registerName(name);
        const result = stateOrStateMachineService.registerName(name);
        expect(result).toBe(false);
    });

    test('unregisterName should remove a registered name', () => {
        const name = 'stateToRemove';
        stateOrStateMachineService.registerName(name);
        stateOrStateMachineService.unregisterName(name);
        expect(stateOrStateMachineService.isNameUnique(name)).toBe(true); // Now the name is unique
    });

    test('unregisterName should do nothing if the name is not registered', () => {
        const name = 'nonExistentState';
        stateOrStateMachineService.unregisterName(name); // Should do nothing
        expect(stateOrStateMachineService.isNameUnique(name)).toBe(true); // Still unique
    });

    test('isNameUnique should return true for a unique name', () => {
        const name = 'uniqueState';
        const result = stateOrStateMachineService.isNameUnique(name);
        expect(result).toBe(true);
    });

    test('isNameUnique should return false for a non-unique name', () => {
        const name = 'nonUniqueState';
        stateOrStateMachineService.registerName(name);
        const result = stateOrStateMachineService.isNameUnique(name);
        expect(result).toBe(false);
    });
});
