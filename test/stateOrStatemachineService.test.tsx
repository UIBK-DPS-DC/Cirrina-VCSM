import StateMachine from "../src/classes/stateMachine";
import {CsmNodeProps} from "../src/types";
import StateOrStateMachineService from "../src/services/stateOrStateMachineService";
import State from "../src/classes/state";
import {ActionType} from "../src/enums";
import Action from "../src/classes/action";

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
        expect(updatedData).toEqual({ state: expect.objectContaining({ ...state, _name: 'newName' }) });
    });

    test('setName should update the name in stateMachine', () => {
        const stateMachine = new StateMachine('oldName'); // Create instance of StateMachine
        const data: CsmNodeProps = { stateMachine };
        const updatedData = service.setName('newName', data);
        expect(updatedData).toEqual({ stateMachine: expect.objectContaining({ ...stateMachine, _name: 'newName' }) });
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

    // Additional Tests for setName

    test('setName should handle multiple updates to state name', () => {
        const state = new State('initialName');
        const data: CsmNodeProps = { state };
        let updatedData = service.setName('firstUpdate', data);
        updatedData = service.setName('secondUpdate', updatedData);
        updatedData = service.setName('finalUpdate', updatedData);
        expect(updatedData).toEqual({ state: expect.objectContaining({ ...state, _name: 'finalUpdate' }) });
    });

    test('setName should handle multiple updates to stateMachine name', () => {
        const stateMachine = new StateMachine('initialName');
        const data: CsmNodeProps = { stateMachine };
        let updatedData = service.setName('firstUpdate', data);
        updatedData = service.setName('secondUpdate', updatedData);
        updatedData = service.setName('finalUpdate', updatedData);
        expect(updatedData).toEqual({ stateMachine: expect.objectContaining({ ...stateMachine, _name: 'finalUpdate' }) });
    });

    test('setName should not modify other properties in state', () => {
        const state = new State('oldName');
        state.initial = true;
        state.terminal = true;
        const data: CsmNodeProps = { state };
        const updatedData = service.setName('newName', data);
        expect(updatedData).toEqual({
            state: expect.objectContaining({
                ...state,
                _name: 'newName',
                _initial: true,
                _terminal: true
            })
        });
    });

    test('setName should not modify other properties in stateMachine', () => {
        const stateMachine = new StateMachine('oldName');
        stateMachine.states = [new State('childState')];
        const data: CsmNodeProps = { stateMachine };
        const updatedData = service.setName('newName', data);
        expect(updatedData).toEqual({
            stateMachine: expect.objectContaining({
                ...stateMachine,
                _name: 'newName',
                _states: expect.arrayContaining([expect.objectContaining({ _name: 'childState' })])
            })
        });
    });

    // ############################## Link and Unlink Node Tests ########################################################

    test('linkNode should link a node to a state', () => {
        const state = new State('stateName');
        const data: CsmNodeProps = { state };
        const nodeId = 'node1';
        service.linkNode(nodeId, data);
        const linked = service.getLinkedStateOrStatemachine(nodeId);
        expect(linked).toBe(state);
    });

    test('linkNode should link a node to a stateMachine', () => {
        const stateMachine = new StateMachine('stateMachineName');
        const data: CsmNodeProps = { stateMachine };
        const nodeId = 'node2';
        service.linkNode(nodeId, data);
        const linked = service.getLinkedStateOrStatemachine(nodeId);
        expect(linked).toBe(stateMachine);
    });

    test('linkNode should log an error for unknown data type', () => {
        const data: CsmNodeProps = { name: 'unknown' };
        const nodeId = 'node3';
        console.error = jest.fn();
        service.linkNode(nodeId, data);
        expect(console.error).toHaveBeenCalledWith(`Node could not be linked, unknown type of data ${data}`);
    });

    test('unlinkNode should unlink a node', () => {
        const state = new State('stateName');
        const data: CsmNodeProps = { state };
        const nodeId = 'node4';
        service.linkNode(nodeId, data);
        service.unlinkNode(nodeId);
        const linked = service.getLinkedStateOrStatemachine(nodeId);
        expect(linked).toBeUndefined();
    });

    test('unlinkNode should log a message if the node is not found', () => {
        const nodeId = 'node5';
        console.log = jest.fn();
        service.unlinkNode(nodeId);
        expect(console.log).toHaveBeenCalledWith(`Node: ${nodeId} not found!`);
    });

    test('getLinkedStateOrStatemachine should retrieve the linked state or stateMachine', () => {
        const state = new State('stateName');
        const data: CsmNodeProps = { state };
        const nodeId = 'node6';
        service.linkNode(nodeId, data);
        const linked = service.getLinkedStateOrStatemachine(nodeId);
        expect(linked).toBe(state);
    });

    test('getLinkedStateOrStatemachine should log an error if the node is not found', () => {
        const nodeId = 'node7';
        console.error = jest.fn();
        const linked = service.getLinkedStateOrStatemachine(nodeId);
        expect(linked).toBeUndefined();
        expect(console.error).toHaveBeenCalledWith(`State or Statemachine with id ${nodeId} could not be found`);
    });

    test('getStateOrStateMachineByName should return the correct state by name', () => {
        const stateName = 'testState';
        const state = new State(stateName);
        const nodeId = 'node1';
        service.linkNode(nodeId, { state: state });

        const result = service.getStateOrStateMachineByName(stateName);
        expect(result).toBe(state);
    });

    test('getStateOrStateMachineByName should return the correct stateMachine by name', () => {
        const stateMachineName = 'testStateMachine';
        const stateMachine = new StateMachine(stateMachineName);
        const nodeId = 'node2';
        service.linkNode(nodeId, { stateMachine: stateMachine });

        const result = service.getStateOrStateMachineByName(stateMachineName);
        expect(result).toBe(stateMachine);
    });

    test('getStateOrStateMachineByName should return undefined for a non-existent name', () => {
        const result = service.getStateOrStateMachineByName('nonExistentName');
        expect(result).toBeUndefined();
    });

    test('getStateOrStateMachineByName should return undefined if no states or stateMachines are linked', () => {
        const result = service.getStateOrStateMachineByName('anyName');
        expect(result).toBeUndefined();
    });

    test('getStateOrStateMachineByName should return the correct state when multiple states are linked', () => {
        const stateName1 = 'testState1';
        const stateName2 = 'testState2';
        const state1 = new State(stateName1);
        const state2 = new State(stateName2);
        service.linkNode('node1', { state: state1 });
        service.linkNode('node2', { state: state2 });

        const result1 = service.getStateOrStateMachineByName(stateName1);
        const result2 = service.getStateOrStateMachineByName(stateName2);

        expect(result1).toBe(state1);
        expect(result2).toBe(state2);
    });

    test('getStateOrStateMachineByName should return the correct stateMachine when multiple stateMachines are linked', () => {
        const stateMachineName1 = 'testStateMachine1';
        const stateMachineName2 = 'testStateMachine2';
        const stateMachine1 = new StateMachine(stateMachineName1);
        const stateMachine2 = new StateMachine(stateMachineName2);
        service.linkNode('node3', { stateMachine: stateMachine1 });
        service.linkNode('node4', { stateMachine: stateMachine2 });

        const result1 = service.getStateOrStateMachineByName(stateMachineName1);
        const result2 = service.getStateOrStateMachineByName(stateMachineName2);

        expect(result1).toBe(stateMachine1);
        expect(result2).toBe(stateMachine2);
    });

    test('getStateOrStateMachineByName should log a message when the stateMachine is not found', () => {
        console.log = jest.fn();
        const result = service.getStateOrStateMachineByName('nonExistentName');
        expect(result).toBeUndefined();
        expect(console.log).toHaveBeenCalledWith(`Statemachine nonExistentName not found!`);
    });


});

