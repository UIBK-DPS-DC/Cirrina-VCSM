import { ActionOrActionReferenceClass } from "../Interfaces"

export class ActionReferenceClass implements ActionOrActionReferenceClass {
    private _reference: string;

    constructor(reference: string){
        this._reference = reference;
    }

    public get reference(): string {
        return this._reference;
    }
    public set reference(value: string) {
        this._reference = value;
    }
}