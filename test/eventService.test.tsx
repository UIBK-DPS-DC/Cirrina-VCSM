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

    test('should return an event if it exists', () => {
        // Create and register an event
        const event = new Event('testEvent', EventChannel.INTERNAL);
        eventService.registerEvent(event);

        // Retrieve the event by name
        const retrievedEvent = eventService.getEventByName('testEvent');
        expect(retrievedEvent).toBeDefined();
        expect(retrievedEvent?.name).toBe('testEvent');
        expect(retrievedEvent?.channel).toBe(EventChannel.INTERNAL);
    });

    test('should return undefined if event does not exist', () => {
        // Attempt to retrieve an event that doesn't exist
        const retrievedEvent = eventService.getEventByName('nonExistentEvent');
        expect(retrievedEvent).toBeUndefined();
    });

    test('should return undefined if name is an empty string', () => {
        // Attempt to retrieve an event with an empty name
        const retrievedEvent = eventService.getEventByName('');
        expect(retrievedEvent).toBeUndefined();
    });

    test('should retrieve the correct event when multiple events exist', () => {
        // Register multiple events
        const event1 = new Event('event1', EventChannel.INTERNAL);
        const event2 = new Event('event2', EventChannel.EXTERNAL);
        eventService.registerEvent(event1);
        eventService.registerEvent(event2);

        // Retrieve specific event by name
        const retrievedEvent = eventService.getEventByName('event2');
        expect(retrievedEvent).toBeDefined();
        expect(retrievedEvent?.name).toBe('event2');
        expect(retrievedEvent?.channel).toBe(EventChannel.EXTERNAL);
    });

});

describe('Get Event Tests', () => {
    let eventService: EventService;

    beforeEach(() => {
        eventService = new EventService();
    });

    test('getAllEvents should return all registered events', () => {
        const event1 = new Event('event1', EventChannel.INTERNAL);
        const event2 = new Event('event2', EventChannel.EXTERNAL);

        eventService.registerEvent(event1);
        eventService.registerEvent(event2);

        const allEvents = eventService.getAllEvents();

        expect(allEvents.length).toBe(2);
        expect(allEvents).toEqual(expect.arrayContaining([event1, event2]));
    });

    test('getAllInternalEvents should return only internal events', () => {
        const internalEvent = new Event('internalEvent', EventChannel.INTERNAL);
        const externalEvent = new Event('externalEvent', EventChannel.EXTERNAL);

        eventService.registerEvent(internalEvent);
        eventService.registerEvent(externalEvent);

        const internalEvents = eventService.getAllInternalEvents();

        expect(internalEvents.length).toBe(1);
        expect(internalEvents[0]).toEqual(internalEvent);
    });

    test('getAllExternalEvents should return only external events', () => {
        const externalEvent = new Event('externalEvent', EventChannel.EXTERNAL);
        const internalEvent = new Event('internalEvent', EventChannel.INTERNAL);

        eventService.registerEvent(externalEvent);
        eventService.registerEvent(internalEvent);

        const externalEvents = eventService.getAllExternalEvents();

        expect(externalEvents.length).toBe(1);
        expect(externalEvents[0]).toEqual(externalEvent);
    });

    test('getAllGlobalEvents should return only global events', () => {
        const globalEvent = new Event('globalEvent', EventChannel.GLOBAL);
        const peripheralEvent = new Event('peripheralEvent', EventChannel.PERIPHERAL);

        eventService.registerEvent(globalEvent);
        eventService.registerEvent(peripheralEvent);

        const globalEvents = eventService.getAllGlobalEvents();

        expect(globalEvents.length).toBe(1);
        expect(globalEvents[0]).toEqual(globalEvent);
    });

    test('getAllPeripheralEvents should return only peripheral events', () => {
        const peripheralEvent = new Event('peripheralEvent', EventChannel.PERIPHERAL);
        const globalEvent = new Event('globalEvent', EventChannel.GLOBAL);

        eventService.registerEvent(peripheralEvent);
        eventService.registerEvent(globalEvent);

        const peripheralEvents = eventService.getAllPeripheralEvents();

        expect(peripheralEvents.length).toBe(1);
        expect(peripheralEvents[0]).toEqual(peripheralEvent);
    });

    test('getAllEvents should return an empty array when no events are registered', () => {
        const allEvents = eventService.getAllEvents();
        expect(allEvents).toEqual([]);
    });

    test('getAllInternalEvents should return an empty array when no internal events are registered', () => {
        const internalEvents = eventService.getAllInternalEvents();
        expect(internalEvents).toEqual([]);
    });

    test('getAllExternalEvents should return an empty array when no external events are registered', () => {
        const externalEvents = eventService.getAllExternalEvents();
        expect(externalEvents).toEqual([]);
    });

    test('getAllGlobalEvents should return an empty array when no global events are registered', () => {
        const globalEvents = eventService.getAllGlobalEvents();
        expect(globalEvents).toEqual([]);
    });

    test('getAllPeripheralEvents should return an empty array when no peripheral events are registered', () => {
        const peripheralEvents = eventService.getAllPeripheralEvents();
        expect(peripheralEvents).toEqual([]);
    });
});