describe("StateOrStateMachineService - removeActionFromState", () => {
    let stateOrStateMachineService: StateOrStateMachineService;
    let testState: State;
    let testAction: Action;
    let testAction2: Action;
    let data: CsmNodeProps;

    beforeEach(() => {
        stateOrStateMachineService = new StateOrStateMachineService();

        // Initialize a state and actions
        testState = new State("TestState");
        testAction = new Action("TestAction", ActionType.RAISE_EVENT);
        testAction2 = new Action("AnotherAction", ActionType.INVOKE);

        // Add actions to various state arrays
        testState.entry = [testAction, testAction2];
        testState.while = [testAction];
        testState.exit = [testAction];
        testState.after = [testAction2];

        // Set up the data object
        data = { state: testState };
    });

    test("should remove an action from the entry array", () => {
        stateOrStateMachineService.removeActionFromState(testAction, data);
        expect(testState.entry).toEqual([testAction2]);
    });

    test("should remove an action from the while array", () => {
        stateOrStateMachineService.removeActionFromState(testAction, data);
        expect(testState.while).toEqual([]);
    });

    test("should remove an action from the exit array", () => {
        stateOrStateMachineService.removeActionFromState(testAction, data);
        expect(testState.exit).toEqual([]);
    });

    test("should not remove other actions from the after array", () => {
        stateOrStateMachineService.removeActionFromState(testAction, data);
        expect(testState.after).toEqual([testAction2]);
    });

    test("should remove an action from all arrays where it exists", () => {
        stateOrStateMachineService.removeActionFromState(testAction, data);
        expect(testState.entry).not.toContain(testAction);
        expect(testState.while).not.toContain(testAction);
        expect(testState.exit).not.toContain(testAction);
    });

    test("should not modify the arrays if the action does not exist", () => {
        const nonExistingAction = new Action("NonExistingAction", ActionType.CREATE);
        stateOrStateMachineService.removeActionFromState(nonExistingAction, data);

        expect(testState.entry).toEqual([testAction, testAction2]);
        expect(testState.while).toEqual([testAction]);
        expect(testState.exit).toEqual([testAction]);
        expect(testState.after).toEqual([testAction2]);
    });

    test("should not fail if data is not a state", () => {
        const invalidData = {} as CsmNodeProps; // Passing invalid data
        expect(() => stateOrStateMachineService.removeActionFromState(testAction, invalidData)).not.toThrow();
    });
});


