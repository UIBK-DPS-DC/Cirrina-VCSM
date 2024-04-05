import { StateClass } from "./StateClass";
import { TransitionClass } from "./transition/TransitionClass";

export type StateData = {
    state: StateClass;
}

export type EdgeData = {
    transition: TransitionClass
}



