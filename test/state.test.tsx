import State from "../src/classes/state";
import Action from "../src/classes/action";
import {ActionType} from "../src/enums";
import Transition from "../src/classes/transition";

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

    test('should return an empty object from toDICT if no actions or transitions are set', () => {
        const dict = state.toDICT();
        expect(dict).toEqual({});
    });

    test('should return a correct dictionary representation from toDICT', () => {
        const action1 = new Action('action1', ActionType.RAISE_EVENT);
        const action2 = new Action('action2', ActionType.RAISE_EVENT);
        state.entry = [action1];
        state.exit = [action2];

        const transition1 = new Transition('source1', 'target1');
        state.addOnTransition(transition1);

        const dict = state.toDICT();
        expect(dict).toEqual({
            entry: [action1.toDICT()],
            exit: [action2.toDICT()],
            on: [transition1.toDICT()],
        });
    });

    test('should not add duplicate transitions to the "on" array', () => {
        const transition1 = new Transition('source1', 'target1');
        state.addOnTransition(transition1);
        state.addOnTransition(transition1);

        expect(state.on.length).toBe(1);
    });

    test('should handle complex toDICT cases with multiple actions and transitions', () => {
        const action1 = new Action('action1', ActionType.RAISE_EVENT);
        const action2 = new Action('action2', ActionType.RAISE_EVENT);
        state.entry = [action1];
        state.while = [action2];

        const transition1 = new Transition('source1', 'target1');
        const transition2 = new Transition('source2', 'target2');
        state.addOnTransition(transition1);
        state.addOnTransition(transition2);

        const dict = state.toDICT();
        expect(dict).toEqual({
            entry: [action1.toDICT()],
            while: [action2.toDICT()],
            on: [transition1.toDICT(), transition2.toDICT()],
        });
    });
});