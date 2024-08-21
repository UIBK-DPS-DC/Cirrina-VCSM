import {useCallback, useContext} from "react";
import {isStateMachine, ReactFlowContextProps} from "../types.ts";
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

        const dict = {
            version: "0.0.0.1",
            name: topLevelSM.name,
            description: "This is a test",
            memoryMode: "distributed",
            stateMachines : {
                [topLevelSM.name]: topLevelSM.toDICT()
            }

        }

        console.log("Edges")
        edges.forEach((edge) => {
            console.log(edge.id)
        })

        const content = JSON.stringify(dict, null, 2);


        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'content.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);





    },[addStatesToStatemachines, clearAllStatemachines, createTopLevelStatemachine, edges])



    return(
        <button className="button" onClick={onButtonClick}>Export</button>
    )


}