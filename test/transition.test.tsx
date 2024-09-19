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


    test('should add and retrieve actions correctly', () => {
        const action1 = new Action('action1', ActionType.RAISE_EVENT);
        const action2 = new Action('action2', ActionType.RAISE_EVENT);

        transition.setActions([action1, action2]);

        expect(transition.getActions()).toEqual([action1, action2]);
    });

});



describe('Transition class', () => {
    let transition: Transition;

    beforeEach(() => {
        transition = new Transition('sourceState', 'targetState');
    });

    it('should initialize with correct source and target states', () => {
        expect(transition.getSource()).toBe('sourceState');
        expect(transition.getTarget()).toBe('targetState');
    });

    it('should allow setting and getting the source and target', () => {
        transition.setSource('newSource');
        transition.setTarget('newTarget');
        expect(transition.getSource()).toBe('newSource');
        expect(transition.getTarget()).toBe('newTarget');
    });

    it('should have a unique ID', () => {
        const anotherTransition = new Transition('sourceA', 'targetB');
        expect(transition.getId()).not.toBe(anotherTransition.getId());
    });

    it('should initialize with empty guards, actions, else, and event', () => {
        expect(transition.getGuards()).toEqual([]);
        expect(transition.getActions()).toEqual([]);
        expect(transition.getElse()).toEqual([]);
        expect(transition.getEvent()).toBe('');
    });

    it('should add and remove guards', () => {
        const guard1 = new Guard('guard1');
        const guard2 = new Guard('guard2');

        transition.addGuard(guard1);
        transition.addGuard(guard2);
        expect(transition.getGuards()).toEqual([guard1, guard2]);

        transition.removeGuard(guard1);
        expect(transition.getGuards()).toEqual([guard2]);
    });

    it('should not add duplicate guards', () => {
        const guard1 = new Guard('guard1');
        jest.spyOn(console, 'warn').mockImplementation(() => {});  // Suppress console.warn during test

        transition.addGuard(guard1);
        transition.addGuard(guard1);  // Try adding it again

        expect(transition.getGuards()).toEqual([guard1]);
    });

    it('should set and get actions', () => {
        const action1 = new Action('action1', ActionType.RAISE_EVENT);
        const action2 = new Action('action2', ActionType.CREATE);

        transition.setActions([action1, action2]);
        expect(transition.getActions()).toEqual([action1, action2]);
    });

    it('should set and get else actions', () => {
        const elseActions = ['else1', 'else2'];

        transition.setElse(elseActions);
        expect(transition.getElse()).toEqual(elseActions);
    });

    it('should set and get events', () => {
        transition.setEvent('onEvent');
        expect(transition.getEvent()).toBe('onEvent');
    });

});

