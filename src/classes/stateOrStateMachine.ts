import Action from "./action.ts";
import Guard from "./guard.tsx";
import ContextVariable from "./contextVariable.tsx";

export default interface StateOrStateMachine {
    get name(): string
    getAllNamedActions(): Action[]
    getAllNamedGuards(): Guard[]
    removeContext(context: ContextVariable): void

}