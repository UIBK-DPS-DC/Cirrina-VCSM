import StateMachine from "../src/classes/stateMachine";
import {CsmNodeProps} from "../src/types";
import StateOrStateMachineService from "../src/services/stateOrStateMachineService";
import State from "../src/classes/state";

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

    // New Test for Name Registration
    test('registerName should handle multiple unique names correctly', () => {
        const name1 = 'uniqueState1';
        const name2 = 'uniqueState2';
        service.registerName(name1);
        service.registerName(name2);
        expect(service.isNameUnique(name1)).toBe(false);
        expect(service.isNameUnique(name2)).toBe(false);
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

    // New Test for Name Generation
    test('generateUniqueName should generate unique names with different types', () => {
        const uniqueName1 = service.generateUniqueName('state');
        const uniqueName2 = service.generateUniqueName('custom');
        expect(service.isNameUnique(uniqueName1)).toBe(true);
        expect(service.isNameUnique(uniqueName2)).toBe(true);
        service.registerName(uniqueName1);
        service.registerName(uniqueName2);
        expect(service.isNameUnique(uniqueName1)).toBe(false);
        expect(service.isNameUnique(uniqueName2)).toBe(false);
    });

    // ############################## Get and Set Name Tests ############################################################

    test('getName should return the name from state', () => {
        const state = new State('stateName'); // Create instance of State
        const data: CsmNodeProps = { state };
        const name = service.getName(data);
        expect(name).toBe('stateName');
    });

    test('getName should return the name from stateMachine', () => {
        const stateMachine = new StateMachine('stateMachineName'); // Create instance of StateMachine
        const data: CsmNodeProps = { stateMachine };
        const name = service.getName(data);
        expect(name).toBe('stateMachineName');
    });

    test('getName should return the name from exit or entry', () => {
        const data: CsmNodeProps = { name: 'entryName' };
        const name = service.getName(data);
        expect(name).toBe('entryName');
    });

    test('setName should update the name in state', () => {
        const state = new State('oldName'); // Create instance of State
        const data: CsmNodeProps = { state };
        const updatedData = service.setName('newName', data);
        expect(updatedData).toEqual({ state: { ...state, name: 'newName' } });
    });

    test('setName should update the name in stateMachine', () => {
        const stateMachine = new StateMachine('oldName'); // Create instance of StateMachine
        const data: CsmNodeProps = { stateMachine };
        const updatedData = service.setName('newName', data);
        expect(updatedData).toEqual({ stateMachine: { ...stateMachine, name: 'newName' } });
    });

    test('setName should update the name in exit or entry', () => {
        const data: CsmNodeProps = { name: 'oldName' };
        const updatedData = service.setName('newName', data);
        expect(updatedData).toEqual({ name: 'newName' });
    });

    test('setName should return the same data if no matching type', () => {
        const data: CsmNodeProps = { other: { name: 'otherName' } } as any;
        const updatedData = service.setName('newName', data);
        expect(updatedData).toEqual(data);
    });

    // New Test for Setting Name
    test('setName should handle updating the name correctly when changing types', () => {
        const state = new State('oldStateName'); // Create instance of State
        const stateMachine = new StateMachine('oldStateMachineName'); // Create instance of StateMachine
        let data: CsmNodeProps = { state };
        data = service.setName('newStateName', data);
        expect(service.getName(data)).toBe('newStateName');
        data = { stateMachine };
        data = service.setName('newStateMachineName', data);
        expect(service.getName(data)).toBe('newStateMachineName');
    });
});