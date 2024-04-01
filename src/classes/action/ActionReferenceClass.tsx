import { ActionOrActionReferenceClass } from "../Interfaces"

export class ActionReferenceClass implements ActionOrActionReferenceClass {
    private _reference: string;

    public get reference(): string {
        return this._reference;
    }
    public set reference(value: string) {
        this._reference = value;
    }
    

    constructor(reference: string){
        this._reference = reference;
    }
}