import State from "../src/classes/state";
import Action from "../src/classes/action";
import {ActionType} from "../src/enums";

describe('State Class', () => {
    let state: State;
    let entryAction1: Action, entryAction2: Action;
    let whileAction1: Action, whileAction2: Action;
    let afterAction1: Action, afterAction2: Action;
    let exitAction1: Action, exitAction2: Action;

    beforeEach(() => {
        state = new State('TestState');

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
    });

    test('should return all actions in the correct order', () => {
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
        const newEntryAction = new Action('NewEntryAction',ActionType.RAISE_EVENT);
        state.entry = [newEntryAction];
        const allActions = state.getAllActions();
        expect(allActions).toEqual([newEntryAction, whileAction1, whileAction2, afterAction1, afterAction2, exitAction1, exitAction2]);
    });
});