import Action from "./action.ts";
import Guard from "./guard.tsx";

export default interface StateOrStateMachine {
    get name(): string
    getAllNamedActions(): Action[]
    getAllNamedGuards(): Guard[]

}