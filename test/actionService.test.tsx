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

describe('ActionService - Register and Deregister Actions', () => {
    let actionService: ActionService;

    beforeEach(() => {
        actionService = new ActionService();
    });

    test('registerAction should correctly register an action with a valid type', () => {
        const action = new Action('TestAction', ActionType.INVOKE);

        actionService.registerAction(action);

        const actionsArray = actionService['typeToActionsMap'].get(ActionType.INVOKE);
        expect(actionsArray).toContain(action); // The action should be in the map under the correct type
    });

    test('registerAction should log error when action has no type', () => {
        const action = new Action('TestAction', undefined as unknown as ActionType); // Action with no type

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        actionService.registerAction(action);

        expect(consoleSpy).toHaveBeenCalledWith('Action does not have a type');
        consoleSpy.mockRestore();
    });

    test('deregisterAction should remove an action from the corresponding type array', () => {
        const action = new Action('TestAction', ActionType.INVOKE);

        // First register the action
        actionService.registerAction(action);

        // Then deregister the action
        actionService.deregisterAction(action);

        const actionsArray = actionService['typeToActionsMap'].get(ActionType.INVOKE);
        expect(actionsArray).not.toContain(action); // The action should be removed
    });

    test('deregisterAction should log an error when the action type does not exist', () => {
        const action = new Action('TestAction', undefined as unknown as ActionType); // Action with no type

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        actionService.deregisterAction(action);

        expect(consoleSpy).toHaveBeenCalledWith('Action does not have a type');
        consoleSpy.mockRestore();
    });


    test('registerAction should handle registering multiple actions of the same type', () => {
        const action1 = new Action('TestAction1', ActionType.INVOKE);
        const action2 = new Action('TestAction2', ActionType.INVOKE);

        actionService.registerAction(action1);
        actionService.registerAction(action2);

        const actionsArray = actionService['typeToActionsMap'].get(ActionType.INVOKE);
        expect(actionsArray).toContain(action1);
        expect(actionsArray).toContain(action2);
    });

    test('deregisterAction should remove the correct action when multiple actions of the same type exist', () => {
        const action1 = new Action('TestAction1', ActionType.INVOKE);
        const action2 = new Action('TestAction2', ActionType.INVOKE);

        actionService.registerAction(action1);
        actionService.registerAction(action2);

        // Deregister the first action
        actionService.deregisterAction(action1);

        const actionsArray = actionService['typeToActionsMap'].get(ActionType.INVOKE);
        expect(actionsArray).not.toContain(action1);
        expect(actionsArray).toContain(action2); // Only action2 should remain
    });
});

describe("ActionService - getActionsByType", () => {
    let actionService: ActionService;

    beforeEach(() => {
        actionService = new ActionService();
    });

    test("should return an empty array if no actions of the given type exist", () => {
        const result = actionService.getActionsByType(ActionType.INVOKE);
        expect(result).toEqual([]);
    });

    test("should return actions of a given type when they exist", () => {
        const action1 = new Action("Action1", ActionType.INVOKE);
        const action2 = new Action("Action2", ActionType.INVOKE);

        actionService.registerAction(action1);
        actionService.registerAction(action2);

        const result = actionService.getActionsByType(ActionType.INVOKE);
        expect(result).toContain(action1);
        expect(result).toContain(action2);
        expect(result.length).toBe(2);
    });

    test("should only return actions of the requested type", () => {
        const action1 = new Action("Action1", ActionType.INVOKE);
        const action2 = new Action("Action2", ActionType.CREATE);

        actionService.registerAction(action1);
        actionService.registerAction(action2);

        const invokeActions = actionService.getActionsByType(ActionType.INVOKE);
        expect(invokeActions).toContain(action1);
        expect(invokeActions).not.toContain(action2);
        expect(invokeActions.length).toBe(1);

        const createActions = actionService.getActionsByType(ActionType.CREATE);
        expect(createActions).toContain(action2);
        expect(createActions).not.toContain(action1);
        expect(createActions.length).toBe(1);
    });

    test("should return an empty array for an ActionType with no registered actions", () => {
        const action1 = new Action("Action1", ActionType.RAISE_EVENT);
        actionService.registerAction(action1);

        const result = actionService.getActionsByType(ActionType.INVOKE);
        expect(result).toEqual([]);
    });

    test("should handle multiple actions of different types", () => {
        const action1 = new Action("Action1", ActionType.INVOKE);
        const action2 = new Action("Action2", ActionType.CREATE);
        const action3 = new Action("Action3", ActionType.ASSIGN);

        actionService.registerAction(action1);
        actionService.registerAction(action2);
        actionService.registerAction(action3);

        const invokeActions = actionService.getActionsByType(ActionType.INVOKE);
        expect(invokeActions.length).toBe(1);
        expect(invokeActions).toContain(action1);

        const createActions = actionService.getActionsByType(ActionType.CREATE);
        expect(createActions.length).toBe(1);
        expect(createActions).toContain(action2);

        const assignActions = actionService.getActionsByType(ActionType.ASSIGN);
        expect(assignActions.length).toBe(1);
        expect(assignActions).toContain(action3);
    });

    test("should not return actions of unrelated types", () => {
        const action1 = new Action("Action1", ActionType.LOCK);
        const action2 = new Action("Action2", ActionType.UNLOCK);

        actionService.registerAction(action1);
        actionService.registerAction(action2);

        const result = actionService.getActionsByType(ActionType.TIMEOUT);
        expect(result).toEqual([]);
    });

    test("should return actions correctly even after deregistering an action", () => {
        const action1 = new Action("Action1", ActionType.INVOKE);
        const action2 = new Action("Action2", ActionType.INVOKE);

        actionService.registerAction(action1);
        actionService.registerAction(action2);
        actionService.deregisterAction(action1);

        const result = actionService.getActionsByType(ActionType.INVOKE);
        expect(result).toContain(action2);
        expect(result).not.toContain(action1);
        expect(result.length).toBe(1);
    });

    test("should return an empty array if all actions of a type have been deregistered", () => {
        const action1 = new Action("Action1", ActionType.INVOKE);
        const action2 = new Action("Action2", ActionType.INVOKE);

        actionService.registerAction(action1);
        actionService.registerAction(action2);
        actionService.deregisterAction(action1);
        actionService.deregisterAction(action2);

        const result = actionService.getActionsByType(ActionType.INVOKE);
        expect(result).toEqual([]);
    });

    test("should return empty array for an invalid action type", () => {
        const result = actionService.getActionsByType("INVALID_TYPE" as ActionType);
        expect(result).toEqual([]);
    });

    test("should correctly handle registering multiple actions of the same type", () => {
        const action1 = new Action("Action1", ActionType.INVOKE);
        const action2 = new Action("Action2", ActionType.INVOKE);
        const action3 = new Action("Action3", ActionType.INVOKE);

        actionService.registerAction(action1);
        actionService.registerAction(action2);
        actionService.registerAction(action3);

        const invokeActions = actionService.getActionsByType(ActionType.INVOKE);
        expect(invokeActions.length).toBe(3);
        expect(invokeActions).toContain(action1);
        expect(invokeActions).toContain(action2);
        expect(invokeActions).toContain(action3);
    });
});


