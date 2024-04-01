import { GuardOrGuardReferenceClass } from "../Interfaces";

/**
 * Guard construct. Represents a conditional (if) that determines if a transition can be taken. Guards can be declared and referenced as
 * part of a state machine, or be declared inline.
 * 
 * {
 *   name: 'Guard Name',
 *   expression: 'a==5'
 * }
 */

export class GuardClass implements GuardOrGuardReferenceClass{

    /**
   * An expression.
   * The expression must evaluate to a boolean value.
   */
    private _expression: string;

    /**
   * The optional name.
   * If present, can be referenced from within a state machine component when declared as part of the state machine's guards.
   */

    private _guardName?: string | undefined;

    constructor();
    constructor(expression: string, guardName:string);

    constructor(expression?: string, guardName?: string ){
        this._expression = expression || "";
        this._guardName = guardName || undefined;
        
    }

    public get expression(): string {
        return this._expression;
    }
    public set expression(value: string) {
        this._expression = value;
    }

    public get guardName(): string | undefined {
        return this._guardName;
    }
    public set guardName(value: string | undefined) {
        this._guardName = value;
    }




}