describe('StateOrStateMachineService - Statemachine Name Set', () => {
    let service: StateOrStateMachineService;

    beforeEach(() => {
        service = new StateOrStateMachineService();
    });

    describe('linkStateNameToStatemachine', () => {
        test('should link state to an existing state machine', () => {
            const stateMachineID = 'sm_1';
            const stateName = 'state_1';

            // Create a state machine manually
            service.linkStateNameToStatemachine('initial_state', stateMachineID, true);

            service.linkStateNameToStatemachine(stateName, stateMachineID);

            // Check if the state has been added
            const stateNames = service['statemachineIDToStateNamesMap'].get(stateMachineID);
            expect(stateNames).toContain(stateName);
        });

        test('should fail to link state to non-existent state machine without create flag', () => {
            const stateMachineID = 'non_existent_sm';
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            service.linkStateNameToStatemachine('state_1', stateMachineID);

            expect(consoleSpy).toHaveBeenCalledWith(`Statemachine ${stateMachineID} does not exist.\n`);
            const stateNames = service['statemachineIDToStateNamesMap'].get(stateMachineID);
            expect(stateNames).toBeUndefined();

            consoleSpy.mockRestore();
        });

        test('should create and link state to a new state machine with create flag', () => {
            const stateMachineID = 'sm_2';
            const stateName = 'state_1';

            service.linkStateNameToStatemachine(stateName, stateMachineID, true);

            const stateNames = service['statemachineIDToStateNamesMap'].get(stateMachineID);
            expect(stateNames).toBeDefined();
            expect(stateNames).toContain(stateName);
        });

        test('should not allow duplicate state names in a state machine', () => {
            const stateMachineID = 'sm_3';
            const stateName = 'state_1';
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            service.linkStateNameToStatemachine(stateName, stateMachineID, true); // First addition
            service.linkStateNameToStatemachine(stateName, stateMachineID); // Try to add again

            expect(consoleSpy).toHaveBeenCalledWith(`State ${stateName} already exist on Statemachine ${stateMachineID}`);
            const stateNames = service['statemachineIDToStateNamesMap'].get(stateMachineID);
            if(! stateNames){
                return fail("Failed to return state names")
            }
            expect(stateNames.size).toBe(1); // Ensure only one state exists

            consoleSpy.mockRestore();
        });

        test('should create new state machine and add the state if state machine does not exist', () => {
            const stateMachineID = 'sm_new';
            const stateName = 'state_1';

            service.linkStateNameToStatemachine(stateName, stateMachineID, true);
            const stateNames = service['statemachineIDToStateNamesMap'].get(stateMachineID);

            expect(stateNames).toContain(stateName);
        });
    });

    describe('unlinkStateNameFromStatemachine', () => {
        test('should unlink state from an existing state machine', () => {
            const stateMachineID = 'sm_4';
            const stateName = 'state_1';

            service.linkStateNameToStatemachine(stateName, stateMachineID, true);
            const stateNames = service['statemachineIDToStateNamesMap'].get(stateMachineID);
            expect(stateNames).toContain(stateName);

            const result = service.unlinkStateNameFromStatemachine(stateName, stateMachineID);
            expect(result).toBe(true);
            expect(stateNames).not.toContain(stateName);
        });

        test('should return false when unlinking state from a non-existent state machine', () => {
            const stateMachineID = 'non_existent_sm';
            const result = service.unlinkStateNameFromStatemachine('state_1', stateMachineID);
            expect(result).toBe(false);
        });

        test('should return false if state does not exist in the state machine', () => {
            const stateMachineID = 'sm_5';
            const stateName = 'non_existent_state';
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            service.linkStateNameToStatemachine('state_1', stateMachineID, true); // Add a different state

            const result = service.unlinkStateNameFromStatemachine(stateName, stateMachineID);
            expect(result).toBe(false);
            expect(consoleSpy).toHaveBeenCalledWith(`State ${stateName} does not exist in Statemachine ${stateMachineID}.\n`);

            consoleSpy.mockRestore();
        });

        test('should remove the state machine if no more states are left', () => {
            const stateMachineID = 'sm_6';
            const stateName = 'state_1';
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            service.linkStateNameToStatemachine(stateName, stateMachineID, true);

            const result = service.unlinkStateNameFromStatemachine(stateName, stateMachineID);
            expect(result).toBe(true);

            const stateNames = service['statemachineIDToStateNamesMap'].get(stateMachineID);
            expect(stateNames).toBeUndefined(); // Check if state machine entry is removed

            expect(consoleSpy).toHaveBeenCalledWith(`Statemachine ${stateMachineID} has no more states and has been removed.`);

            consoleSpy.mockRestore();
        });

        test('should unlink the last state and remove the state machine', () => {
            const stateMachineID = 'sm_7';
            const stateName = 'state_last';

            service.linkStateNameToStatemachine(stateName, stateMachineID, true);

            const result = service.unlinkStateNameFromStatemachine(stateName, stateMachineID);
            expect(result).toBe(true);

            const stateNames = service['statemachineIDToStateNamesMap'].get(stateMachineID);
            expect(stateNames).toBeUndefined();
        });
    });
});


