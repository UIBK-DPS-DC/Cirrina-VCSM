import { StateOrStateMachine } from "./Interfaces.tsx";
import { ContextClass } from "./context/ContextClass.tsx";
import { GuardClass } from "./guard/GuardClass.tsx";

class Statemachine implements StateOrStatemachine {
   name : string;
   states : Array<StateOrStateMachine>;
   localContext?: ContextClass;
   presistentContext?: ContextClass;
   guards: Array<GuardClass>
   inherit?: string
   isAbstract?: boolean






   

}