import {useCallback, useContext} from "react";
import {isStateMachine, ReactFlowContextProps} from "../types.ts";
import {ReactFlowContext} from "../utils.tsx";
import StateMachine from "../classes/stateMachine.ts";
import {CollaborativeStateMachineDescription} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";
import PklService from "../services/pklService.tsx";


export default function Export () {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {nodes, stateOrStateMachineService} = context;

    const addStatesToStatemachines = useCallback(() => {
        nodes.forEach((node) => {
            if(node.extent === "parent" && node.parentId){
                const parent = stateOrStateMachineService.getLinkedStateOrStatemachine(node.parentId) as StateMachine;
                stateOrStateMachineService.addStateToStatemachine(parent,node.data)

            }
        })
    },[nodes, stateOrStateMachineService])

    const createTopLevelStatemachine = useCallback(() => {
        const topLevelSM = new StateMachine("Example");
        nodes.forEach((node) => {
            if(node.extent !== "parent"){
                stateOrStateMachineService.addStateToStatemachine(topLevelSM, node.data);
            }
        })
        return topLevelSM;
    },[nodes, stateOrStateMachineService])
    
    const clearAllStatemachines = useCallback(() => {
        nodes.forEach((node) => {
            if(isStateMachine(node.data)){
                node.data.stateMachine.clearStates()
            }
        })
    },[nodes])


    const onButtonClick = useCallback(() => {
        clearAllStatemachines()
        addStatesToStatemachines();
        const topLevelSM = createTopLevelStatemachine();
        console.log(topLevelSM.toDescription())


        const collaborativeStateMachineDescription: CollaborativeStateMachineDescription = {
            localContext: {variables: []},
            name: "Collaborative StateMachine",
            persistentContext: {variables: []},
            stateMachines: topLevelSM.getAllStateMachines().map((sm) => sm.toDescription()),
            version: "2.0"

        }

        const pkl: string = PklService.collaborativeStateMachineToPKL(collaborativeStateMachineDescription);

        const blob = new Blob([pkl], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'content.pkl';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);






    },[addStatesToStatemachines, clearAllStatemachines, createTopLevelStatemachine])



    return(
        <button className="button" onClick={onButtonClick}>Export</button>
    )


}