describe('Transition class - addGuard and removeGuard', () => {
    let transition: Transition;
    let guard1: Guard;
    let guard2: Guard;

    beforeEach(() => {
        transition = new Transition('sourceState', 'targetState');
        guard1 = new Guard('guard1');
        guard2 = new Guard('guard2');
    });

    describe('addGuard functionality', () => {
        it('should add a new guard to the transition', () => {
            transition.addGuard(guard1);
            expect(transition.getGuards()).toContain(guard1);
            expect(transition.getGuards().length).toBe(1);
        });

        it('should add multiple unique guards to the transition', () => {
            transition.addGuard(guard1);
            transition.addGuard(guard2);
            expect(transition.getGuards()).toContain(guard1);
            expect(transition.getGuards()).toContain(guard2);
            expect(transition.getGuards().length).toBe(2);
        });

        it('should not add a duplicate guard (same guard object)', () => {
            jest.spyOn(console, 'warn').mockImplementation(() => {});  // Suppress console.warn during test
            transition.addGuard(guard1);
            transition.addGuard(guard1);  // Adding the same guard again
            expect(transition.getGuards()).toEqual([guard1]);
        });

        it('should not add a guard with the same name but different reference', () => {
            const guard1Duplicate = new Guard('guard1');
            jest.spyOn(console, 'warn').mockImplementation(() => {});
            transition.addGuard(guard1);
            transition.addGuard(guard1Duplicate);  // Different object but same name
            expect(transition.getGuards().length).toBe(1);
        });

        it('should allow adding guards with different names', () => {
            const guard3 = new Guard('guard3');
            transition.addGuard(guard1);
            transition.addGuard(guard2);
            transition.addGuard(guard3);
            expect(transition.getGuards().length).toBe(3);
            expect(transition.getGuards()).toContain(guard3);
        });
    });

    describe('removeGuard functionality', () => {
        beforeEach(() => {
            transition.addGuard(guard1);
            transition.addGuard(guard2);
        });

        it('should remove a guard from the transition', () => {
            transition.removeGuard(guard1);
            expect(transition.getGuards()).not.toContain(guard1);
            expect(transition.getGuards()).toContain(guard2);
            expect(transition.getGuards().length).toBe(1);
        });

        it('should not fail when removing a guard that does not exist', () => {
            const guard3 = new Guard('guard3');
            transition.removeGuard(guard3);  // This guard was never added
            expect(transition.getGuards()).toEqual([guard1, guard2]);  // Nothing should change
        });

        it('should handle removing multiple guards', () => {
            transition.removeGuard(guard1);
            transition.removeGuard(guard2);
            expect(transition.getGuards().length).toBe(0);
        });

        it('should not remove guards with the same name but different reference', () => {
            const guard1Duplicate = new Guard('guard1');
            transition.removeGuard(guard1Duplicate);  // Same name, but different reference
            expect(transition.getGuards()).toContain(guard1);  // Original guard1 should still exist
            expect(transition.getGuards().length).toBe(2);
        });
    });

    describe('edge cases for guards', () => {
        it('should allow adding unnamed guards', () => {
            const unnamedGuard = new Guard('');
            transition.addGuard(unnamedGuard);
            expect(transition.getGuards()).toContain(unnamedGuard);
        });

        it('should not remove unnamed guards with different references', () => {
            const unnamedGuard1 = new Guard('');
            const unnamedGuard2 = new Guard('');

            transition.addGuard(unnamedGuard1);
            transition.removeGuard(unnamedGuard2);  // Different unnamed guard

            expect(transition.getGuards()).toContain(unnamedGuard1);  // Original unnamed guard should still exist
            expect(transition.getGuards().length).toBe(1);
        });

        it('should allow removing unnamed guards by reference', () => {
            const unnamedGuard = new Guard('');
            transition.addGuard(unnamedGuard);
            transition.removeGuard(unnamedGuard);
            expect(transition.getGuards()).not.toContain(unnamedGuard);
        });
    });
});

describe('Transition Class - addAction and removeAction Methods', () => {
    let transition: Transition;
    let action1: Action;
    let action2: Action;

    beforeEach(() => {
        transition = new Transition('state1', 'state2');
        action1 = new Action('action1', ActionType.RAISE_EVENT);
        action2 = new Action('action2', ActionType.ASSIGN);
    });

    describe('addAction', () => {
        it('should add an action to the transition', () => {
            transition.addAction(action1);
            expect(transition.getActions()).toContain(action1);
        });

        it('should add multiple actions to the transition', () => {
            transition.addAction(action1);
            transition.addAction(action2);
            expect(transition.getActions()).toContain(action1);
            expect(transition.getActions()).toContain(action2);
        });

        it('should not add the same action more than once (by reference)', () => {
            transition.addAction(action1);
            transition.addAction(action1); // Adding the same action again
            expect(transition.getActions()).toEqual([action1]); // Should only have one instance of action1
        });
    });

    describe('removeAction', () => {
        it('should remove an action from the transition', () => {
            transition.addAction(action1);
            transition.removeAction(action1);
            expect(transition.getActions()).not.toContain(action1);
        });

        it('should only remove the specified action', () => {
            transition.addAction(action1);
            transition.addAction(action2);
            transition.removeAction(action1);
            expect(transition.getActions()).not.toContain(action1);
            expect(transition.getActions()).toContain(action2);
        });

        it('should do nothing if the action to be removed is not present', () => {
            transition.addAction(action1);
            transition.removeAction(action2); // action2 is not in the list
            expect(transition.getActions()).toContain(action1);
            expect(transition.getActions()).not.toContain(action2);
        });

        it('should handle removing actions correctly when there are multiple instances (different references)', () => {
            const action3 = new Action('action1', ActionType.RAISE_EVENT); // Different instance with the same name
            transition.addAction(action1);
            transition.addAction(action3);

            transition.removeAction(action1); // Only removes the first instance
            expect(transition.getActions()).toContain(action3);
            expect(transition.getActions()).not.toContain(action1);
        });
    });
});

