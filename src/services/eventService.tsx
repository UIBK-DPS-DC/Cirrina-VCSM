import {CsmNodeProps, isState, isStateMachine} from "../types.ts";
import Action from "../classes/action.ts";
import Event from "../classes/event.ts";
import {ActionType, EventChannel} from "../enums.ts";

export default class EventService {
    private nameToEventMap: Map<string,Event>;

    public constructor() {
        this.nameToEventMap = new Map<string,Event>();
    }

    /**
     * Registers a new event in the system.
     *
     * This method attempts to add a new event to the `nameToEventMap` if the event name is unique.
     * It first checks whether an event with the same name already exists using the `isNameUnique` method.
     * If the name is not unique, it logs an error to the console and returns `false`.
     * If the name is unique, it stores the event in the `nameToEventMap` and logs a confirmation message.
     *
     * @param {Event} event - The event object to be registered.
     * @returns {boolean} - Returns `true` if the event is successfully registered, or `false` if an event with the same name already exists.
     */
    public registerEvent(event: Event): boolean {
        if(!this.isNameUnique(event.name)){
            console.error("Event name already exists!");
            return false;
        }

        this.nameToEventMap.set(event.name,event);
        console.log(event.name + " has been registered!");
        return true;
    }

    /**
     * Unregisters an event name.
     *
     * This method removes the provided `eventName` from the collection of registered names.
     * If the name is not of type `string`, it logs a warning message to the console.
     *
     * @param {string | unknown} eventName - The name of the event to unregister.
     */
    public unregisterEvent(eventName: string | unknown): void {
        if(typeof eventName === "string" ){
            this.nameToEventMap.delete(eventName);
            console.log(eventName + " has been unregistered!");
        }
        else {
            console.warn("Invalid name type: unable to unregister", eventName);
        }

    }

    /**
     * Checks if an event name is unique.
     *
     * This method determines whether the provided `eventName` is unique by checking its
     * presence in the collection of registered names. It returns `true` if the name is
     * not found in the collection, indicating that it is unique. Otherwise, it returns `false`.
     *
     * @param {string} eventName - The name of the event to check for uniqueness.
     * @returns {boolean} - Returns `true` if the name is unique (i.e., not found in the collection),
     *                      otherwise returns `false`.
     */
    public isNameUnique(eventName: string): boolean {
        return ! this.nameToEventMap.has(eventName);
    }

    /**
     * Retrieves all registered events.
     *
     * This method returns an array of all `Event` objects currently registered in the `nameToEventMap`.
     * It converts the values of the map (which contains the registered events) into an array.
     *
     * @returns {Event[]} An array of all registered `Event` objects.
     */
    public getAllEvents(): Event[] {
        return Array.from(this.nameToEventMap.values());
    }

    /**
     * Retrieves all internal events.
     *
     * This method filters the array of all registered events to return only those that have
     * an `EventChannel.INTERNAL` channel.
     *
     * @returns {Event[]} An array of `Event` objects that belong to the `INTERNAL` channel.
     */
    public getAllInternalEvents(): Event[]{
        return this.getAllEvents().filter((event: Event) => event.channel === EventChannel.INTERNAL);
    }

    /**
     * Retrieves all external events.
     *
     * This method filters the array of all registered events to return only those that have
     * an `EventChannel.EXTERNAL` channel.
     *
     * @returns {Event[]} An array of `Event` objects that belong to the `EXTERNAL` channel.
     */
    public getAllExternalEvents(): Event[]{
        return this.getAllEvents().filter((event: Event) => event.channel === EventChannel.EXTERNAL);
    }

    /**
     * Retrieves all global events.
     *
     * This method filters the array of all registered events to return only those that have
     * an `EventChannel.GLOBAL` channel.
     *
     * @returns {Event[]} An array of `Event` objects that belong to the `GLOBAL` channel.
     */
    public getAllGlobalEvents(): Event[]{
        return this.getAllEvents().filter((event: Event) => event.channel === EventChannel.GLOBAL);

    }

    /**
     * Retrieves all peripheral events.
     *
     * This method filters the array of all registered events to return only those that have
     * an `EventChannel.PERIPHERAL` channel.
     *
     * @returns {Event[]} An array of `Event` objects that belong to the `PERIPHERAL` channel.
     */
    public getAllPeripheralEvents(): Event[]{
        return this.getAllEvents().filter((event: Event) => event.channel === EventChannel.PERIPHERAL);
    }



    /**
     * Retrieves all unique events raised by actions of type `RAISE_EVENT` within the given data.
     *
     * This function checks if the provided data represents a state or a state machine. It then filters
     * the actions to find those of type `RAISE_EVENT`, extracts their event properties, and returns
     * a list of unique event names.
     *
     * @param {CsmNodeProps} data - The data of the node, which can represent a state or a state machine.
     * @returns {string[]} A list of unique event names raised by actions of type `RAISE_EVENT`.
     */
    public getAllEventsRaised(data: CsmNodeProps): string[] {
        if(isState(data)){
            const actions = data.state.getAllActions().filter((action: Action) => action.type === ActionType.RAISE_EVENT);
            return actions.map((action: Action) => {
                const props = action.properties as { event: string } // TODO: This probably needs to be dynamic once we have the schema
                return props.event
            }).filter((value, index, array) => array.indexOf(value) === index);

        }
        if(isStateMachine(data)){
            const actions = data.stateMachine.actions.filter((action: Action) => action.type = ActionType.RAISE_EVENT);
            return actions.map((action: Action) => {
                const props = action.properties as { event: string } // TODO: This probably needs to be dynamic once we have the schema
                return props.event
            }).filter((value, index, array) => array.indexOf(value) === index);
        }
        return []

    }









}