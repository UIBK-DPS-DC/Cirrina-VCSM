import {ActionType, EventChannel} from "../src/enums";
import Action from "../src/classes/action";
import ContextVariable from "../src/classes/contextVariable";
import {RaiseEventActionProps} from "../src/types";
import Event from "../src/classes/event";
import State from "../src/classes/state";
import Transition from "../src/classes/transition";

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

describe("State.getAllRaisedEvents", () => {
    let state: State;

    // Create a reusable event creation function
    const createEvent = (name: string, channel: EventChannel) => new Event(name, channel);

    // Create a reusable raise event action creation function
    const createRaiseEventAction = (eventName: string, channel: EventChannel) => {
        const event = createEvent(eventName, channel);
        const raiseEventProps: RaiseEventActionProps = {
            type: ActionType.RAISE_EVENT,
            event: event,
        };
        const action = new Action("RaiseEventAction", ActionType.RAISE_EVENT, 0);
        action.properties = raiseEventProps; // Assign properties explicitly
        return action;
    };

    beforeEach(() => {
        // Initialize a new State before each test
        state = new State("TestState");
    });

    it("should return an empty array if there are no actions", () => {
        expect(state.getAllRaisedEvents()).toEqual([]);
    });

    it("should return an empty array if there are no RAISE_EVENT actions", () => {
        const action = new Action("NonRaiseEvent", ActionType.ASSIGN, 0);
        state.entry = [action];
        expect(state.getAllRaisedEvents()).toEqual([]);
    });

    it("should return events from RAISE_EVENT actions in the entry phase", () => {
        const event1 = createRaiseEventAction("Event1", EventChannel.INTERNAL);
        const event2 = createRaiseEventAction("Event2", EventChannel.EXTERNAL);
        state.entry = [event1, event2];
        expect(state.getAllRaisedEvents()).toEqual([
            (event1.properties as RaiseEventActionProps).event,
            (event2.properties as RaiseEventActionProps).event,
        ]);
    });

    it("should return events from RAISE_EVENT actions across different phases", () => {
        const event1 = createRaiseEventAction("Event1", EventChannel.INTERNAL);
        const event2 = createRaiseEventAction("Event2", EventChannel.GLOBAL);
        const event3 = createRaiseEventAction("Event3", EventChannel.PERIPHERAL);

        state.entry = [event1];
        state.exit = [event2];
        state.while = [event3];

        const raisedEvents = state.getAllRaisedEvents();

        // Make the test order-agnostic by checking for array containing the expected events
        expect(raisedEvents).toHaveLength(3);
        expect(raisedEvents).toEqual(
            expect.arrayContaining([
                (event1.properties as RaiseEventActionProps).event,
                (event2.properties as RaiseEventActionProps).event,
                (event3.properties as RaiseEventActionProps).event,
            ])
        );
    });

    it("should ignore actions that are not of type RAISE_EVENT", () => {
        const eventAction = createRaiseEventAction("Event1", EventChannel.INTERNAL);
        const nonEventAction = new Action("NonEventAction", ActionType.ASSIGN, 0);

        state.entry = [eventAction, nonEventAction];
        expect(state.getAllRaisedEvents()).toEqual([
            (eventAction.properties as RaiseEventActionProps).event,
        ]);
    });

    it("should handle mixed types of actions and only return RAISE_EVENT events", () => {
        const event1 = createRaiseEventAction("Event1", EventChannel.INTERNAL);
        const event2 = createRaiseEventAction("Event2", EventChannel.EXTERNAL);
        const nonEvent1 = new Action("NonRaiseEvent1", ActionType.CREATE, 0);
        const nonEvent2 = new Action("NonRaiseEvent2", ActionType.TIMEOUT, 0);

        state.entry = [event1, nonEvent1];
        state.exit = [event2, nonEvent2];

        expect(state.getAllRaisedEvents()).toEqual([
            (event1.properties as RaiseEventActionProps).event,
            (event2.properties as RaiseEventActionProps).event,
        ]);
    });

    it("should not modify the state of the actions or events when called", () => {
        const event1 = createRaiseEventAction("Event1", EventChannel.INTERNAL);
        const event2 = createRaiseEventAction("Event2", EventChannel.GLOBAL);

        state.entry = [event1];
        state.exit = [event2];

        const result = state.getAllRaisedEvents();
        expect(result).toEqual([
            (event1.properties as RaiseEventActionProps).event,
            (event2.properties as RaiseEventActionProps).event,
        ]);

        // Verify the original actions are not modified
        expect(state.entry).toHaveLength(1);
        expect(state.exit).toHaveLength(1);
        expect((state.entry[0].properties as RaiseEventActionProps).event.name).toBe("Event1");
        expect((state.exit[0].properties as RaiseEventActionProps).event.name).toBe("Event2");
    });
});

