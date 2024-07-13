export default class StateOrStateMachine {
    private static stateOrStatemachineNames: Set<string> = new Set()
    private static idCount: number = 0



    public static registerName(name: string): boolean {
        if(! this.isNameUnique(name)){
            console.log(name + " already exists");
            return false
        }

        this.stateOrStatemachineNames.add(name)
        return true
    }

    public static unregisterName(name: string): void {
        this.stateOrStatemachineNames.delete(name)
    }

    public static getCurrentIdCount(): number {
        return StateOrStateMachine.idCount
    }

    public static getNewId(): number{
        const id = this.idCount
        this.idCount+= 1
        return id
    }

    public static isNameUnique(name: string): boolean {
        return ! this.stateOrStatemachineNames.has(name)
    }








}