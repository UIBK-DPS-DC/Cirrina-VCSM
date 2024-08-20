import Transition from "../src/classes/transition";
import Guard from "../src/classes/guard";
import Action from "../src/classes/action";
import { ActionType } from "../src/enums";

describe('Transition', () => {
    let transition: Transition;

    beforeEach(() => {
        transition = new Transition('sourceState', 'targetState');
    });

    test('should initialize with the correct source and target', () => {
        expect(transition.getSource()).toBe('sourceState');
        expect(transition.getTarget()).toBe('targetState');
    });

    test('should set and get source and target correctly', () => {
        transition.setSource('newSource');
        transition.setTarget('newTarget');
        expect(transition.getSource()).toBe('newSource');
        expect(transition.getTarget()).toBe('newTarget');
    });

    test('should return a unique ID for each transition', () => {
        const transition1 = new Transition('source1', 'target1');
        const transition2 = new Transition('source2', 'target2');
        expect(transition1.getId()).not.toBe(transition2.getId());
    });

    test('should add guards and avoid duplicates', () => {
        const guard1 = new Guard('expression1', 'guard1');
        const guard2 = new Guard('expression2', 'guard2');
        const duplicateGuard = new Guard('expression1', 'guard1');

        transition.addGuard(guard1);
        transition.addGuard(guard2);
        transition.addGuard(duplicateGuard); // Should not be added

        expect(transition.getGuards()).toEqual([guard1, guard2]);
    });

    test('should filter and return only named guards', () => {
        const guard1 = new Guard('expression1', 'guard1');
        const guard2 = new Guard('expression2'); // No name
        const guard3 = new Guard('expression3', 'guard3');

        transition.setGuards([guard1, guard2, guard3]);

        expect(transition.getAllNamedGuards()).toEqual([guard1, guard3]);
    });

    test('should return correct string representation of guards', () => {
        const guard1 = new Guard('expression1', 'guard1');
        const guard2 = new Guard('expression2'); // No name, should return expression

        transition.setGuards([guard1, guard2]);

        expect(transition.toDICT()).toEqual({
            [transition.getEvent()]: transition.getTarget(),
            guard: ['guard1', 'expression2']
        });
    });

    test('should add and retrieve actions correctly', () => {
        const action1 = new Action('action1', ActionType.RAISE_EVENT);
        const action2 = new Action('action2', ActionType.RAISE_EVENT);

        transition.setActions([action1, action2]);

        expect(transition.getActions()).toEqual([action1, action2]);
    });

    test('should return a correct dictionary representation with actions and guards', () => {
        const action1 = new Action('action1', ActionType.RAISE_EVENT);
        const guard1 = new Guard('expression1', 'guard1');

        transition.setActions([action1]);
        transition.addGuard(guard1);

        const dict = transition.toDICT();
        expect(dict).toEqual({
            [transition.getEvent()]: transition.getTarget(),
            guard: ['guard1']
        });
    });

    test('should return an empty dictionary if no event and guards are set', () => {
        const dict = transition.toDICT();
        expect(dict).toEqual({ [transition.getEvent()]: transition.getTarget() });
    });

    test('should handle complex toDICT cases with multiple guards and actions', () => {
        const action1 = new Action('action1', ActionType.RAISE_EVENT);
        const guard1 = new Guard('expression1', 'guard1');
        const guard2 = new Guard('expression2');

        transition.setActions([action1]);
        transition.setGuards([guard1, guard2]);

        const dict = transition.toDICT();
        expect(dict).toEqual({
            [transition.getEvent()]: transition.getTarget(),
            guard: ['guard1', 'expression2']
        });
    });
});
