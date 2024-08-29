import EventService from "../src/services/eventService";
import Event from "../src/classes/event";
import { EventChannel } from "../src/enums";
import { CsmNodeProps } from "../src/types";
import Action from "../src/classes/action";
import { ActionType } from "../src/enums";
import State from "../src/classes/state";
import StateMachine from "../src/classes/stateMachine";

describe('EventService', () => {
    let eventService: EventService;

    beforeEach(() => {
        eventService = new EventService();
    });

    test('registerEvent should add an event if the name is unique', () => {
        const event = new Event("uniqueEvent", EventChannel.INTERNAL);
        const result = eventService.registerEvent(event);

        expect(result).toBe(true);
        expect(eventService.getAllEvents()).toContain(event);
    });

    test('registerEvent should not add an event if the name already exists', () => {
        const event1 = new Event("duplicateEvent", EventChannel.INTERNAL);
        const event2 = new Event("duplicateEvent", EventChannel.EXTERNAL);

        console.error = jest.fn();  // Mock console.error to verify it gets called

        eventService.registerEvent(event1);
        const result = eventService.registerEvent(event2);

        expect(result).toBe(false);
        expect(eventService.getAllEvents().length).toBe(1);  // Only one event should be registered
        expect(console.error).toHaveBeenCalledWith("Event name already exists!");
    });

    test('unregisterEvent should remove a registered event by name', () => {
        const event = new Event("eventToRemove", EventChannel.GLOBAL);
        eventService.registerEvent(event);

        eventService.unregisterEvent("eventToRemove");
        expect(eventService.getAllEvents().length).toBe(0);  // The event should be removed
    });

    test('unregisterEvent should log a warning if event name is invalid', () => {
        console.warn = jest.fn();  // Mock console.warn to verify it gets called

        eventService.unregisterEvent(123);  // Invalid event name type
        expect(console.warn).toHaveBeenCalledWith("Invalid name type: unable to unregister", 123);
    });

    test('isNameUnique should return true for a unique event name', () => {
        const event = new Event("uniqueEvent", EventChannel.INTERNAL);

        expect(eventService.isNameUnique(event.name)).toBe(true);

        eventService.registerEvent(event);

        expect(eventService.isNameUnique(event.name)).toBe(false);
    });

    test('getAllEvents should return all registered events', () => {
        const event1 = new Event("event1", EventChannel.INTERNAL);
        const event2 = new Event("event2", EventChannel.EXTERNAL);

        eventService.registerEvent(event1);
        eventService.registerEvent(event2);

        const allEvents = eventService.getAllEvents();
        expect(allEvents.length).toBe(2);
        expect(allEvents).toContain(event1);
        expect(allEvents).toContain(event2);
    });

    test('getAllEventsRaised should return unique events raised by actions of type RAISE_EVENT within a state', () => {
        const action1 = new Action("action1", ActionType.RAISE_EVENT);
        const action2 = new Action("action2", ActionType.RAISE_EVENT);
        const action3 = new Action("action3", ActionType.INVOKE); // Different type

        action1.properties = { event: "event1" };
        action2.properties = { event: "event2" };
        action3.properties = { event: "event3" };

        const state = new State("testState");
        state.entry = [action1, action2, action3];

        const data: CsmNodeProps = { state };
        const raisedEvents = eventService.getAllEventsRaised(data);

        expect(raisedEvents.length).toBe(2);
        expect(raisedEvents).toContain("event1");
        expect(raisedEvents).toContain("event2");
    });

    test('getAllEventsRaised should return unique events raised by actions of type RAISE_EVENT within a state machine', () => {
        const action1 = new Action("action1", ActionType.RAISE_EVENT);
        const action2 = new Action("action2", ActionType.RAISE_EVENT);
        const action3 = new Action("action3", ActionType.RAISE_EVENT);

        action1.properties = { event: "event1" };
        action2.properties = { event: "event2" };
        action3.properties = { event: "event1" };  // Duplicate event

        const stateMachine = new StateMachine("testStateMachine");
        stateMachine.actions = [action1, action2, action3];

        const data: CsmNodeProps = { stateMachine };
        const raisedEvents = eventService.getAllEventsRaised(data);

        expect(raisedEvents.length).toBe(2);  // "event1" should only appear once
        expect(raisedEvents).toContain("event1");
        expect(raisedEvents).toContain("event2");
    });
});
