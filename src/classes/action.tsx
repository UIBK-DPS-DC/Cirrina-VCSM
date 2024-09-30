import {ActionType} from "../enums.ts";
import ContextVariable from "./contextVariable.tsx";
import Event from "./event.ts";
import {
    ActionDescription,
    AssignActionDescription,
    CreateActionDescription,
    InvokeActionDescription,
    MatchActionDescription,
    RaiseActionDescription,
    TimeoutActionDescription,
    TimeoutResetActionDescription
} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";
import {
    ActionProps,
    AssignActionProps,
    CreateActionProps,
    InvokeActionProps,
    MatchActionProps,
    RaiseEventActionProps,
    TimeoutActionProps,
    TimeoutResetActionProps
} from "../types.ts";
import MatchCase from "./MatchCase.tsx";

;

/**
 * Placeholder Action class. Expand once we have the Schema
 */
//TODO: REFACTOR ACTION CLASS
export default class Action {
    private static id = 0;

    private _id = 0
    private _name: string;
    private _type: ActionType
    private _delay: number
    private _properties: ActionProps
    private _context: ContextVariable[] | undefined
    private _case: string | undefined

    constructor(name: string, type: ActionType, delay = 0) {
        this._id = Action.id++;
        this._name = name;
        this._type = type;
        this._properties = {}
        this._delay = delay
        this._context = undefined

    }


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get type(){
        return this._type;
    }
    set type(value) {
        this._type = value;
    }

    get properties() {
        return this._properties;
    }

    set properties(props) {
        this._properties = props;
    }

    get delay() {
        return this._delay;
    }

    set delay(value) {
        this._delay = value;
    }


    get context(): ContextVariable[] | undefined {
        return this._context;
    }

    set context(value: ContextVariable[] | undefined) {
        this._context = value;
    }


    get case(): string | undefined {
        return this._case;
    }

    set case(value: string | undefined) {
        this._case = value;
    }

// Could be extended to compare fields for non named actions.
    public equals(other: Action) {
        if(this.name){
            return this.name === other.name;
        }
        return this === other;
    }

    public toDescription():ActionDescription {
        switch(this.type){
            case ActionType.RAISE_EVENT: {
               const raiseEventProps = this.properties as RaiseEventActionProps;

               const raiseEventDescription: RaiseActionDescription  = {
                   event: raiseEventProps.event.toDescription(),
                   type: ActionType.RAISE_EVENT,
               }


               return raiseEventDescription
            }



            case ActionType.INVOKE: {

                const invokeActionProps = this.properties as InvokeActionProps

                const invokeActionDescription: InvokeActionDescription = {
                    done: invokeActionProps.done.map((e) => e.toDescription()),
                    input: invokeActionProps.input.map((a) => a.toDescription()),
                    isLocal: invokeActionProps.isLocal,
                    output: invokeActionProps.output.map((a) =>{
                        return {reference: a.name}
                    }),
                    serviceType: invokeActionProps.serviceType,
                    type: ActionType.INVOKE

                }
                return invokeActionDescription;
            }
            case ActionType.CREATE: {


              const createActionProps = this.properties as CreateActionProps
              const createActionDescription: CreateActionDescription = {
                  isPersistent: createActionProps.isPersistent,
                  type: ActionType.CREATE,
                  variable: createActionProps.variable.toDescription()

              }


              return createActionDescription


            }

            case ActionType.ASSIGN: {
                const assignActionProps = this.properties as AssignActionProps

                const assignActionDescription: AssignActionDescription = {
                    type: ActionType.ASSIGN,
                    variable: assignActionProps.variable.toDescription()
                }

                return assignActionDescription
            }

            case ActionType.MATCH: {
                const matchActionProps = this.properties as MatchActionProps

                const matchActionDescription: MatchActionDescription = {
                    cases: matchActionProps.cases.map((c) => c.toDescription()),
                    type: matchActionProps.type,
                    value: matchActionProps.value,

                }

                return matchActionDescription
            }

            case ActionType.TIMEOUT: {
                const timeoutActionProps =  this.properties as TimeoutActionProps

                const timeOutActionDescription: TimeoutActionDescription = {
                    action: timeoutActionProps.action.toDescription(),
                    delay: timeoutActionProps.delay,
                    name: timeoutActionProps.name,
                    type: ActionType.TIMEOUT

                }

                return timeOutActionDescription
            }

            case ActionType.TIMEOUT_RESET: {
                const timeoutResetActionProps = this.properties as TimeoutResetActionProps

                const timeOutResetActionDescription: TimeoutResetActionDescription = {
                    action: timeoutResetActionProps.action.name,
                    type: ActionType.TIMEOUT_RESET
                }
                return timeOutResetActionDescription
            }


            default: {
                // TODO: HANDLE OTHER TYPES.
                return {type: "lock"}
            }

        }

    }

