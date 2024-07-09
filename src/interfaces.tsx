export interface StateOrStatemachine {

}

export interface Builder<T> {
    build(): T
    reset(): void
}


