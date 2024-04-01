export class ContextVariableReference {
    private _reference: string
    
    constructor(reference: string){
        this._reference = reference
    }

    public get reference_1(): string {
        return this._reference
    }
    public set reference_1(value: string) {
        this._reference = value
    }
}