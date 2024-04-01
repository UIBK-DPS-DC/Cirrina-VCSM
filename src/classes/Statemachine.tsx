import { ActionOrActionReferenceClass, StateOrStatemachineClass } from "./Interfaces.tsx";
import { ContextClass } from "./context/ContextClass.tsx";
import { GuardClass } from "./guard/GuardClass.tsx";

class Statemachine implements StateOrStatemachineClass {
   private _name: string;
   private _states: Array<StateOrStatemachineClass>;
   private _localContext?: ContextClass | undefined;
   private _persistentContext?: ContextClass | undefined;
   private _guards?: Array<GuardClass> | undefined;
   private _actions?: Array<ActionOrActionReferenceClass> | undefined;
   private _inherit?: string | undefined;
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
