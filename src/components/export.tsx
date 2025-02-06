import {useCallback, useContext} from "react";
import {isState, isStateMachine, ReactFlowContextProps} from "../types.ts";
import {ReactFlowContext} from "../utils.tsx";
import StateMachine from "../classes/stateMachine.ts";
import PklService from "../services/pklService.tsx";


export default function Export () {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {nodes, stateOrStateMachineService, csm} = context;

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

    const rearrangeTransitions = useCallback(() => {
        nodes.forEach((node) => {
            if(isState(node.data)){
                node.data.state.rearrangeTransitions()
            }
        })
    },[nodes])


    const onButtonClick = useCallback(() => {
        clearAllStatemachines()
        rearrangeTransitions()
        addStatesToStatemachines();
        const topLevelSM = createTopLevelStatemachine();
        console.log(topLevelSM.toDescription())


        csm.stateMachines = topLevelSM.getAllStateMachines()

        const collaborativeStateMachineDescription = csm.toDescription()

        const pkl: string = PklService.collaborativeStateMachineToPKL(collaborativeStateMachineDescription);

        const blob = new Blob([pkl], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'content.pkl';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);






    },[addStatesToStatemachines, clearAllStatemachines, createTopLevelStatemachine, rearrangeTransitions])



    return(
        <button className="button" onClick={onButtonClick}>Export</button>
    )


}