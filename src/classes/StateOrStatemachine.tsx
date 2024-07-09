export default class StateOrStatemachine {
    private static stateOrStatemachineNames: Set<string> = new Set()


    public static registerName(name: string): boolean  {
        if(StateOrStatemachine.stateOrStatemachineNames.has(name)){
            console.log(name + " already exists");
            return false
        }

        StateOrStatemachine.stateOrStatemachineNames.add(name)
        return true
    }






}