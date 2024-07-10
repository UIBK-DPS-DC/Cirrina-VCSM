export interface Builder<T> {
    build(): T
    reset(): void
    validate(): boolean
}