    public static fromDescription(description: ActionDescription): Action {
        switch (description.type) {

            case ActionType.RAISE_EVENT: {
                const raiseEventDescription = description as RaiseActionDescription
                const raiseEventActionProps: RaiseEventActionProps = {
                    event: Event.fromDescription(raiseEventDescription.event), type: ActionType.RAISE_EVENT

                }
                const raiseEventAction = new Action("", ActionType.RAISE_EVENT)
                raiseEventAction.properties = raiseEventActionProps
                return raiseEventAction;
            }

            case ActionType.CREATE: {
                const createActionDescription = description as CreateActionDescription
                const createActionProps: CreateActionProps = {
                    isPersistent: createActionDescription.isPersistent,
                    type: ActionType.CREATE,
                    variable: ContextVariable.fromDescription(createActionDescription.variable)

                }
                const newCreateAction = new Action("",ActionType.CREATE)
                newCreateAction.properties = createActionProps
                return newCreateAction;
            }

            case ActionType.ASSIGN: {
                const assignActionDescription = description as AssignActionDescription
                const assignActionProps: AssignActionProps = {
                    expression:"" ,
                    type: ActionType.ASSIGN,
                    variable: ContextVariable.fromDescription(assignActionDescription.variable)


                }
                // TODO ask what is upt with missing expression in assign action description
                const newAssignAction = new Action("",ActionType.ASSIGN)
                newAssignAction.properties = assignActionProps
                return newAssignAction
            }

            case ActionType.INVOKE: {
                const invokeActionDescription = description as InvokeActionDescription
                const invokeActionProps: InvokeActionProps = {
                    done: invokeActionDescription.done.map((e) => Event.fromDescription(e)),
                    input: invokeActionDescription.input.map((i) => ContextVariable.fromDescription(i)),
                    isLocal: invokeActionDescription.isLocal,
                    output: invokeActionDescription.output.map((o) => ContextVariable.fromReferenceDescription(o)),
                    serviceType: invokeActionDescription.serviceType,
                    type: ActionType.INVOKE

                }

                const newInvokeAction = new Action("", ActionType.INVOKE)
                newInvokeAction.properties = invokeActionProps
                return newInvokeAction


            }

            case ActionType.TIMEOUT: {
                const timeOutActionDescription = description as TimeoutActionDescription
                const timeOutActionProps: TimeoutActionProps = {
                    action: Action.fromDescription(timeOutActionDescription.action),
                    delay: timeOutActionDescription.delay,
                    name: timeOutActionDescription.name,
                    type: ActionType.TIMEOUT

                }

                const newTimeOutAction = new Action(timeOutActionDescription.name, ActionType.TIMEOUT)
                newTimeOutAction.properties = timeOutActionProps
                return newTimeOutAction;


            }

            // TODO: Needs a second pass to fill timeoutresetactions
            case ActionType.TIMEOUT_RESET: {
                const timeOutResetActionDescription = description as TimeoutResetActionDescription
                const timeOutResetActionProps: TimeoutResetActionProps = {action: new Action(timeOutResetActionDescription.action, ActionType.TIMEOUT_RESET),
                    type: ActionType.TIMEOUT_RESET}

                const newTimeoutResetAction = new Action("", ActionType.TIMEOUT_RESET)
                newTimeoutResetAction.properties = timeOutResetActionProps
                return newTimeoutResetAction;


            }

            case ActionType.MATCH: {
                const matchActionDescription = description as MatchActionDescription
                const matchActionProps: MatchActionProps = {
                    cases: matchActionDescription.cases.map((c) => MatchCase.fromDescription(c)),
                    type: ActionType.MATCH,
                    value: matchActionDescription.value

                }

                const newMatchAction = new Action("", ActionType.MATCH)
                newMatchAction.properties = matchActionProps
                return newMatchAction;
            }



        }

        return new Action("DEFAULT", ActionType.RAISE_EVENT)

    }





}