import {
    ActionDescription,
    AssignActionDescription,
    CollaborativeStateMachineDescription, ContextDescription,
    ContextVariableDescription,
    ContextVariableReferenceDescription,
    CreateActionDescription,
    EventDescription,
    GuardDescription,
    InvokeActionDescription,
    OnTransitionDescription,
    RaiseActionDescription,
    StateDescription,
    StateMachineDescription
} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";
import {ActionType} from "../enums.ts";

export default class PklService {
    public static guardToPKL(description: GuardDescription, indentLevel = 0){
        let pkl =`${this.getIndent(indentLevel)}new {\n`;
        pkl+= `${this.getIndent(indentLevel + 1)}expression = "${description.expression}"\n`
        pkl+= `${this.getIndent(indentLevel)}}\n`
        return pkl
    }

    public static transitionToPKL(description: OnTransitionDescription, indentLevel = 0): string {
        let pkl = `${this.getIndent(indentLevel)}new {\n`
        pkl+= `${this.getIndent(indentLevel + 1)}target = ${description.target}\n`
        pkl += `${this.getIndent(indentLevel + 1)}guards {\n`
        description.guards.forEach(guard => {
            pkl += `${this.guardToPKL(guard,indentLevel + 2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}}\n`
        pkl += `${this.getIndent(indentLevel + 1)}actions {\n`
        description.actions.forEach(action => {
            pkl += `${this.actionToPKL(action, indentLevel +2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}}\n`
        pkl += `${this.getIndent(indentLevel + 1)}event = "${description.event}"\n`
        pkl += `${this.getIndent(indentLevel)}}\n`


        return pkl;

    }


    public static actionToPKL(description: ActionDescription, indentLevel = 0): string {
        let pkl = ""
        switch(description.type){
            case ActionType.RAISE_EVENT: {
                const raiseEventDescription = description as RaiseActionDescription
                pkl+= `${this.getIndent(indentLevel + 1)}type = "${raiseEventDescription.type}"\n`
                pkl+= `${this.getIndent(indentLevel + 1)}event {\n`
                //TODO: Replace with Event to pkl once its done.
                pkl+= `${this.getIndent(indentLevel + 2)}channel = "${raiseEventDescription.event.channel}"\n`
                pkl+= `${this.getIndent(indentLevel + 2)}data {}\n`
                pkl+= `${this.getIndent(indentLevel + 2)}name = "${raiseEventDescription.event.name}"\n`
                pkl+= `${this.getIndent(indentLevel + 1)}}\n`
                pkl+= `${this.getIndent(indentLevel)}}\n`

                return pkl;

            }
            case ActionType.INVOKE: {
                const invokeDescription = description as InvokeActionDescription
                pkl += `${this.getIndent(indentLevel + 1)}new InvokeActionDescription {\n`
                pkl += `${this.getIndent(indentLevel + 1)}type = "${invokeDescription.type}"\n`

                pkl += `${this.getIndent(indentLevel + 1)}done {\n`
                invokeDescription.done.forEach(event => {
                    pkl += `${this.eventToPKL(event, indentLevel +2)}\n`
                })
                pkl += `${this.getIndent(indentLevel + 1)}}\n`


                pkl += `${this.getIndent(indentLevel + 1)}input {\n`
                invokeDescription.input.forEach(context => {
                    pkl += `${this.contextVariableDescriptionToPKL(context, indentLevel +2)}\n`
                })
                pkl += `${this.getIndent(indentLevel + 1)}}\n`



                pkl += `${this.getIndent(indentLevel + 1)}isLocal = ${invokeDescription.isLocal}\n`
                pkl += `${this.getIndent(indentLevel + 1)}output {\n`
                invokeDescription.output.forEach(context => {
                    pkl += `${this.contextReferenceToPKL(context, indentLevel +2)}\n`
                })
                pkl += `${this.getIndent(indentLevel + 1)}}\n`

                pkl += `${this.getIndent(indentLevel + 1)}serviceType = "${invokeDescription.serviceType}"\n`
                pkl+= `${this.getIndent(indentLevel)}}\n`
                return pkl;


            }
            //TODO replace stuff with context to pkl once implemented
            case ActionType.CREATE: {
                const createDescription = description as CreateActionDescription as CreateActionDescription
                pkl += `${this.getIndent(indentLevel + 1)}type = "create"\n`
                pkl += `${this.getIndent(indentLevel + 1)}isPersistent = ${createDescription.isPersistent}\n`
                pkl += `${this.getIndent(indentLevel + 1)}variable {\n`
                pkl += `${this.getIndent(indentLevel + 2)}name = "${createDescription.variable.name}"\n`
                pkl += `${this.getIndent(indentLevel + 2)}value = "${createDescription.variable.value}"\n`
                pkl += `${this.getIndent(indentLevel + 1)}}\n`
                pkl+= `${this.getIndent(indentLevel)}}\n`
                return pkl;
            }
            case ActionType.ASSIGN: {
                const assignDescription = description as AssignActionDescription
                pkl += `${this.getIndent(indentLevel + 1)}type = "${assignDescription.type}"\n`
                pkl += `${this.getIndent(indentLevel + 1)}variable {\n`
                pkl += `${this.getIndent(indentLevel + 2)}name: "${assignDescription.variable.name}"\n`
                pkl += `${this.getIndent(indentLevel + 2)}value: "${assignDescription.variable.value}"\n`
                pkl += `${this.getIndent(indentLevel + 1)}}\n`
                pkl+= `${this.getIndent(indentLevel)}}\n`
                return pkl
            }

            default: {
                console.error(`Unknown type ${description.type}`)
                return "";
            }
        }
    }

    public static stateToPKL(description: StateDescription, indentLevel = 0) {

        let pkl = `${this.getIndent(indentLevel)}new {\n`
        pkl += `${this.getIndent(indentLevel + 1)}name = "${description.name}"\n`
        pkl += `${this.getIndent(indentLevel + 1)}initial = ${description.initial}\n`
        pkl += `${this.getIndent(indentLevel + 1)}terminal = ${description.terminal}\n`

        pkl += `${this.getIndent(indentLevel + 1)}entry {\n`
        description.entry.forEach((action) =>{
            pkl += `${this.actionToPKL(action,indentLevel + 2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}}\n`

        pkl += `${this.getIndent(indentLevel + 1)}exit {\n`
        description.exit.forEach((action) =>{
            pkl += `${this.actionToPKL(action,indentLevel + 2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}}\n`

        pkl += `${this.getIndent(indentLevel + 1)}while {\n`
        description.while.forEach((action) =>{
            pkl += `${this.actionToPKL(action,indentLevel + 2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}}\n`

        pkl += `${this.getIndent(indentLevel + 1)}after {\n`
        description.after.forEach((action) =>{
            pkl += `${this.actionToPKL(action,indentLevel + 2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}}\n`

        pkl += `${this.getIndent(indentLevel + 1)}on {\n`
        description.on.forEach((action) =>{
            pkl += `${this.transitionToPKL(action,indentLevel + 2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}}\n`

        pkl += `${this.getIndent(indentLevel + 1)}always {}\n`

        pkl += `${this.getIndent(indentLevel + 1)}localContext {}\n`
        pkl += `${this.getIndent(indentLevel + 1)}staticContext {}\n`
        pkl += `${this.getIndent(indentLevel)}}\n`




        return pkl
    }

    public static stateMachineToPKL(description: StateMachineDescription, indentLevel = 0) {
        let pkl = `${this.getIndent(indentLevel)}new {\n`
        pkl += `${this.getIndent(indentLevel + 1)}name = "${description.name}"\n`
        pkl += `${this.getIndent(indentLevel + 1)}states {\n`

        description.states.forEach((state) =>{
            pkl += `${this.stateToPKL(state, indentLevel + 2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}}\n`

        pkl += `${this.getIndent(indentLevel + 1)}stateMachines {\n`
        description.stateMachines.forEach((stateMachine) =>{
            pkl += `${this.stateMachineToPKL(stateMachine, indentLevel + 2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}}\n`

        if(description.localContext){
            pkl += `${this.getIndent(indentLevel + 1)}localContext {\n`
            pkl +=  `${this.contextDescriptionToPKL(description.localContext, indentLevel +2)}\n`
            pkl += `${this.getIndent(indentLevel + 1)}}\n`
        }

        if(description.persistentContext){
            pkl += `${this.getIndent(indentLevel + 1)}persistentContext {\n`
            pkl +=  `${this.contextDescriptionToPKL(description.persistentContext, indentLevel +2)}\n`
            pkl += `${this.getIndent(indentLevel + 1)}}\n`
        }
        pkl += `${this.getIndent(indentLevel)}}\n`






        return pkl;

    }

    public static collaborativeStateMachineToPKL(description: CollaborativeStateMachineDescription, indentLevel = 0) {
        let pkl = ""
        pkl += `${this.getIndent(indentLevel + 1)}name = "${description.name}"\n`
        pkl += `${this.getIndent(indentLevel + 1)}version = "${description.version}"\n`

        pkl += `${this.getIndent(indentLevel + 1)}stateMachines {\n`
        description.stateMachines.forEach((stateMachine) =>{
            pkl += `${this.stateMachineToPKL(stateMachine, indentLevel +2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}}\n`

        if(description.localContext){
            pkl += `${this.getIndent(indentLevel + 1)}localContext {\n`
            pkl +=  `${this.contextDescriptionToPKL(description.localContext, indentLevel +2)}\n`
            pkl += `${this.getIndent(indentLevel + 1)}}\n`
        }

        if(description.persistentContext){
            pkl += `${this.getIndent(indentLevel + 1)}persistentContext {\n`
            pkl +=  `${this.contextDescriptionToPKL(description.persistentContext, indentLevel +2)}\n`
            pkl += `${this.getIndent(indentLevel + 1)}}\n`
        }


        return pkl;

    }

    public static contextVariableDescriptionToPKL(description: ContextVariableDescription, indentLevel = 0) {
        let pkl = ""
        pkl += `${this.getIndent(indentLevel)}new {\n`
        pkl += `${this.getIndent(indentLevel + 1)}name = "${description.name}"\n`
        pkl += `${this.getIndent(indentLevel + 1)}value = "${description.value}"\n`
        pkl += `${this.getIndent(indentLevel)}}`
        return pkl
    }

    public static eventToPKL(description : EventDescription, indentLevel = 0) {
        let pkl = `${this.getIndent(indentLevel)}new {\n`
        pkl += `${this.getIndent(indentLevel + 1)}name = "${description.name}"\n`
        pkl += `${this.getIndent(indentLevel + 1)}data {\n`
        description.data.forEach((context) =>{
            pkl+= `${this.contextVariableDescriptionToPKL(context, indentLevel + 2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}}\n`
        pkl += `${this.getIndent(indentLevel + 1)}channel = "${description.channel}"\n`
        pkl += `${this.getIndent(indentLevel)}}`
        return pkl

    }

    public static contextReferenceToPKL(description: ContextVariableReferenceDescription, indentLevel = 0) {
        let pkl = ""
        pkl += `${this.getIndent(indentLevel)}new {\n`
        pkl += `${this.getIndent(indentLevel + 1)}reference = "${description.reference}"\n`
        pkl += `${this.getIndent(indentLevel)}}`
        return pkl;
    }

    public static contextDescriptionToPKL(description: ContextDescription, indentLevel = 0) {
        let pkl = ""
        pkl += `${this.getIndent(indentLevel)}variables {\n`
        description.variables.forEach((variable) => {
            pkl += `${this.contextVariableDescriptionToPKL(variable, indentLevel +2)}\n`
        })

        pkl += `${this.getIndent(indentLevel)}}`
        return pkl;
    }


    private static getIndent(level: number): string {
        return '\t'.repeat(level);
    }

}
