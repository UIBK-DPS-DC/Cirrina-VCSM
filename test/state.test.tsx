import State from "../src/classes/state";
import Action from "../src/classes/action";
import ContextVariable from "../src/classes/contextVariable";
import {ActionType, EventChannel} from "../src/enums";
import Transition from "../src/classes/transition";
import Guard from "../src/classes/guard";
import {
    ContextVariableDescription,
    CreateActionDescription,
    EventDescription,
    OnTransitionDescription, RaiseActionDescription,
    StateDescription,
    TransitionDescription
} from "../src/pkl/bindings/collaborative_state_machine_description.pkl";

describe('State Class', () => {
    let state: State;
    let entryAction1: Action, entryAction2: Action;
    let whileAction1: Action, whileAction2: Action;
    let afterAction1: Action, afterAction2: Action;
    let exitAction1: Action, exitAction2: Action;

    beforeEach(() => {
        state = new State('TestState');
    });

    test('should return all actions in the correct order', () => {
        entryAction1 = new Action('EntryAction1', ActionType.RAISE_EVENT);
        entryAction2 = new Action('EntryAction2', ActionType.RAISE_EVENT);
        whileAction1 = new Action('WhileAction1', ActionType.RAISE_EVENT);
        whileAction2 = new Action('WhileAction2', ActionType.RAISE_EVENT);
        afterAction1 = new Action('AfterAction1', ActionType.RAISE_EVENT);
        afterAction2 = new Action('AfterAction2', ActionType.RAISE_EVENT);
        exitAction1 = new Action('ExitAction1', ActionType.RAISE_EVENT);
        exitAction2 = new Action('ExitAction2', ActionType.RAISE_EVENT);

        state.entry = [entryAction1, entryAction2];
        state.while = [whileAction1, whileAction2];
        state.after = [afterAction1, afterAction2];
        state.exit = [exitAction1, exitAction2];

        const allActions = state.getAllActions();
        expect(allActions).toEqual([
            entryAction1, entryAction2,
            whileAction1, whileAction2,
            afterAction1, afterAction2,
            exitAction1, exitAction2
        ]);
    });

    test('should return an empty array if no actions are defined', () => {
        state.entry = [];
        state.while = [];
        state.after = [];
        state.exit = [];
        const allActions = state.getAllActions();
        expect(allActions).toEqual([]);
    });

    test('should handle undefined action arrays gracefully', () => {
        state.entry = undefined as unknown as Action[];
        state.while = undefined as unknown as Action[];
        state.after = undefined as unknown as Action[];
        state.exit = undefined as unknown as Action[];
        const allActions = state.getAllActions();
        expect(allActions).toEqual([]);
    });

    test('should correctly reflect updates to action arrays', () => {
        entryAction1 = new Action('EntryAction1', ActionType.RAISE_EVENT);
        entryAction2 = new Action('EntryAction2', ActionType.RAISE_EVENT);
        whileAction1 = new Action('WhileAction1', ActionType.RAISE_EVENT);
        whileAction2 = new Action('WhileAction2', ActionType.RAISE_EVENT);
        afterAction1 = new Action('AfterAction1', ActionType.RAISE_EVENT);
        afterAction2 = new Action('AfterAction2', ActionType.RAISE_EVENT);
        exitAction1 = new Action('ExitAction1', ActionType.RAISE_EVENT);
        exitAction2 = new Action('ExitAction2', ActionType.RAISE_EVENT);

        state.entry = [entryAction1, entryAction2];
        state.while = [whileAction1, whileAction2];
        state.after = [afterAction1, afterAction2];
        state.exit = [exitAction1, exitAction2];

        const newEntryAction = new Action('NewEntryAction', ActionType.RAISE_EVENT);
        state.entry = [newEntryAction];
        const allActions = state.getAllActions();
        expect(allActions).toEqual([newEntryAction, whileAction1, whileAction2, afterAction1, afterAction2, exitAction1, exitAction2]);
    });

    test('should initialize with the correct name', () => {
        expect(state.name).toBe('TestState');
    });

    test('should add and retrieve entry actions correctly', () => {
        const action1 = new Action('action1', ActionType.RAISE_EVENT);
        const action2 = new Action('action2', ActionType.RAISE_EVENT);
        state.entry = [action1, action2];

        expect(state.getAllActions()).toEqual([action1, action2]);
    });

    test('should filter and return only named actions', () => {
        const action1 = new Action('action1', ActionType.RAISE_EVENT);
        const action2 = new Action('', ActionType.RAISE_EVENT);
        const action3 = new Action('action3', ActionType.RAISE_EVENT);
        state.entry = [action1, action2];
        state.exit = [action3];

        expect(state.getAllNamedActions()).toEqual([action1, action3]);
    });

    test('should add a transition only if it does not already exist', () => {
        const transition1 = new Transition('source1', 'target1');
        const transition2 = new Transition('source2', 'target2');

        state.addOnTransition(transition1);
        state.addOnTransition(transition2);
        state.addOnTransition(transition1); // This should not be added again

        expect(state.on.length).toBe(2);
        expect(state.on).toContain(transition1);
        expect(state.on).toContain(transition2);
    });

    test('should not add duplicate transitions to the "on" array', () => {
        const transition1 = new Transition('source1', 'target1');
        state.addOnTransition(transition1);
        state.addOnTransition(transition1);

        expect(state.on.length).toBe(1);
    });

    test('should return an empty array when there are no transitions', () => {
        const namedGuards = state.getAllNamedGuards();
        expect(namedGuards).toEqual([]);
    });

    test('should return an empty array when transitions have no named guards', () => {
        const transition = new Transition('source', 'target');
        transition.setGuards([new Guard('expression1'), new Guard('expression2')]); // Guards without names
        state.on = [transition];

        const namedGuards = state.getAllNamedGuards();
        expect(namedGuards).toEqual([]);
    });

    test('should return all named guards from multiple transitions', () => {
        const guard1 = new Guard('expression1', 'guard1');
        const guard2 = new Guard('expression2', 'guard2');
        const guard3 = new Guard('expression3', 'guard3');

        const transition1 = new Transition('source1', 'target1');
        transition1.setGuards([guard1, guard2]);

        const transition2 = new Transition('source2', 'target2');
        transition2.setGuards([guard2, guard3]); // guard2 appears in both transitions

        state.on = [transition1, transition2];

        const namedGuards = state.getAllNamedGuards();
        expect(namedGuards).toEqual([guard1, guard2, guard3]);
    });

    test('should remove duplicate guards across transitions', () => {
        const guard1 = new Guard('expression1', 'guard1');
        const duplicateGuard1 = new Guard('expression1', 'guard1'); // Duplicate

        const transition1 = new Transition('source1', 'target1');
        transition1.setGuards([guard1]);

        const transition2 = new Transition('source2', 'target2');
        transition2.setGuards([duplicateGuard1]); // Same as guard1

        state.on = [transition1, transition2];

        const namedGuards = state.getAllNamedGuards();
        expect(namedGuards).toEqual([guard1]); // Should only return the unique guard
    });

    test('should handle a mix of named and unnamed guards across transitions', () => {
        const guard1 = new Guard('expression1', 'guard1');
        const guard2 = new Guard('expression2'); // Unnamed guard
        const guard3 = new Guard('expression3', 'guard3');

        const transition1 = new Transition('source1', 'target1');
        transition1.setGuards([guard1, guard2]);

        const transition2 = new Transition('source2', 'target2');
        transition2.setGuards([guard3]);

        state.on = [transition1, transition2];

        const namedGuards = state.getAllNamedGuards();
        expect(namedGuards).toEqual([guard1, guard3]); // Only guard1 and guard3 should be returned
    });

    test('should return an empty array when there are no actions', () => {
        const namedActions = state.getAllNamedActions();
        expect(namedActions).toEqual([]);
    });

    test('should return an empty array when actions have no names', () => {
        const action1 = new Action('', ActionType.RAISE_EVENT); // No name
        const action2 = new Action('', ActionType.RAISE_EVENT); // No name
        state.entry = [action1];
        state.exit = [action2];

        const namedActions = state.getAllNamedActions();
        expect(namedActions).toEqual([]);
    });

    test('should return all named actions from various action lists', () => {
        const action1 = new Action('action1', ActionType.RAISE_EVENT);
        const action2 = new Action('action2', ActionType.RAISE_EVENT);
        const action3 = new Action('action3', ActionType.RAISE_EVENT);

        state.entry = [action1];
        state.while = [action2];
        state.exit = [action3];

        const namedActions = state.getAllNamedActions();
        expect(namedActions).toEqual([action1, action2, action3]);
    });

    test('should remove duplicate actions across different lists', () => {
        const action1 = new Action('action1', ActionType.RAISE_EVENT);
        const duplicateAction1 = new Action('action1', ActionType.RAISE_EVENT); // Same as action1

        state.entry = [action1];
        state.exit = [duplicateAction1]; // Duplicate in a different list

        const namedActions = state.getAllNamedActions();
        expect(namedActions).toEqual([action1]); // Should only return the unique action
    });

    test('should handle a mix of named and unnamed actions across different lists', () => {
        const action1 = new Action('action1', ActionType.RAISE_EVENT);
        const action2 = new Action('', ActionType.RAISE_EVENT); // Unnamed action
        const action3 = new Action('action3', ActionType.RAISE_EVENT);

        state.entry = [action1];
        state.while = [action2];
        state.exit = [action3];

        const namedActions = state.getAllNamedActions();
        expect(namedActions).toEqual([action1, action3]); // Only named actions should be returned
    });

    // New tests for removeContext
    test('should remove a context variable from localContext', () => {
        const contextVar1 = new ContextVariable('var1', 'value1');
        const contextVar2 = new ContextVariable('var2', 'value2');

        state.localContext = [contextVar1, contextVar2];
        state.removeContext(contextVar1);

        expect(state.localContext).toEqual([contextVar2]);
    });

    test('should remove a context variable from persistentContext', () => {
        const contextVar1 = new ContextVariable('var1', 'value1');
        const contextVar2 = new ContextVariable('var2', 'value2');

        state.persistentContext = [contextVar1, contextVar2];
        state.removeContext(contextVar1);

        expect(state.persistentContext).toEqual([contextVar2]);
    });

    test('should remove a context variable from staticContext', () => {
        const contextVar1 = new ContextVariable('var1', 'value1');
        const contextVar2 = new ContextVariable('var2', 'value2');

        state.staticContext = [contextVar1, contextVar2];
        state.removeContext(contextVar1);

        expect(state.staticContext).toEqual([contextVar2]);
    });

    test('should remove a context variable from all context arrays', () => {
        const contextVar1 = new ContextVariable('var1', 'value1');
        const contextVar2 = new ContextVariable('var2', 'value2');

        state.localContext = [contextVar1, contextVar2];
        state.persistentContext = [contextVar1, contextVar2];
        state.staticContext = [contextVar1, contextVar2];

        state.removeContext(contextVar1);

        expect(state.localContext).toEqual([contextVar2]);
        expect(state.persistentContext).toEqual([contextVar2]);
        expect(state.staticContext).toEqual([contextVar2]);
    });

    test('should not alter contexts if the context variable is not found', () => {
        const contextVar1 = new ContextVariable('var1', 'value1');
        const contextVar2 = new ContextVariable('var2', 'value2');
        const contextVar3 = new ContextVariable('var3', 'value3'); // This one will not be in the context arrays

        state.localContext = [contextVar1, contextVar2];
        state.persistentContext = [contextVar1, contextVar2];
        state.staticContext = [contextVar1, contextVar2];

        state.removeContext(contextVar3);

        expect(state.localContext).toEqual([contextVar1, contextVar2]);
        expect(state.persistentContext).toEqual([contextVar1, contextVar2]);
        expect(state.staticContext).toEqual([contextVar1, contextVar2]);
    });
});

