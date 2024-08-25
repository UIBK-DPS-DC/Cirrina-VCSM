import {
    ActionDescription,
    AssignActionDescription, CollaborativeStateMachineDescription,
    CreateActionDescription,
    GuardDescription,
    InvokeActionDescription, OnTransitionDescription,
    RaiseActionDescription, StateDescription, StateMachineDescription
} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";
import {ActionType} from "../enums.ts";

export default class PklService {
    public static guardToPKL(description: GuardDescription, indentLevel = 0){
        let pkl =`${this.getIndent(indentLevel)}{\n`;
        pkl+= `${this.getIndent(indentLevel + 1)}expression: "${description.expression}"\n`
        pkl+= `${this.getIndent(indentLevel)}}`
        return pkl
    }

    public static transitionToPKL(description: OnTransitionDescription, indentLevel = 0): string {
        let pkl = `${this.getIndent(indentLevel)}{\n`
        pkl+= `${this.getIndent(indentLevel + 1)}target: ${description.target}\n`
        pkl += `${this.getIndent(indentLevel + 1)}guards: [\n`
        description.guards.forEach(guard => {
            pkl += `${this.guardToPKL(guard,indentLevel + 2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}]\n`
        pkl += `${this.getIndent(indentLevel + 1)}actions: [\n`
        description.actions.forEach(action => {
            pkl += `${this.actionToPKL(action, indentLevel +2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}]\n`
        pkl += `${this.getIndent(indentLevel + 1)}event: "${description.event}"\n`
        pkl += `${this.getIndent(indentLevel)}}`


        return pkl;

    }


    public static actionToPKL(description: ActionDescription, indentLevel = 0): string {
        let pkl = `${this.getIndent(indentLevel)}{\n`
        switch(description.type){
            case ActionType.RAISE_EVENT: {
                const raiseEventDescription = description as RaiseActionDescription
                pkl+= `${this.getIndent(indentLevel + 1)}type: "${raiseEventDescription.type}"\n`
                pkl+= `${this.getIndent(indentLevel + 1)}event: {\n`
                //TODO: Replace with Event to pkl once its done.
                pkl+= `${this.getIndent(indentLevel + 2)}channel: "${raiseEventDescription.event.channel}"\n`
                pkl+= `${this.getIndent(indentLevel + 2)}data: []\n`
                pkl+= `${this.getIndent(indentLevel + 2)}name: "${raiseEventDescription.event.name}"\n`
                pkl+= `${this.getIndent(indentLevel + 1)}}\n`
                pkl+= `${this.getIndent(indentLevel)}}`

                return pkl;

            }
            case ActionType.INVOKE: {
                const invokeDescription = description as InvokeActionDescription
                pkl += `${this.getIndent(indentLevel + 1)}type: "${invokeDescription.type}"\n`
                pkl += `${this.getIndent(indentLevel + 1)}done: []\n`
                pkl += `${this.getIndent(indentLevel + 1)}input: []\n`
                pkl += `${this.getIndent(indentLevel + 1)}isLocal: ${invokeDescription.isLocal}\n`
                pkl += `${this.getIndent(indentLevel + 1)}output: []\n`
                pkl += `${this.getIndent(indentLevel + 1)}serviceType: "${invokeDescription.serviceType}"\n`
                pkl+= `${this.getIndent(indentLevel)}}`
                return pkl;


            }
            //TODO replace stuff with context to pkl once implemented
            case ActionType.CREATE: {
                const createDescription = description as CreateActionDescription as CreateActionDescription
                pkl += `${this.getIndent(indentLevel + 1)}type: "create"\n`
                pkl += `${this.getIndent(indentLevel + 1)}isPersistent: ${createDescription.isPersistent}\n`
                pkl += `${this.getIndent(indentLevel + 1)}variable: {\n`
                pkl += `${this.getIndent(indentLevel + 2)}name: "${createDescription.variable.name}"\n`
                pkl += `${this.getIndent(indentLevel + 2)}value: "${createDescription.variable.value}"\n`
                pkl += `${this.getIndent(indentLevel + 1)}}\n`
                pkl+= `${this.getIndent(indentLevel)}}`
                return pkl;
            }
            case ActionType.ASSIGN: {
                const assignDescription = description as AssignActionDescription
                pkl += `${this.getIndent(indentLevel + 1)}type: ${assignDescription.type}\n`
                pkl += `${this.getIndent(indentLevel + 1)}variable: {\n`
                pkl += `${this.getIndent(indentLevel + 2)}name: "${assignDescription.variable.name}"\n`
                pkl += `${this.getIndent(indentLevel + 2)}value: "${assignDescription.variable.value}"\n`
                pkl += `${this.getIndent(indentLevel + 1)}}\n`
                pkl+= `${this.getIndent(indentLevel)}}`
                return pkl
            }

            default: {
                console.error(`Unknown type ${description.type}`)
                return "";
            }
        }
    }

    public static stateToPKL(description: StateDescription, indentLevel = 0) {

        let pkl = `${this.getIndent(indentLevel)}{\n`
        pkl += `${this.getIndent(indentLevel + 1)}name: "${description.name}"\n`
        pkl += `${this.getIndent(indentLevel + 1)}initial: ${description.initial}\n`
        pkl += `${this.getIndent(indentLevel + 1)}terminal: ${description.terminal}\n`

        pkl += `${this.getIndent(indentLevel + 1)}entry: [\n`
        description.entry.forEach((action) =>{
            pkl += `${this.actionToPKL(action,indentLevel + 2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}]\n`

        pkl += `${this.getIndent(indentLevel + 1)}exit: [\n`
        description.exit.forEach((action) =>{
            pkl += `${this.actionToPKL(action,indentLevel + 2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}]\n`

        pkl += `${this.getIndent(indentLevel + 1)}while: [\n`
        description.while.forEach((action) =>{
            pkl += `${this.actionToPKL(action,indentLevel + 2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}]\n`

        pkl += `${this.getIndent(indentLevel + 1)}after: [\n`
        description.after.forEach((action) =>{
            pkl += `${this.actionToPKL(action,indentLevel + 2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}]\n`

        pkl += `${this.getIndent(indentLevel + 1)}on: [\n`
        description.on.forEach((action) =>{
            pkl += `${this.transitionToPKL(action,indentLevel + 2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}]\n`

        pkl += `${this.getIndent(indentLevel + 1)}always: []\n`

        pkl += `${this.getIndent(indentLevel + 1)}localContext: []\n`
        pkl += `${this.getIndent(indentLevel + 1)}staticContext: []\n`
        pkl += `${this.getIndent(indentLevel)}}\n`




        return pkl
    }

    public static stateMachineToPKL(description: StateMachineDescription, indentLevel = 0) {
        let pkl = `${this.getIndent(indentLevel)}{\n`
        pkl += `${this.getIndent(indentLevel + 1)}name: "${description.name}"\n`
        pkl += `${this.getIndent(indentLevel + 1)}states: [\n`

        description.states.forEach((state) =>{
            pkl += `${this.stateToPKL(state, indentLevel + 2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}]\n`

        pkl += `${this.getIndent(indentLevel + 1)}stateMachines: [\n`
        description.stateMachines.forEach((stateMachine) =>{
            pkl += `${this.stateMachineToPKL(stateMachine, indentLevel + 2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}]\n`
        pkl += `${this.getIndent(indentLevel + 1)}localContext: []\n`
        pkl += `${this.getIndent(indentLevel + 1)}persistentContext: []\n`
        pkl += `${this.getIndent(indentLevel)}}\n`






        return pkl;

    }

    public static collaborativeStateMachineToPKL(description: CollaborativeStateMachineDescription, indentLevel = 0) {
        let pkl = `${this.getIndent(indentLevel)}{\n`
        pkl += `${this.getIndent(indentLevel + 1)}name: "${description.name}"\n`
        pkl += `${this.getIndent(indentLevel + 1)}version: "${description.version}"\n`

        pkl += `${this.getIndent(indentLevel + 1)}stateMachines: [\n`
        description.stateMachines.forEach((stateMachine) =>{
            pkl += `${this.stateMachineToPKL(stateMachine, indentLevel +2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}]\n`
        pkl += `${this.getIndent(indentLevel + 1)}localContext: []\n`
        pkl += `${this.getIndent(indentLevel + 1)}persistentContext: []\n`
        pkl += `${this.getIndent(indentLevel)}}\n`



        return pkl;

    }


    private static getIndent(level: number): string {
        return '\t'.repeat(level);
    }

}
