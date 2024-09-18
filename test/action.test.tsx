import {ActionType} from "../src/enums";
import Action from "../src/classes/action";
import ContextVariable from "../src/classes/contextVariable";

describe('Action class', () => {
    let action: Action;

    beforeEach(() => {
        action = new Action('testAction', ActionType.RAISE_EVENT, 500);
    });

    it('should initialize with correct name, type, and delay', () => {
        expect(action.name).toBe('testAction');
        expect(action.type).toBe(ActionType.RAISE_EVENT);
        expect(action.delay).toBe(500);
    });

    it('should set and get name, type, and delay', () => {
        action.name = 'newAction';
        action.type = ActionType.CREATE;
        action.delay = 1000;

        expect(action.name).toBe('newAction');
        expect(action.type).toBe(ActionType.CREATE);
        expect(action.delay).toBe(1000);
    });

    it('should set and get properties', () => {
        const properties = { someProp: 'value' };
        action.properties = properties;

        expect(action.properties).toEqual(properties);
    });

    it('should set and get context', () => {
        const contextVariable = new ContextVariable('variable1', "a");
        action.context = [contextVariable];

        expect(action.context).toEqual([contextVariable]);
    });

    it('should set and get case', () => {
        action.case = 'case1';
        expect(action.case).toBe('case1');
    });

    it('should compare equality based on name', () => {
        const anotherAction = new Action('testAction', ActionType.CREATE);

        expect(action.equals(anotherAction)).toBe(true);
    });

    it('should compare equality by reference when no name is present', () => {
        const unnamedAction1 = new Action('', ActionType.RAISE_EVENT);
        const unnamedAction2 = unnamedAction1;
        const anotherUnnamedAction = new Action('', ActionType.RAISE_EVENT);

        expect(unnamedAction1.equals(unnamedAction2)).toBe(true);
        expect(unnamedAction1.equals(anotherUnnamedAction)).toBe(false);
    });

    it('should generate the correct action description for RAISE_EVENT', () => {
        const raiseEventProps = {
            event: { toDescription: () => ({ name: 'event1' }) },
        };
        action.properties = raiseEventProps;

        const description = action.toDescription();
        expect(description).toEqual({
            event: { name: 'event1' },
            type: ActionType.RAISE_EVENT,
        });
    });

    it('should generate the correct action description for TIMEOUT', () => {
        const timeoutActionProps = {
            action: { toDescription: () => ({ name: 'timeoutAction' }) },
            delay: 500,
            name: 'timeoutName',
        };
        action.type = ActionType.TIMEOUT;
        action.properties = timeoutActionProps;

        const description = action.toDescription();
        expect(description).toEqual({
            action: { name: 'timeoutAction' },
            delay: 500,
            name: 'timeoutName',
            type: ActionType.TIMEOUT,
        });
    });

});
