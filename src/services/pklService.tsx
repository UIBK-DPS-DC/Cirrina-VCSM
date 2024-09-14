import {
    ActionDescription,
    AssignActionDescription,
    CollaborativeStateMachineDescription, ContextDescription,
    ContextVariableDescription,
    ContextVariableReferenceDescription,
    CreateActionDescription,
    EventDescription,
    GuardDescription,
    InvokeActionDescription, MatchActionDescription, MatchCaseDescription,
    OnTransitionDescription,
    RaiseActionDescription,
    StateDescription,
    StateMachineDescription, TransitionDescription
} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";
import {ActionType} from "../enums.ts";

export default class PklService {
    public static guardToPKL(description: GuardDescription, indentLevel = 0){
        let pkl =`${this.getIndent(indentLevel)}new {\n`;
        pkl+= `${this.getIndent(indentLevel + 1)}expression = "${description.expression}"\n`
        pkl+= `${this.getIndent(indentLevel)}}\n`
        return pkl
    }



    public static actionToPKL(description: ActionDescription, indentLevel = 0): string {
        let pkl = ""
        switch(description.type){
            case ActionType.RAISE_EVENT: {
                pkl += `${this.getIndent(indentLevel)}new RaiseActionDescription {\n`
                const raiseEventDescription = description as RaiseActionDescription
                pkl+= `${this.getIndent(indentLevel + 1)}type = "${raiseEventDescription.type}"\n`
                pkl += `${this.eventToPKL(raiseEventDescription.event, indentLevel + 1)}`
                pkl+= `${this.getIndent(indentLevel)}}\n`

                return pkl;

            }
            case ActionType.INVOKE: {
                const invokeDescription = description as InvokeActionDescription
                pkl += `${this.getIndent(indentLevel)}new InvokeActionDescription {\n`
                pkl += `${this.getIndent(indentLevel + 1)}type = "${invokeDescription.type}"\n`

                pkl += `${this.getIndent(indentLevel + 1)}done {\n`
                invokeDescription.done.forEach(event => {
                    pkl += `${this.eventToPKL(event, indentLevel +2)}\n`
                })
                pkl += `${this.getIndent(indentLevel + 1)}}\n`


                pkl += `${this.getIndent(indentLevel + 1)}input {\n`
                invokeDescription.input.forEach(context => {
                    pkl += `${this.contextVariableDescriptionToPKL(context, indentLevel +2,true)}\n`
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
            case ActionType.CREATE: {
                const createDescription = description as CreateActionDescription as CreateActionDescription

                pkl += `${this.getIndent(indentLevel)}new CreateActionDescription {\n`

                pkl += `${this.contextVariableDescriptionToPKL(createDescription.variable, indentLevel + 1,false)}\n`
                pkl += `${this.getIndent(indentLevel + 1)}isPersistent = ${createDescription.isPersistent}\n`

                pkl += `${this.getIndent(indentLevel)}}\n`


                return pkl;
            }
            case ActionType.ASSIGN: {
                const assignDescription = description as AssignActionDescription
                pkl += `${this.getIndent(indentLevel)}new AssignActionDescription {\n`

                pkl += `${this.contextVariableDescriptionToPKL(assignDescription.variable, indentLevel + 1,false)}\n`

                pkl+= `${this.getIndent(indentLevel)}}\n`
                return pkl
            }

            case ActionType.MATCH: {
                const matchDescription = description as MatchActionDescription

                pkl += `${this.getIndent(indentLevel)}new MatchActionDescription {\n`

                pkl += `${this.getIndent(indentLevel + 1)}value = "${matchDescription.value}"`
                pkl += `${this.getIndent(indentLevel + 1)}`

                pkl += `${this.getIndent(indentLevel)}}\n`

                return pkl
            }


            // TODO continue here

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
            pkl += `${this.onTransitionDescriptionToPKL(action,indentLevel + 2)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}}\n`


        if(description.always){
            pkl += `${this.getIndent(indentLevel + 1)}always {\n`

            description.always.forEach((transition) =>{
                pkl += `${this.transitionDescriptionToPKL(transition,indentLevel + 2)}\n`
            })

            pkl += `${this.getIndent(indentLevel + 1)}}\n`
        }



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

        if(description.staticContext){
            pkl += `${this.getIndent(indentLevel + 1)}staticContext {\n`
            pkl +=  `${this.contextDescriptionToPKL(description.staticContext, indentLevel +2)}\n`
            pkl += `${this.getIndent(indentLevel + 1)}}\n`
        }
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

    public static contextVariableDescriptionToPKL(description: ContextVariableDescription, indentLevel = 0, isNew: boolean): string {
        let pkl = ""
        pkl += `${this.getIndent(indentLevel)}"${isNew? "new" : "variable"}" {\n`
        pkl += `${this.getIndent(indentLevel + 1)}name = "${description.name}"\n`
        pkl += `${this.getIndent(indentLevel + 1)}value = "${description.value}"\n`
        pkl += `${this.getIndent(indentLevel)}}\n`
        return pkl
    }

    public static eventToPKL(description : EventDescription, indentLevel = 0) {
        let pkl = `${this.getIndent(indentLevel)}event {\n`
        pkl += `${this.getIndent(indentLevel + 1)}name = "${description.name}"\n`
        pkl += `${this.getIndent(indentLevel + 1)}data {\n`
        description.data.forEach((context) =>{
            pkl+= `${this.contextVariableDescriptionToPKL(context, indentLevel + 2, true)}\n`
        })
        pkl += `${this.getIndent(indentLevel + 1)}}\n`
        pkl += `${this.getIndent(indentLevel + 1)}channel = "${description.channel}"\n`
        pkl += `${this.getIndent(indentLevel)}}\n`
        return pkl

    }

    public static contextReferenceToPKL(description: ContextVariableReferenceDescription, indentLevel = 0) {
        let pkl = ""
        pkl += `${this.getIndent(indentLevel)}new {\n`
        pkl += `${this.getIndent(indentLevel + 1)}reference = "${description.reference}"\n`
        pkl += `${this.getIndent(indentLevel)}}\n`
        return pkl;
    }

    public static contextDescriptionToPKL(description: ContextDescription, indentLevel = 0) {
        let pkl = ""
        pkl += `${this.getIndent(indentLevel)}variables {\n`
        description.variables.forEach((variable) => {
            pkl += `${this.contextVariableDescriptionToPKL(variable, indentLevel +2, true)}\n`
        })

        pkl += `${this.getIndent(indentLevel)}}\n`
        return pkl;
    }

    public static transitionDescriptionToPKL(description: TransitionDescription, indentLevel = 0) {
        let pkl = ""
        pkl += `${this.getIndent(indentLevel)}new {\n`

        if(description.target) {
            pkl += `${this.getIndent(indentLevel + 1)}target = "${description.target}"\n`
        }

        if(description.guards.length > 0){
            pkl += `${this.getIndent(indentLevel + 1)}guards {\n`

            description.guards.forEach((guard) => {
                pkl+= `${this.guardToPKL(guard, indentLevel +2)}\n`
            })

            pkl += `${this.getIndent(indentLevel + 1)}}\n`
        }

        if(description.actions.length > 0) {
            pkl += `${this.getIndent(indentLevel + 1)}actions {\n`

            description.actions.forEach((action) => {
                pkl += `${this.actionToPKL(action, indentLevel +2)}\n`
            })

            pkl +=  `${this.getIndent(indentLevel + 1)}}\n`
        }

        if(description.else) {
            pkl += `${this.getIndent(indentLevel + 1)}else = "${description.else}"\n`
        }




        pkl += `${this.getIndent(indentLevel)}}\n`
        return pkl
    }

    public static onTransitionDescriptionToPKL (description: OnTransitionDescription, indentLevel = 0) {
        let pkl = ""
        pkl += `${this.getIndent(indentLevel)} new {\n`

        pkl += `${this.getIndent(indentLevel + 1)}event = "${description.event}"\n`

        if(description.target){
            pkl += `${this.getIndent(indentLevel + 1)}target = "${description.target}"\n`
        }

        if(description.guards.length > 0){
            pkl+= `${this.getIndent(indentLevel + 1)}guards {\n`

            description.guards.forEach((guard) => {
                pkl+= `${this.guardToPKL(guard, indentLevel +2)}\n`
            })

            pkl+= `${this.getIndent(indentLevel + 1)}}\n`

        }

        if(description.actions.length > 0) {
            pkl += `${this.getIndent(indentLevel + 1)}actions {\n`

            description.actions.forEach((action) => {
                pkl+= `${this.actionToPKL(action, indentLevel +2)}\n`
            })

            pkl += `${this.getIndent(indentLevel + 1)}}\n`
        }

        if(description.else){
            pkl += `${this.getIndent(indentLevel + 1)}else = "${description.else}"\n`
        }


        pkl+= `${this.getIndent(indentLevel)}}\n`
        return pkl

    }

    public static matchCaseDescriptionToPKL(description: MatchCaseDescription, indentLevel = 0) {
        let pkl = ""
        pkl += `${this.getIndent(indentLevel)}new {\n`
        pkl += `${this.getIndent(indentLevel + 1)}\`case\` = ${description.case}\n`
        pkl += `${this.getIndent(indentLevel + 1)}action = ${this.actionToPKL(description.action,indentLevel + 1)}\n`


        pkl += `${this.getIndent(indentLevel)}}\n`
    }


    private static getIndent(level: number): string {
        return '\t'.repeat(level);
    }

}
