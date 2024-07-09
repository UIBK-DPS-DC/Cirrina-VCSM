import { ActionOrActionReferenceClass, StateOrStatemachineClass } from "./Interfaces.tsx";
import { ContextClass } from "./context/ContextClass.tsx";
import { GuardClass } from "./guard/GuardClass.tsx";

/**
 * State machine construct. Represents a state machine within a collaborative state machine.
 * Example:
 * {
 *   name: 'Collaborative State Machine Name',
 *   states: [...],
 *   localContext: [...],
 *   persistentContext: [...],
 *   guards: [],
 *   actions: []
 * }
 */


export class StatemachineClass implements StateOrStatemachineClass {

   private _name: string;
    /**
   * The states.
   * At least one initial state must be provided.
   */
   private _states: Array<StateOrStatemachineClass>;

   private _localContext?: ContextClass | undefined;

   private _persistentContext?: ContextClass | undefined;

    /**
   * The optional named guards.
   * The guards declared here may be used inside this state machine by referencing the names.
   */
   private _guards?: Array<GuardClass> | undefined;

   /**
   * The optional named actions.
   * The actions declared here may be used inside this state machine by referencing the names.
   */
   private _actions?: Array<ActionOrActionReferenceClass> | undefined;

   /**
   * The optional inherited state machine name.
   * The state machine inherits from this state machine, copies all its properties and allows them to be overwritten. States can only be
   * overridden if they are defined as virtual or abstract.
   */
   private _inherit?: string | undefined;

    /**
   * The optional abstract modifier.
   * If a state machine is defined as abstract, it cannot be instantiated and is never executed by nested state machines. Abstract state
   * machines can be inherited and can have abstract states.
   */
   private _isAbstract?: boolean | undefined;



   // We should construct these using a builder, however feel free to add more constructors as needed
   constructor();
   constructor(name: string)
   constructor(name?: string){
      this._name = name || ""
      this._states = new Array<StateOrStatemachineClass>()
      this._localContext = undefined
      this._persistentContext = undefined
      this._guards = undefined
      this._actions = undefined
      this._inherit = undefined;
      this._isAbstract = undefined;


   }

   public get name(): string {
      return this._name;
   }
   public set name(value: string) {
      this._name = value;
   }

   public get states(): Array<StateOrStatemachineClass> {
      return this._states;
   }
   public set states(value: Array<StateOrStatemachineClass>) {
      this._states = value;
   }

   public get localContext(): ContextClass | undefined {
      return this._localContext;
   }
   public set localContext(value: ContextClass | undefined) {
      this._localContext = value;
   }

   public get persistentContext(): ContextClass | undefined {
      return this._persistentContext;
   }
   public set persistentContext(value: ContextClass | undefined) {
      this._persistentContext = value;
   }

   public get guards(): Array<GuardClass> | undefined {
      return this._guards;
   }
   public set guards(value: Array<GuardClass> | undefined) {
      this._guards = value;
   }

   public get actions(): Array<ActionOrActionReferenceClass> | undefined {
      return this._actions;
   }
   public set actions(value: Array<ActionOrActionReferenceClass> | undefined) {
      this._actions = value;
   }

   public get inherit(): string | undefined {
      return this._inherit;
   }
   public set inherit(value: string | undefined) {
      this._inherit = value;
   }

   public get isAbstract(): boolean | undefined {
      return this._isAbstract;
   }
   public set isAbstract(value: boolean | undefined) {
      this._isAbstract = value;
   }




   

}
