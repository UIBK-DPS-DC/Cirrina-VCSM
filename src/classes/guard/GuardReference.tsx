import { GuardOrGuardReferenceClass } from "../Interfaces";

export class GuardReference implements GuardOrGuardReferenceClass{
    private _reference: string;
   
    constructor();
    constructor(reference: string);

    constructor(reference?: string){
        this._reference = reference || "";
    }


    public get reference(): string {
        return this._reference;
    }
    public set reference(value: string) {
        this._reference = value;
    }

    

}