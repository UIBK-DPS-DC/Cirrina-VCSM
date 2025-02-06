
import PklService from "../src/services/pklService";
import {EventChannel} from "../src/enums";
import {
    CollaborativeStateMachineDescription,
    ContextDescription,
    ContextVariableDescription,
    ContextVariableReferenceDescription,
    CreateActionDescription,
    EventDescription,
    GuardDescription,
    InvokeActionDescription,
    OnTransitionDescription,
    StateDescription,
    StateMachineDescription,
    TransitionDescription
} from "../src/pkl/bindings/collaborative_state_machine_description.pkl";


describe('Guard.toPKL', () => {



    it("Context", () => {
        const contextVariableDescription: ContextVariableDescription = {
            name: "contextName", value: "contextValue"

        }

        console.log(PklService.contextVariableDescriptionToPKL(contextVariableDescription,0,false))
    })

    it ("Context Description", () => {
        const contextVariableDescription1: ContextVariableDescription = {
            name: "contextName2", value: "contextValue2"

        }
        const contextVariableDescription2: ContextVariableDescription = {
            name: "contextName2", value: "contextValue2"

        }

        const contextVariableDescription3: ContextVariableDescription = {
            name: "contextName3", value: "contextValue3"

        }
        const contextDescription: ContextDescription = {
            variables: [contextVariableDescription1, contextVariableDescription2, contextVariableDescription3]

        }

        console.log(PklService.contextDescriptionToPKL(contextDescription))
    })



    it("ContextReference", () => {
        const contextReferenceDescription: ContextVariableReferenceDescription = {
            reference: "example"

        }

        console.log(PklService.contextReferenceToPKL(contextReferenceDescription));
    })

    it("Event", () => {
        const contextDescription1: ContextVariableDescription = {
            name: "contextName1", value: "contextValue1"

        }
        const contextDescription2: ContextVariableDescription = {
            name: "contextName2", value: "contextValue2"

        }
        const contextDescription3: ContextVariableDescription = {
            name: "contextName3", value: "contextValue3"

        }
        const eventDescription: EventDescription = {
            channel: EventChannel.GLOBAL,
            data: [contextDescription1,contextDescription2,contextDescription3],
            name: "Event Name"

        }

        console.log(PklService.eventToPKL(eventDescription))


    })

    it ("onTransitionDescription", () => {
        const onTransitionDescription: OnTransitionDescription = {
            actions: [],
            else: "Else",
            event: "Event a",
            guards: [],
            target: ""
        }

        console.log(PklService.onTransitionDescriptionToPKL(onTransitionDescription));
    })

    it("State", () => {
        const actionDescription1: InvokeActionDescription = {
            done: [], input: [], isLocal: false, output: [], serviceType: "Service type",
            type: "invoke"

        }

        const actionDescription2: CreateActionDescription = {
            isPersistent: false, type: "create", variable: {name: "Variable name", value: "2 + 2"}


        }

        const actions = [actionDescription1,actionDescription2];

        const transitionDescription: TransitionDescription = {
            actions: [], else: "", guards: [], target: ""

        }

        const guardDescription: GuardDescription = {
            expression: "a > 5"

        }

        const onTransitionDescription: OnTransitionDescription = {
            actions: actions, else: "", event: "Transition Event", guards: [guardDescription], target: "targetState"

        }

        const stateDescription: StateDescription = {
            after: actions,
            always: [transitionDescription],
            entry: actions,
            exit: actions,
            initial: false,
            localContext: {variables: []},
            name: "StateName",
            on: [onTransitionDescription],
            persistentContext: {variables: []},
            staticContext: {variables: []},
            terminal: false,
            while: actions

        }

        console.log(PklService.stateToPKL(stateDescription))
    })

    it("StateMachine", () => {
        const actionDescription1: InvokeActionDescription = {
            done: [], input: [], isLocal: false, output: [], serviceType: "Service type",
            type: "invoke"

        }

        const actionDescription2: CreateActionDescription = {
            isPersistent: false, type: "create", variable: {name: "Variable name", value: "2 + 2"}


        }

        const actions = [actionDescription1,actionDescription2];

        const transitionDescription: TransitionDescription = {
            actions: [], else: "", guards: [], target: ""

        }

        const guardDescription: GuardDescription = {
            expression: "a > 5"

        }

        const onTransitionDescription: OnTransitionDescription = {
            actions: actions, else: "", event: "Transition Event", guards: [guardDescription], target: "targetState"

        }

        const stateDescription1: StateDescription = {
            after: actions,
            always: [transitionDescription],
            entry: actions,
            exit: actions,
            initial: false,
            localContext: {variables: []},
            name: "StateName",
            on: [onTransitionDescription],
            persistentContext: {variables: []},
            staticContext: {variables: []},
            terminal: false,
            while: actions

        }

        const stateDescription2: StateDescription = {
            after: actions,
            always: [transitionDescription],
            entry: actions,
            exit: actions,
            initial: false,
            localContext: {variables: []},
            name: "StateName",
            on: [onTransitionDescription],
            persistentContext: {variables: []},
            staticContext: {variables: []},
            terminal: false,
            while: actions

        }

        const states = [stateDescription1,stateDescription2]

        const stateMachineDescription1: StateMachineDescription = {
            localContext: {variables: []},
            name: "StateMachine",
            persistentContext: {variables: []},
            stateMachines: [],
            states: states

        }

        const stateMachineDescription2: StateMachineDescription = {
            localContext: {variables: []},
            name: "StateMachine",
            persistentContext: {variables: []},
            stateMachines: [stateMachineDescription1],
            states: states

        }

        console.log(PklService.stateMachineToPKL(stateMachineDescription2))

    })

    it("CollaborativeStateMachine", () => {
        const actionDescription1: InvokeActionDescription = {
            done: [], input: [], isLocal: false, output: [], serviceType: "Service type",
            type: "invoke"

        }

        const actionDescription2: CreateActionDescription = {
            isPersistent: false, type: "create", variable: {name: "Variable name", value: "2 + 2"}


        }

        const actions = [actionDescription1,actionDescription2];

        const transitionDescription: TransitionDescription = {
            actions: [], else: "", guards: [], target: ""

        }

        const guardDescription: GuardDescription = {
            expression: "a > 5"

        }

        const onTransitionDescription: OnTransitionDescription = {
            actions: actions, else: "", event: "Transition Event", guards: [guardDescription], target: "targetState"

        }

        const stateDescription1: StateDescription = {
            after: actions,
            always: [transitionDescription],
            entry: actions,
            exit: actions,
            initial: false,
            localContext: {variables: []},
            name: "StateName",
            on: [onTransitionDescription],
            persistentContext: {variables: []},
            staticContext: {variables: []},
            terminal: false,
            while: actions

        }

        const stateDescription2: StateDescription = {
            after: actions,
            always: [transitionDescription],
            entry: actions,
            exit: actions,
            initial: false,
            localContext: {variables: []},
            name: "StateName",
            on: [onTransitionDescription],
            persistentContext: {variables: []},
            staticContext: {variables: []},
            terminal: false,
            while: actions

        }

        const states = [stateDescription1,stateDescription2]

        const stateMachineDescription1: StateMachineDescription = {
            localContext: {variables: []},
            name: "StateMachine",
            persistentContext: {variables: []},
            stateMachines: [],
            states: states

        }

        const stateMachineDescription2: StateMachineDescription = {
            localContext: {variables: []},
            name: "StateMachine",
            persistentContext: {variables: []},
            stateMachines: [stateMachineDescription1],
            states: states

        }

        const collaborativeStateMachineDescription: CollaborativeStateMachineDescription = {
            localContext: {variables: []},
            name: "CollaborativeStatemachine",
            persistentContext: {variables: []},
            stateMachines: [stateMachineDescription1, stateMachineDescription2],
            version: "2.0"

        }

        console.log(PklService.collaborativeStateMachineToPKL(collaborativeStateMachineDescription))
    })


});
