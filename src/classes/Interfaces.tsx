export interface StateOrStatemachineClass {

}

export interface ActionOrActionReferenceClass{

}

export interface GuardOrGuardReferenceClass {
    
}

export interface Builder<T>{
    build(): T | undefined;
    
    /* Should reset the builder by assigning it a new Object of type T */
    reset(): void;
}