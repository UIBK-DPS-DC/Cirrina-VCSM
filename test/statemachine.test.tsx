import StateMachine from '../src/classes/stateMachine';
import State from '../src/classes/state';
import Action from '../src/classes/action';
import Guard from '../src/classes/guard';
import ContextVariable from '../src/classes/contextVariable';
import { ActionType } from '../src/enums';
import {
    ContextVariableDescription,
    StateDescription,
    StateMachineDescription
} from "../src/pkl/bindings/collaborative_state_machine_description.pkl";

describe('StateMachine', () => {
    let stateMachine: StateMachine;

    beforeEach(() => {
        stateMachine = new StateMachine('TestStateMachine');
    });

    test('should initialize with the correct name', () => {
        expect(stateMachine.name).toBe('TestStateMachine');
    });

    test('should add and retrieve states', () => {
        const state1 = new State('State1');
        const state2 = new State('State2');

        stateMachine.addState(state1);
        stateMachine.addState(state2);

        expect(stateMachine.states).toEqual([state1, state2]);
    });

    test('should clear states correctly', () => {
        const state1 = new State('State1');
        const state2 = new State('State2');

        stateMachine.addState(state1);
        stateMachine.addState(state2);
        stateMachine.clearStates();

        expect(stateMachine.states).toEqual([]);
    });

    test('should retrieve all named actions without duplicates', () => {
        const action1 = new Action('Action1', ActionType.RAISE_EVENT);
        const action2 = new Action('Action2', ActionType.RAISE_EVENT);
        const duplicateAction1 = new Action('Action1', ActionType.RAISE_EVENT); // Duplicate

        const state1 = new State('State1');
        state1.entry = [action1, action2];

        const state2 = new State('State2');
        state2.entry = [duplicateAction1];

        stateMachine.addState(state1);
        stateMachine.addState(state2);

        const namedActions = stateMachine.getAllNamedActions();
        expect(namedActions).toEqual([action1, action2]); // No duplicates
    });

    test('should retrieve all named guards without duplicates', () => {
        const guard1 = new Guard('expression1', 'Guard1');
        const guard2 = new Guard('expression2', 'Guard2');
        const duplicateGuard1 = new Guard('expression1', 'Guard1'); // Duplicate

        const state1 = new State('State1');
        state1.on = []; // Ensure on is defined
        state1.on.push({ getAllNamedGuards: () => [guard1, guard2] } as any); // Mock Transition

        const state2 = new State('State2');
        state2.on = [];
        state2.on.push({ getAllNamedGuards: () => [duplicateGuard1] } as any); // Mock Transition

        stateMachine.addState(state1);
        stateMachine.addState(state2);

        const namedGuards = stateMachine.getAllNamedGuards();
        expect(namedGuards).toEqual([guard1, guard2]); // No duplicates
    });

    // New tests for removeContext
    test('should remove a context variable from localContext', () => {
        const contextVar1 = new ContextVariable('var1', 'value1');
        const contextVar2 = new ContextVariable('var2', 'value2');

        stateMachine.localContext = [contextVar1, contextVar2];
        stateMachine.removeContext(contextVar1);

        expect(stateMachine.localContext).toEqual([contextVar2]);
    });

    test('should remove a context variable from persistentContext', () => {
        const contextVar1 = new ContextVariable('var1', 'value1');
        const contextVar2 = new ContextVariable('var2', 'value2');

        stateMachine.persistentContext = [contextVar1, contextVar2];
        stateMachine.removeContext(contextVar1);

        expect(stateMachine.persistentContext).toEqual([contextVar2]);
    });

    test('should remove a context variable from both localContext and persistentContext', () => {
        const contextVar1 = new ContextVariable('var1', 'value1');
        const contextVar2 = new ContextVariable('var2', 'value2');

        stateMachine.localContext = [contextVar1, contextVar2];
        stateMachine.persistentContext = [contextVar1, contextVar2];

        stateMachine.removeContext(contextVar1);

        expect(stateMachine.localContext).toEqual([contextVar2]);
        expect(stateMachine.persistentContext).toEqual([contextVar2]);
    });

    test('should not alter contexts if the context variable is not found', () => {
        const contextVar1 = new ContextVariable('var1', 'value1');
        const contextVar2 = new ContextVariable('var2', 'value2');
        const contextVar3 = new ContextVariable('var3', 'value3'); // This one will not be in the context arrays

        stateMachine.localContext = [contextVar1, contextVar2];
        stateMachine.persistentContext = [contextVar1, contextVar2];

        stateMachine.removeContext(contextVar3);

        expect(stateMachine.localContext).toEqual([contextVar1, contextVar2]);
        expect(stateMachine.persistentContext).toEqual([contextVar1, contextVar2]);
    });

});
describe('fromDescription Method', () => {
    it('should correctly convert StateMachineDescription to StateMachine', () => {
        // Create context variable descriptions
        const contextVariableDescription: ContextVariableDescription = {
            name: "var1",
            value: "value1",
        };

        // Create state descriptions
        const stateDescription: StateDescription = {
            name: "State1",
            initial: true,
            terminal: false,
            entry: [],
            exit: [],
            while: [],
            after: [],
            on: [],
            always: [],
            localContext: { variables: [contextVariableDescription] },
            persistentContext: { variables: [] },
            staticContext: { variables: [] },
        };

        // Create state machine description
        const stateMachineDescription: StateMachineDescription = {
            name: "StateMachine1",
            localContext: { variables: [contextVariableDescription] },
            persistentContext: { variables: [contextVariableDescription] },
            stateMachines: [],
            states: [stateDescription],
        };

        // Convert description to StateMachine
        const stateMachine = StateMachine.fromDescription(stateMachineDescription);

        expect(stateMachine).toBeInstanceOf(StateMachine);
        expect(stateMachine.name).toBe("StateMachine1");
        expect(stateMachine.localContext).toHaveLength(1);
        expect(stateMachine.localContext[0]).toBeInstanceOf(ContextVariable);
        expect(stateMachine.localContext[0].name).toBe("var1");
        expect(stateMachine.persistentContext).toHaveLength(1);
        expect(stateMachine.persistentContext[0].value).toBe("value1");
        expect(stateMachine.states).toHaveLength(1);
        expect(stateMachine.states[0]).toBeInstanceOf(State);
        expect((stateMachine.states[0] as State).name).toBe("State1");
    });

    it('should handle nested state machines within StateMachineDescription', () => {
        const contextVariableDescription: ContextVariableDescription = {
            name: "var1",
            value: "value1",
        };

        // Create state description
        const stateDescription: StateDescription = {
            name: "State1",
            initial: true,
            terminal: false,
            entry: [],
            exit: [],
            while: [],
            after: [],
            on: [],
            always: [],
            localContext: { variables: [] },
            persistentContext: { variables: [] },
            staticContext: { variables: [] },
        };

        // Create nested state machine description
        const nestedStateMachineDescription: StateMachineDescription = {
            name: "NestedStateMachine",
            localContext: { variables: [contextVariableDescription] },
            persistentContext: { variables: [] },
            stateMachines: [],
            states: [stateDescription],
        };

        // Create main state machine description with a nested state machine
        const stateMachineDescription: StateMachineDescription = {
            name: "MainStateMachine",
            localContext: { variables: [] },
            persistentContext: { variables: [] },
            stateMachines: [nestedStateMachineDescription],
            states: [],
        };

        // Convert description to StateMachine
        const stateMachine = StateMachine.fromDescription(stateMachineDescription);

        expect(stateMachine).toBeInstanceOf(StateMachine);
        expect(stateMachine.name).toBe("MainStateMachine");
        expect(stateMachine.states).toHaveLength(1);
        expect(stateMachine.states[0]).toBeInstanceOf(StateMachine);
        expect((stateMachine.states[0] as StateMachine).name).toBe("NestedStateMachine");
        expect((stateMachine.states[0] as StateMachine).localContext[0].name).toBe("var1");
    });

    it('should handle empty states and state machines in StateMachineDescription', () => {
        const stateMachineDescription: StateMachineDescription = {
            name: "EmptyStateMachine",
            localContext: { variables: [] },
            persistentContext: { variables: [] },
            stateMachines: [],
            states: [],
        };

        const stateMachine = StateMachine.fromDescription(stateMachineDescription);

        expect(stateMachine).toBeInstanceOf(StateMachine);
        expect(stateMachine.name).toBe("EmptyStateMachine");
        expect(stateMachine.states).toHaveLength(0);
        expect(stateMachine.localContext).toHaveLength(0);
        expect(stateMachine.persistentContext).toHaveLength(0);
    });

    it('should handle StateMachineDescription with multiple states and state machines', () => {
        const contextVariableDescription: ContextVariableDescription = {
            name: "var2",
            value: "value2",
        };

        const stateDescription1: StateDescription = {
            name: "State1",
            initial: true,
            terminal: false,
            entry: [],
            exit: [],
            while: [],
            after: [],
            on: [],
            always: [],
            localContext: { variables: [] },
            persistentContext: { variables: [] },
            staticContext: { variables: [] },
        };

        const stateDescription2: StateDescription = {
            name: "State2",
            initial: false,
            terminal: true,
            entry: [],
            exit: [],
            while: [],
            after: [],
            on: [],
            always: [],
            localContext: { variables: [] },
            persistentContext: { variables: [] },
            staticContext: { variables: [] },
        };

        const nestedStateMachineDescription: StateMachineDescription = {
            name: "NestedStateMachine",
            localContext: { variables: [contextVariableDescription] },
            persistentContext: { variables: [] },
            stateMachines: [],
            states: [stateDescription2],
        };

        const stateMachineDescription: StateMachineDescription = {
            name: "ComplexStateMachine",
            localContext: { variables: [] },
            persistentContext: { variables: [] },
            stateMachines: [nestedStateMachineDescription],
            states: [stateDescription1],
        };

        const stateMachine = StateMachine.fromDescription(stateMachineDescription);

        expect(stateMachine).toBeInstanceOf(StateMachine);
        expect(stateMachine.name).toBe("ComplexStateMachine");
        expect(stateMachine.states).toHaveLength(2); // 1 state + 1 nested state machine
        expect(stateMachine.getAllStates()).toHaveLength(1);
        expect(stateMachine.getAllStateMachines()).toHaveLength(1);
        expect((stateMachine.states[1] as StateMachine).name).toBe("NestedStateMachine");
        expect(stateMachine.getAllStateMachines()[0].states).toHaveLength(1);
    });
});