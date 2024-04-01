import { StateOrStatemachineClass } from "./Interfaces.tsx";
import { ContextClass } from "./context/ContextClass.tsx";
import { GuardClass } from "./guard/GuardClass.tsx";

class Statemachine implements StateOrStatemachineClass {
   name : string;
   states : Array<StateOrStatemachineClass>;
   localContext?: ContextClass;
   presistentContext?: ContextClass;
   guards?: Array<GuardClass>
   inherit?: string
   isAbstract?: boolean
   






   

}