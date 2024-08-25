import State from "../src/classes/state";
import Action from "../src/classes/action";
import {ActionType} from "../src/enums";
import Transition from "../src/classes/transition";
import Guard from "../src/classes/guard";

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
        entryAction1 = new Action('EntryAction1',ActionType.RAISE_EVENT);
        entryAction2 = new Action('EntryAction2',ActionType.RAISE_EVENT);
        whileAction1 = new Action('WhileAction1',ActionType.RAISE_EVENT);
        whileAction2 = new Action('WhileAction2',ActionType.RAISE_EVENT);
        afterAction1 = new Action('AfterAction1',ActionType.RAISE_EVENT);
        afterAction2 = new Action('AfterAction2',ActionType.RAISE_EVENT);
        exitAction1 = new Action('ExitAction1',ActionType.RAISE_EVENT);
        exitAction2 = new Action('ExitAction2',ActionType.RAISE_EVENT);

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
        entryAction1 = new Action('EntryAction1',ActionType.RAISE_EVENT);
        entryAction2 = new Action('EntryAction2',ActionType.RAISE_EVENT);
        whileAction1 = new Action('WhileAction1',ActionType.RAISE_EVENT);
        whileAction2 = new Action('WhileAction2',ActionType.RAISE_EVENT);
        afterAction1 = new Action('AfterAction1',ActionType.RAISE_EVENT);
        afterAction2 = new Action('AfterAction2',ActionType.RAISE_EVENT);
        exitAction1 = new Action('ExitAction1',ActionType.RAISE_EVENT);
        exitAction2 = new Action('ExitAction2',ActionType.RAISE_EVENT);

        state.entry = [entryAction1, entryAction2];
        state.while = [whileAction1, whileAction2];
        state.after = [afterAction1, afterAction2];
        state.exit = [exitAction1, exitAction2];

        const newEntryAction = new Action('NewEntryAction',ActionType.RAISE_EVENT);
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
});