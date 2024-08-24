import {
    ActionDescription,
    AssignActionDescription,
    CreateActionDescription,
    GuardDescription,
    InvokeActionDescription, OnTransitionDescription,
    RaiseActionDescription
} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";
import {ActionType} from "../enums.ts";

export default class PklService {
    public static guardToPKL(description: GuardDescription){
        let pkl ="{\n"
        pkl+= `\texpression: "${description.expression}"\n`
        pkl+= "}"
        return pkl
    }

    public static transitionToPKL(description: OnTransitionDescription): string {
        let pkl = `{\n`
        pkl+= `\ttarget: ${description.target}\n`
        pkl += `\tguards: [\n`
        description.guards.forEach(guard => {
            pkl += `\t\t${this.guardToPKL(guard)}\n`
        })


        return pkl;

    }


    public static actionToPKL(description: ActionDescription): string {
        let pkl = "{\n"
        switch(description.type){
            case ActionType.RAISE_EVENT: {
                const raiseEventDescription = description as RaiseActionDescription
                pkl+= `\ttype: "${raiseEventDescription.type}"\n`
                pkl+= `\tevent: {\n`
                //TODO: Replace with Event to pkl once its done.
                pkl+= `\t\tchannel: "${raiseEventDescription.event.channel}"\n`
                pkl+= `\t\tdata: []\n`
                pkl+= `\t\tname: "${raiseEventDescription.event.name}"\n`
                pkl+= '\t}\n'
                pkl+= `}`

                return pkl;

            }
            case ActionType.INVOKE: {
                const invokeDescription = description as InvokeActionDescription
                pkl += `\ttype: "${invokeDescription.type}"\n`
                pkl += `\tdone: []\n`
                pkl += `\tinput: []\n`
                pkl += `\tisLocal: ${invokeDescription.isLocal}`
                pkl += `\toutput: []\n`
                pkl += `\tserviceType: "${invokeDescription.serviceType}"\n`
                pkl += `}`
                return pkl;


            }
            //TODO replace stuff with context to pkl once implemented
            case ActionType.CREATE: {
                const createDescription = description as CreateActionDescription as CreateActionDescription
                pkl += `\ttype: "create"\n`
                pkl += `\tisPersistent: ${createDescription.isPersistent}\n`
                pkl += `\tvariable: {\n`
                pkl += `\t\tname: "${createDescription.variable.name}"\n`
                pkl += `\t\tvalue: "${createDescription.variable.value}"\n`
                pkl += `\t}\n`
                pkl += `}`
                return pkl;
            }
            case ActionType.ASSIGN: {
                const assignDescription = description as AssignActionDescription
                pkl += `\ttype: ${assignDescription.type}\n`
                pkl += `\tvariable: {\n`
                pkl += `\t\tname: "${assignDescription.variable.name}"\n`
                pkl += `\t\tvalue: "${assignDescription.variable.value}"\n`
                pkl += `\t}\n`
                pkl += `}`
                return pkl
            }




            default: {
                console.error(`Unknown type ${description.type}`)
                return "";
            }
        }
    }

}