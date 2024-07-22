export default class ActionService {
    private actionNames: Set<string>;

    public constructor() {
        this.actionNames = new Set();
    }



    public registerName(actionName: string): boolean {
        if(!this.isNameUnique(actionName)){
            console.error("Action name already exists!");
            return false;
        }

        this.actionNames.add(actionName);
        console.log(actionName + " has been registered!");
        return true;
    }


    public unregisterName(actionName: string | unknown): void {
        if(typeof actionName === "string" ){
            this.actionNames.delete(actionName);
            console.log(actionName + " has been unregistered!");
        }
        else {
            console.warn("Invalid name type: unable to unregister", actionName);
        }

    }


    public isNameUnique(actionName: string): boolean {
        return ! this.actionNames.has(actionName);
    }

}