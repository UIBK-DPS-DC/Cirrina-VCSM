import {Button} from "react-bootstrap";
import React, {useContext, useRef} from "react";
import {CollaborativeStateMachineDescription} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";
import {fromCollaborativeStatemachineDescription, ReactFlowContext} from "../utils.tsx";
import {CsmNodeProps, isStateMachine, ReactFlowContextProps} from "../types.ts";
import State from "../classes/state.ts";
import {Node} from "@xyflow/react";
import StateMachine from "../classes/stateMachine.ts";
import {NO_PARENT} from "../services/stateOrStateMachineService.tsx";


let nodeId = 0;
let edgeId = 0;
const getNewNodeId = () => `node_${nodeId++}`;
const getNewEdgeId = () => `edge_${edgeId++}`;

export default function Import() {
    const inputFile = useRef<HTMLInputElement | null>(null);
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {contextService,
        eventService,
        stateOrStateMachineService,
        actionService ,
        guardService,
        nodes, setNodes} = context

    // Function to handle the button click and trigger the file input click
    const handleButtonClick = () => {
        if (inputFile.current) {
            inputFile.current.click(); // Trigger click on the hidden file input
        }
    };

    const resetServices = () => {
        contextService.resetService()
        eventService.resetService()
        stateOrStateMachineService.resetService()
        actionService.resetService()
        guardService.resetService()
    }




    const generateNodes = (statemachines: StateMachine[], parentId: string | NO_PARENT): Node<CsmNodeProps>[] => {
        let nodes: Node<CsmNodeProps>[] = []

        statemachines.forEach(machine => {
            nodes.push(statemachineToNode(machine, parentId))
            const states = machine.getAllStates()
            states.forEach(state => {
                nodes.push(stateToNode(state, machine.nodeId))
            })
            const nestedStatemachines = machine.getAllStateMachines()
            nodes = nodes.concat(generateNodes(nestedStatemachines, machine.nodeId))
        })

        return nodes
    }

    // TODO: Add background, default size etc
    const statemachineToNode = (statemachine: StateMachine, parentId: string | NO_PARENT): Node<CsmNodeProps> => {
        const id = getNewNodeId()
        statemachine.nodeId = id
        if(parentId === NO_PARENT){
            return {
                position: {x: 0, y: 0},
                data: {stateMachine: statemachine}, id: id, type: "state-machine-node"

            }
        }
        // TODO: Probably add calls to action service here?
        else {
            return {
                position: {x: 0, y: 0},
                data: {stateMachine: statemachine}, extent: "parent", id: id, parentId: parentId, type: "state-machine-node"

            }
        }
    }

    const stateToNode = (state: State, parentId: string): Node<CsmNodeProps> => {
        const id = getNewNodeId()
        state.nodeId = id
        return {
            position: {x: 0, y: 0},
            data: {state: state}, extent: "parent", id: id, parentId: parentId, type: "state-node"

        }
    }


    const loadCSM = (description: CollaborativeStateMachineDescription) => {
        // Get top level statemachines
        const topLevelStatemachines = fromCollaborativeStatemachineDescription(description)
        console.log("NUM TOP STATEMACHINES:" , topLevelStatemachines.length)
        // Get all state and statemachines


        resetServices()
        const nodes = generateNodes(topLevelStatemachines, NO_PARENT)

        nodes.forEach((n) => {
            if(isStateMachine(n.data)){
                console.log(n.data.stateMachine.name)
            }
        })
        setNodes(nodes)



    }

    // Function to handle file selection
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0]; // Get the selected file
            const fileName = file.name;
            const fileContent = await file.text(); // Read file content as text

            // Send file data to the server
            fetch('http://localhost:3001/save-file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName,
                    fileContent,
                }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to save file.');
                    }
                    return response.json(); // Parse the response as JSON
                })
                .then(data => {
                    // Access the returned object from the server here
                    console.log('Response from server:', data);
                    loadCSM(data as CollaborativeStateMachineDescription)
                    // You can use the returned data here
                })
                .catch(error => {
                    console.error('Error saving file:', error);
                });
        }
    };

    return (
        <>
            <Button onClick={handleButtonClick}>
                Import
            </Button>
            <input
                type="file"
                accept=".pkl" // Limit file types to .pkl
                ref={inputFile}
                style={{ display: 'none' }} // Hide the input element
                onChange={handleFileChange} // Handle file selection
            />
        </>
    );
}
