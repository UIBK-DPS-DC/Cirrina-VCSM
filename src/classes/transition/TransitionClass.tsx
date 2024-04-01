import { ActionOrActionReferenceClass, GuardOrGuardReferenceClass } from "../Interfaces";

/**
 * Transition construct. Represents a transition that is to be taken regardless of an event.
 * Example:
 * {
 *   target: 'State Name',
 *   guards: [...],
 *   actions: [...]
 * }
 */

export class TransitionClass {
    private _target: string;

    /**
   * The optional guards. All guard expression need to evaluate to true before a transitions can be taken. Can be provided as guard
   * references to previously declared guards, or inline guards.
   *
   */
    private _guards?: Array<GuardOrGuardReferenceClass> | undefined;

    /**
   * The optional actions. These actions are executed during the transition, if the transition is taken. Can be provided as action
   * references to previously declared actions, or inline actions.
   *
   */

    private _actions?: Array<ActionOrActionReferenceClass> | undefined;

    /**
   * The optional else target. If the guards evaluate to false, the state machine ends up in this target state.
   */
    private _else?: string | undefined;
  

    constructor();
    constructor(target:string);
    
    constructor(target?: string){
        this._target = target || "";
    }


    public get target(): string {
        return this._target;
    }
    public set target(value: string) {
        this._target = value;
    }

    public get guards(): Array<GuardOrGuardReferenceClass> | undefined {
        return this._guards;
    }
    public set guards(value: Array<GuardOrGuardReferenceClass> | undefined) {
        this._guards = value;
    }
    public get actions(): Array<ActionOrActionReferenceClass> | undefined {
        return this._actions;
    }
    public set actions(value: Array<ActionOrActionReferenceClass> | undefined) {
        this._actions = value;
    }

    public get else(): string | undefined {
        return this._else;
    }
    public set else(value: string | undefined) {
        this._else = value;
    }
}