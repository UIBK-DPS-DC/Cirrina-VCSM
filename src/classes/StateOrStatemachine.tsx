export default class StateOrStatemachine {
    private static stateOrStatemachineNames: Set<string> = new Set()
    private static idCount: number = 0



    public static registerName(name: string): boolean {
        if(StateOrStatemachine.stateOrStatemachineNames.has(name)){
            console.log(name + " already exists");
            return false
        }

        StateOrStatemachine.stateOrStatemachineNames.add(name)
        return true
    }

    public static getCurrentIdCount(): number {
        return StateOrStatemachine.idCount
    }

    public static getNewId(){
        const id = StateOrStatemachine.idCount
        StateOrStatemachine.idCount+= 1
        return id
    }






}