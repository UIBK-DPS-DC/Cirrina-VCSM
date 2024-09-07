import ActionService from "../src/services/actionService";
import Action from "../src/classes/action";
import {ActionCategory, ActionType} from "../src/enums";
import {CsmNodeProps} from "../src/types";
import State from "../src/classes/state";

let service: ActionService;

beforeEach(() => {
    // Reset the service before each test
    service = new ActionService();
});

describe('ActionService', () => {

    test('registerName should register a unique action name', () => {
        const name = 'uniqueAction';
        const newAction = new Action(name,ActionType.INVOKE)
        const result = service.registerName(name, newAction);
        expect(result).toBe(true);
        expect(service.isNameUnique(name)).toBe(false); // Now the name is not unique
    });

    test('registerName should not register a duplicate action name', () => {
        const name = 'duplicateAction';
        const newAction = new Action(name,ActionType.INVOKE)
        service.registerName(name,newAction);
        const result = service.registerName(name,newAction);
        expect(result).toBe(false);
    });

    test('unregisterName should remove a registered action name', () => {
        const name = 'actionToRemove';
        const newAction = new Action(name,ActionType.INVOKE)
        service.registerName(name,newAction);
        service.unregisterName(name);
        expect(service.isNameUnique(name)).toBe(true); // Now the name is unique
    });

    test('unregisterName should do nothing if the action name is not registered', () => {
        const name = 'nonExistentAction';
        service.unregisterName(name); // Should do nothing
        expect(service.isNameUnique(name)).toBe(true); // Still unique
    });

    test('unregisterName should log a warning for invalid name type', () => {
        console.warn = jest.fn(); // Mock console.warn
        service.unregisterName(123); // Invalid name type
        expect(console.warn).toHaveBeenCalledWith("Invalid name type: unable to unregister", 123);
    });

    test('isNameUnique should return true for a unique action name', () => {
        const name = 'uniqueAction';
        const result = service.isNameUnique(name);
        expect(result).toBe(true);
    });

    test('isNameUnique should return false for a non-unique action name', () => {
        const name = 'nonUniqueAction';
        const newAction = new Action(name,ActionType.INVOKE)
        service.registerName(name,newAction);
        const result = service.isNameUnique(name);
        expect(result).toBe(false);
    });

    test('getAllActionNames should return an empty array if no actions are registered', () => {
        const actionNames = service.getAllActionNames();
        expect(actionNames).toEqual([]); // Expecting an empty array
    });

    test('getAllActionNames should return an array of all registered action names', () => {
        const action1 = new Action('action1', ActionType.INVOKE);
        const action2 = new Action('action2', ActionType.INVOKE);

        service.registerName('action1', action1);
        service.registerName('action2', action2);

        const actionNames = service.getAllActionNames();
        expect(actionNames).toContain('action1');
        expect(actionNames).toContain('action2');
        expect(actionNames.length).toBe(2); // Expecting exactly 2 actions
    });

    test('getActionByName should return the correct action for a registered name', () => {
        const action = new Action('action1', ActionType.INVOKE);
        service.registerName('action1', action);

        const retrievedAction = service.getActionByName('action1');
        expect(retrievedAction).toBe(action);
    });

    test('getActionByName should return undefined for a non-existent action name', () => {
        console.error = jest.fn(); // Mock console.error
        const retrievedAction = service.getActionByName('nonExistentAction');
        expect(retrievedAction).toBeUndefined();
        expect(console.error).toHaveBeenCalledWith('No action named nonExistentAction found!');
    });


});

describe("ActionService - getActionCategory", () => {
    let actionService: ActionService;
    let mockAction: Action;
    let mockState: State;
    let data: CsmNodeProps;

    beforeEach(() => {
        actionService = new ActionService();
        mockAction = new Action("TestAction", ActionType.RAISE_EVENT); // Create a test action with ActionType
        mockState = new State("TestState");
        data = {
            state: mockState, // Set the state in CsmNodeProps data
        };
    });

    test("should return ENTRY_ACTION when the action is in the entry array", () => {
        mockState.entry.push(mockAction); // Add action to entry array

        const result = actionService.getActionCategory(mockAction, data);

        expect(result).toBe(ActionCategory.ENTRY_ACTION);
    });

    test("should return EXIT_ACTION when the action is in the exit array", () => {
        mockState.exit.push(mockAction); // Add action to exit array

        const result = actionService.getActionCategory(mockAction, data);

        expect(result).toBe(ActionCategory.EXIT_ACTION);
    });

    test("should return WHILE_ACTION when the action is in the while array", () => {
        mockState.while.push(mockAction); // Add action to while array

        const result = actionService.getActionCategory(mockAction, data);

        expect(result).toBe(ActionCategory.WHILE_ACTION);
    });

    test("should return TIMEOUT when the action is in the after array", () => {
        mockState.after.push(mockAction); // Add action to after array

        const result = actionService.getActionCategory(mockAction, data);

        expect(result).toBe(ActionCategory.TIMEOUT);
    });

    test("should return undefined if the action is not in any of the action arrays", () => {
        // Do not add action to any arrays

        const result = actionService.getActionCategory(mockAction, data);

        expect(result).toBeUndefined();
    });

    test("should return undefined if the data does not contain a valid state", () => {
        const invalidData = {}; // Invalid data that does not contain a state

        const result = actionService.getActionCategory(mockAction, invalidData as CsmNodeProps);

        expect(result).toBeUndefined();
    });

    test("should return undefined if the action is not in the state but exists elsewhere", () => {
        const differentAction = new Action("DifferentAction", ActionType.CREATE); // Different action not in mockState
        const result = actionService.getActionCategory(differentAction, data);

        expect(result).toBeUndefined();
    });

    test("should correctly classify multiple actions", () => {
        const anotherAction = new Action("AnotherAction", ActionType.ASSIGN);
        mockState.entry.push(mockAction); // Add mockAction to entry
        mockState.exit.push(anotherAction); // Add anotherAction to exit

        expect(actionService.getActionCategory(mockAction, data)).toBe(ActionCategory.ENTRY_ACTION);
        expect(actionService.getActionCategory(anotherAction, data)).toBe(ActionCategory.EXIT_ACTION);
    });
});

