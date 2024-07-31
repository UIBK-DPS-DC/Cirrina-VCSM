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

        entryAction1 = new Action('EntryAction1',ActionType.ENTRY_ACTION);
        entryAction2 = new Action('EntryAction2',ActionType.ENTRY_ACTION);
        whileAction1 = new Action('WhileAction1',ActionType.WHILE_ACTION);
        whileAction2 = new Action('WhileAction2',ActionType.WHILE_ACTION);
        afterAction1 = new Action('AfterAction1',ActionType.TIMEOUT);
        afterAction2 = new Action('AfterAction2',ActionType.TIMEOUT);
        exitAction1 = new Action('ExitAction1',ActionType.EXIT_ACTION);
        exitAction2 = new Action('ExitAction2',ActionType.EXIT_ACTION);

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
        const newEntryAction = new Action('NewEntryAction',ActionType.ENTRY_ACTION);
        state.entry = [newEntryAction];
        const allActions = state.getAllActions();
        expect(allActions).toEqual([newEntryAction, whileAction1, whileAction2, afterAction1, afterAction2, exitAction1, exitAction2]);
    });
});