import { GuardOrGuardReferenceClass } from "../Interfaces";

/**
 * Guard reference construct. Represents a reference (by name) to an existing guard.
 * Example:
 * {
 *   reference: 'Guard Name'
 * }
 */

export class GuardReferenceClass implements GuardOrGuardReferenceClass{
    /**
   * The guard name reference.
   * Must be the name of an existing guard. Guard references may be declared as part of a state machine.
   */
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