describe('StateOrStateMachineService - stateMachineHasState', () => {
    let service: StateOrStateMachineService;

    beforeEach(() => {
        service = new StateOrStateMachineService();
    });

    test('should return true if the state exists in the state machine', () => {
        const stateMachineID = 'sm_1';
        const stateName = 'state_1';

        // Manually add a state machine and a state
        service.linkStateNameToStatemachine(stateName, stateMachineID, true);

        const result = service.stateMachineHasState(stateName, stateMachineID);
        expect(result).toBe(true);
    });

    test('should return false if the state does not exist in the state machine', () => {
        const stateMachineID = 'sm_2';
        const stateName = 'non_existent_state';

        // Manually add a state machine without the state
        service.linkStateNameToStatemachine('state_1', stateMachineID, true);

        const result = service.stateMachineHasState(stateName, stateMachineID);
        expect(result).toBe(false);
    });

    test('should return false if the state machine does not exist', () => {
        const stateMachineID = 'non_existent_sm';
        const stateName = 'state_1';
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        const result = service.stateMachineHasState(stateName, stateMachineID);

        expect(result).toBe(false);
        expect(consoleSpy).toHaveBeenCalledWith(`Statemachine ${stateMachineID} does not exist.\n`);

        consoleSpy.mockRestore();
    });

    test('should return true if state is part of a complex state machine with multiple states', () => {
        const stateMachineID = 'sm_complex';
        const stateNames = ['state_1', 'state_2', 'state_3'];

        // Manually add a state machine with multiple states
        stateNames.forEach(stateName => {
            service.linkStateNameToStatemachine(stateName, stateMachineID, true);
        });

        // Check that all states exist in the state machine
        stateNames.forEach(stateName => {
            const result = service.stateMachineHasState(stateName, stateMachineID);
            expect(result).toBe(true);
        });
    });

    test('should return false if the state machine is empty (no states)', () => {
        const stateMachineID = 'sm_empty';
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        // Add a state machine but no states
        service.linkStateNameToStatemachine('dummy_state', stateMachineID, true);
        service.unlinkStateNameFromStatemachine('dummy_state', stateMachineID); // Remove the only state

        const result = service.stateMachineHasState('any_state', stateMachineID);

        expect(result).toBe(false);

        consoleSpy.mockRestore();
    });
});


