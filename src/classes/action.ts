import {ActionType} from "../enums.ts";
import ContextVariable from "./contextVariable.tsx";
import {
    ActionDescription, AssignActionDescription, CreateActionDescription,
    EventDescription,
    InvokeActionDescription,
    RaiseActionDescription
} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";
import {ActionProps} from "../types.ts";


/**
 * Placeholder Action class. Expand once we have the Schema
 */
export default class Action {
    private _name: string;
    private _type: ActionType
    private _delay: number
    private _properties: ActionProps
    private _context: ContextVariable[] | undefined

    constructor(name: string, type: ActionType, delay = 0) {
        this._name = name;
        this._type = type;
        this._properties = {}
        this._delay = delay
        this._context = undefined

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

                const props = this.properties as {
                        description: string,
                        serviceType: string,
                        serviceLevel: string
                    }
                const description: InvokeActionDescription = {
                    done: [],
                    input: [],
                    isLocal: false,
                    output: [],
                    serviceType: props.serviceType,
                    type: "invoke"

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