import {ActionType} from "../enums.ts";
import ContextVariable from "./contextVariable.tsx";
import {
    ActionDescription, AssignActionDescription, CreateActionDescription,
    EventDescription,
    InvokeActionDescription,
    RaiseActionDescription
} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";
import {ActionProps, InvokeActionProps} from "../types.ts";
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
                const props = this.properties as {event: string}
                const eventDescription: EventDescription = {
                    channel: "global", data: [], name: props.event

                }
                const description: RaiseActionDescription = {
                    event: eventDescription, type: "raise"
                }
                return description;
            }

            case ActionType.INVOKE: {

                const invokeActionProps = this.properties as InvokeActionProps

                const description: InvokeActionDescription = {
                    done: invokeActionProps.done.map((e) => e.toDescription()),
                    input: invokeActionProps.input.map((a) => a.toDescription()),
                    isLocal: invokeActionProps.isLocal,
                    output: invokeActionProps.output.map((a) =>{
                        return {reference: a.name}
                    }),
                    serviceType: invokeActionProps.serviceType,
                    type: ActionType.INVOKE

                }
                return description;
            }
            case ActionType.CREATE: {
                const props = this.properties as {
                    description: string,
                    variable: string,
                    value: string,
                    isPersistent: boolean
                }

                const description: CreateActionDescription = {
                    isPersistent: props.isPersistent , type: "create", variable: {name: props.variable, value: props.value}

                }
                return description;
            }

            case ActionType.ASSIGN: {
                const props = this.properties as {variable: string, value: string}
                const description: AssignActionDescription = {
                    type: "assign", variable: {name: props.variable, value: props.value}

                }
                return description;
            }
            default: {
                // TODO: HANDLE OTHER TYPES.
                return {type: "lock"}
            }

        }

    }





}