describe('StateOrStateMachineService.getStateNames', () => {
    let service: StateOrStateMachineService;

    beforeEach(() => {
        service = new StateOrStateMachineService();
    });

    test('should return a set of state names if states are linked to the state machine', () => {
        // Setup: Add states to a state machine
        const stateMachineID = 'stateMachine1';
        const states = new Set<string>(['state1', 'state2', 'state3']);
        service['statemachineIDToStateNamesMap'].set(stateMachineID, states);

        // Call the function
        const result = service.getStateNames(stateMachineID);

        // Assertions
        expect(result).toBeDefined();
        expect(result).toEqual(states);
        expect(result?.has('state1')).toBe(true);
        expect(result?.has('state2')).toBe(true);
        expect(result?.has('state3')).toBe(true);
    });

    test('should return undefined if no states are linked to the state machine', () => {
        // Setup: Ensure no states are linked to the state machine
        const stateMachineID = 'stateMachine2';

        // Spy on console.log to check for expected output
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        // Call the function
        const result = service.getStateNames(stateMachineID);

        // Assertions
        expect(result).toBeUndefined();
        expect(consoleSpy).toHaveBeenCalledWith(`No States are linked to ${stateMachineID}`);

        // Restore the original console.log implementation
        consoleSpy.mockRestore();
    });

    test('should return a set of state names for an empty state machine', () => {
        // Setup: Create a state machine with no states
        const stateMachineID = 'stateMachine3';
        const emptyStates = new Set<string>();
        service['statemachineIDToStateNamesMap'].set(stateMachineID, emptyStates);

        // Call the function
        const result = service.getStateNames(stateMachineID);

        // Assertions
        expect(result).toBeDefined();
        expect(result).toEqual(emptyStates);
        expect(result?.size).toBe(0);  // The state machine exists but has no states
    });

    test('should not create a new entry in the state map when the state machine does not exist', () => {
        // Setup: Ensure the state machine does not exist
        const stateMachineID = 'nonExistentStateMachine';

        // Call the function
        const result = service.getStateNames(stateMachineID);

        // Assertions
        expect(result).toBeUndefined();
        expect(service['statemachineIDToStateNamesMap'].has(stateMachineID)).toBe(false);
    });

    test('should handle state machine with multiple state names correctly', () => {
        // Setup: Create a state machine with multiple states
        const stateMachineID = 'stateMachine4';
        const states = new Set<string>(['state1', 'state2', 'state3', 'state4']);
        service['statemachineIDToStateNamesMap'].set(stateMachineID, states);

        // Call the function
        const result = service.getStateNames(stateMachineID);

        // Assertions
        expect(result).toBeDefined();
        expect(result?.size).toBe(4);
        expect(result).toEqual(states);
        expect(result?.has('state1')).toBe(true);
        expect(result?.has('state2')).toBe(true);
        expect(result?.has('state3')).toBe(true);
        expect(result?.has('state4')).toBe(true);
    });

    test('should log a message if no states are linked to a non-existent state machine', () => {
        // Spy on console.log to capture output
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        // Call the function with a non-existent state machine ID
        const result = service.getStateNames('nonExistentStateMachineID');

        // Assertions
        expect(result).toBeUndefined();
        expect(consoleSpy).toHaveBeenCalledWith('No States are linked to nonExistentStateMachineID');

        // Restore the original console.log implementation
        consoleSpy.mockRestore();
    });

    test('should return an empty set for a state machine that exists but has no states', () => {
        // Setup: Create a state machine with an empty set of states
        const stateMachineID = 'emptyStateMachine';
        service['statemachineIDToStateNamesMap'].set(stateMachineID, new Set());

        // Call the function
        const result = service.getStateNames(stateMachineID);

        // Assertions
        expect(result).toBeDefined();
        expect(result?.size).toBe(0);
    });

    test('should handle multiple state machines and return the correct set for each', () => {
        // Setup: Create multiple state machines with different states
        const stateMachineID1 = 'stateMachine1';
        const stateMachineID2 = 'stateMachine2';
        service['statemachineIDToStateNamesMap'].set(stateMachineID1, new Set(['stateA', 'stateB']));
        service['statemachineIDToStateNamesMap'].set(stateMachineID2, new Set(['stateX', 'stateY']));

        // Call the function for the first state machine
        const result1 = service.getStateNames(stateMachineID1);
        // Call the function for the second state machine
        const result2 = service.getStateNames(stateMachineID2);

        // Assertions for stateMachineID1
        expect(result1).toBeDefined();
        expect(result1?.has('stateA')).toBe(true);
        expect(result1?.has('stateB')).toBe(true);

        // Assertions for stateMachineID2
        expect(result2).toBeDefined();
        expect(result2?.has('stateX')).toBe(true);
        expect(result2?.has('stateY')).toBe(true);
    });
});


