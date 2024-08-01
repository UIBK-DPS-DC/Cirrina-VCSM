import {CsmNodeProps, isState, isStateMachine} from "../types.ts";
import Action from "../classes/action.tsx";
import {ActionType} from "../enums.tsx";

export default class EventService {
    private eventNames: Set<string>;

    public constructor() {
        this.eventNames = new Set<string>();
    }

    /**
     * Registers an event name.
     *
     * This method checks if the provided `eventName` is unique by comparing it against
     * a collection of already registered names. If the name is not unique, it logs an
     * error message to the console and returns `false`. If the name is unique, it adds
     * the name to the collection and returns `true`.
     *
     * @param {string} eventName - The name of the event to register.
     * @returns {boolean} - Returns `true` if the name is unique and successfully registered,
     *                      otherwise returns `false`.
     */
    public registerName(eventName: string): boolean {
        if(!this.isNameUnique(eventName)){
            console.error("Event name already exists!");
            return false;
        }

        this.eventNames.add(eventName);
        console.log(eventName + " has been registered!");
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
    public unregisterName(eventName: string | unknown): void {
        if(typeof eventName === "string" ){
            this.eventNames.delete(eventName);
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
        return ! this.eventNames.has(eventName);
    }

    public getAllEvents() {
        return Array.from(this.eventNames.values());
    }


    public getAllEventsRaised(data: CsmNodeProps) {
        if(isState(data)){
            const actions = data.state.getAllActions().filter((action: Action) => action.type === ActionType.RAISE_EVENT);
            return actions.map((action: Action) => {
                const props = action.properties as { event: string } // TODO: This probably needs to be dynamic once we have the schema
                return props.event
            });

        }
        if(isStateMachine(data)){
            const actions = data.stateMachine.actions.filter((action: Action) => {action.type = ActionType.RAISE_EVENT;})
            return actions.map((action: Action) => {
                const props = action.properties as { event: string } // TODO: This probably needs to be dynamic once we have the schema
                return props.event
            });
        }
        return []

    }









}