describe('fromDescription Method', () => {

    it('should correctly convert StateDescription to State', () => {
        // Creating ContextVariableDescription object
        const contextVariableDescription: ContextVariableDescription = {
            name: "var1",
            value: "value1"
        };

        // Creating ActionDescription object
        const createActionDescription: CreateActionDescription = {
            type: ActionType.CREATE,
            variable: contextVariableDescription,
            isPersistent: true,
        };

        // Creating EventDescription object
        const eventDescription: EventDescription = {
            name: "event1",
            channel: EventChannel.INTERNAL,
            data: [contextVariableDescription]
        };

        // Creating RaiseEventActionDescription object
        const raiseEventActionDescription: RaiseActionDescription = {
            type: ActionType.RAISE_EVENT,
            event: eventDescription
        };

        // Creating OnTransitionDescription object
        const onTransitionDescription: OnTransitionDescription = {
            target: "TargetState",
            event: "SampleEvent",
            guards: [{ expression: "x > 5" }],
            actions: [createActionDescription],
            else: null,
        };

        // Creating TransitionDescription object
        const transitionDescription: TransitionDescription = {
            target: "AnotherState",
            guards: [{ expression: "a == b" }],
            actions: [raiseEventActionDescription],
            else: "ElseState",
        };

        // Creating StateDescription object
        const stateDescription: StateDescription = {
            name: "TestState",
            initial: true,
            terminal: false,
            entry: [createActionDescription],
            exit: [raiseEventActionDescription],
            while: [createActionDescription],
            after: [raiseEventActionDescription],
            on: [onTransitionDescription],
            always: [transitionDescription],
            localContext: { variables: [contextVariableDescription] },
            persistentContext: { variables: [contextVariableDescription] },
            staticContext: { variables: [contextVariableDescription] }
        };

        // Converting description to State
        const state = State.fromDescription(stateDescription);

        // Assertions
        expect(state).toBeInstanceOf(State);
        expect(state.name).toBe("TestState");
        expect(state.initial).toBe(true);
        expect(state.terminal).toBe(false);
        expect(state.entry).toHaveLength(1);
        expect(state.entry[0]).toBeInstanceOf(Action);
        expect(state.exit).toHaveLength(1);
        expect(state.exit[0]).toBeInstanceOf(Action);
        expect(state.while).toHaveLength(1);
        expect(state.while[0]).toBeInstanceOf(Action);
        expect(state.after).toHaveLength(1);
        expect(state.after[0]).toBeInstanceOf(Action);
        expect(state.on).toHaveLength(1);
        expect(state.on[0]).toBeInstanceOf(Transition);
        expect(state.always).toHaveLength(1);
        expect(state.always[0]).toBeInstanceOf(Transition);
        expect(state.localContext).toHaveLength(1);
        expect(state.persistentContext).toHaveLength(1);
        expect(state.staticContext).toHaveLength(1);
    });

    it('should handle empty transitions and actions', () => {
        // Creating StateDescription object with empty actions and transitions
        const stateDescription: StateDescription = {
            name: "EmptyState",
            initial: false,
            terminal: false,
            entry: [],
            exit: [],
            while: [],
            after: [],
            on: [],
            always: [],
            localContext: { variables: [] },
            persistentContext: { variables: [] },
            staticContext: { variables: [] }
        };

        // Converting description to State
        const state = State.fromDescription(stateDescription);

        // Assertions
        expect(state).toBeInstanceOf(State);
        expect(state.name).toBe("EmptyState");
        expect(state.initial).toBe(false);
        expect(state.terminal).toBe(false);
        expect(state.entry).toHaveLength(0);
        expect(state.exit).toHaveLength(0);
        expect(state.while).toHaveLength(0);
        expect(state.after).toHaveLength(0);
        expect(state.on).toHaveLength(0);
        expect(state.always).toHaveLength(0);
        expect(state.localContext).toHaveLength(0);
        expect(state.persistentContext).toHaveLength(0);
        expect(state.staticContext).toHaveLength(0);
    });

    it('should correctly handle missing optional fields', () => {
        // Creating minimal StateDescription object without optional fields
        const stateDescription: StateDescription = {
            name: "MinimalState",
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
            staticContext: { variables: [] }
        };

        // Converting description to State
        const state = State.fromDescription(stateDescription);

        // Assertions
        expect(state).toBeInstanceOf(State);
        expect(state.name).toBe("MinimalState");
        expect(state.initial).toBe(false);
        expect(state.terminal).toBe(true);
    });
});
