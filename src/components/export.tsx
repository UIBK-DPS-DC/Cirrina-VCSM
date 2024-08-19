import {useCallback, useContext} from "react";
import {ReactFlowContextProps} from "../types.ts";
import {ReactFlowContext} from "../utils.ts";
import StateMachine from "../classes/stateMachine.ts";

export default function Export () {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {nodes, edges, stateOrStateMachineService} = context;

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
            stateOrStateMachineService.addStateToStatemachine(topLevelSM, node.data);
        })
        return topLevelSM;
    },[nodes, stateOrStateMachineService])


    const onButtonClick = useCallback(() => {
        addStatesToStatemachines();
        const topLevelSM = createTopLevelStatemachine();

        console.log(topLevelSM);
        
        console.log("Edges")
        edges.forEach((edge) => {
            console.log(edge.id)
        })
    },[addStatesToStatemachines, createTopLevelStatemachine, edges])



    return(
        <button className="button" onClick={onButtonClick}>Export</button>
    )


}