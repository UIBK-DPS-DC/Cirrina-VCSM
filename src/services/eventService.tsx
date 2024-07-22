export default class EventService {
    private eventNames: Set<string>;

    public constructor() {
        this.eventNames = new Set<string>();
    }

    public registerName(eventName: string): boolean {
        if(!this.isNameUnique(eventName)){
            console.error("Event name already exists!");
            return false;
        }

        this.eventNames.add(eventName);
        console.log(eventName + " has been registered!");
        return true;
    }

    public unregisterName(eventName: string | unknown): void {
        if(typeof eventName === "string" ){
            this.eventNames.delete(eventName);
            console.log(eventName + " has been unregistered!");
        }
        else {
            console.warn("Invalid name type: unable to unregister", eventName);
        }

    }

    public isNameUnique(eventName: string): boolean {
        return ! this.eventNames.has(eventName);
    }






}