describe("State.getAllConsumedEvents", () => {
    let state: State;

    // Helper function to create a Transition with a specific event
    const createTransitionWithEvent = (eventName: string) => {
        const transition = new Transition("sourceState", "targetState");
        transition.setEvent(eventName);
        return transition;
    };

    beforeEach(() => {
        // Initialize a new State before each test
        state = new State("TestState");
    });

    it("should return an empty array if there are no transitions", () => {
        expect(state.getAllConsumedEvents()).toEqual([]);
    });


    it("should return an array with the correct events when transitions have events", () => {
        const transition1 = createTransitionWithEvent("Event1");
        const transition2 = createTransitionWithEvent("Event2");

        state.on = [transition1, transition2];

        expect(state.getAllConsumedEvents()).toEqual(["Event1", "Event2"]);
    });

    it("should handle transitions with empty string events gracefully", () => {
        const transition1 = createTransitionWithEvent("");
        const transition2 = createTransitionWithEvent("Event2");

        state.on = [transition1, transition2];

        expect(state.getAllConsumedEvents()).toEqual(["Event2"]);
    });

    it("should handle mixed events correctly across multiple transitions", () => {
        const transition1 = createTransitionWithEvent("Event1");
        const transition2 = createTransitionWithEvent("");
        const transition3 = createTransitionWithEvent("Event3");

        state.on = [transition1, transition2, transition3];

        expect(state.getAllConsumedEvents()).toEqual(["Event1", "Event3"]);
    });

    it("should not modify the transitions or their events when called", () => {
        const transition1 = createTransitionWithEvent("Event1");
        const transition2 = createTransitionWithEvent("Event2");

        state.on = [transition1, transition2];

        const result = state.getAllConsumedEvents();

        expect(result).toEqual(["Event1", "Event2"]);

        // Ensure the original transitions are not modified
        expect(state.on[0].getEvent()).toBe("Event1");
        expect(state.on[1].getEvent()).toBe("Event2");
    });

    it("should work with a large number of transitions", () => {
        const transitions = Array.from({ length: 100 }, (_, i) =>
            createTransitionWithEvent(`Event${i}`)
        );

        state.on = transitions;

        const expectedEvents = transitions.map((t) => t.getEvent());
        expect(state.getAllConsumedEvents()).toEqual(expectedEvents);
    });

    it("should handle transitions with duplicate events", () => {
        const transition1 = createTransitionWithEvent("DuplicateEvent");
        const transition2 = createTransitionWithEvent("DuplicateEvent");

        state.on = [transition1, transition2];

        expect(state.getAllConsumedEvents()).toEqual(["DuplicateEvent", "DuplicateEvent"]);
    });

    it("should handle transitions that have events modified after being added to the state", () => {
        const transition1 = createTransitionWithEvent("InitialEvent");

        state.on = [transition1];

        // Modify the event after adding to the state
        transition1.setEvent("ModifiedEvent");

        expect(state.getAllConsumedEvents()).toEqual(["ModifiedEvent"]);
    });
});
