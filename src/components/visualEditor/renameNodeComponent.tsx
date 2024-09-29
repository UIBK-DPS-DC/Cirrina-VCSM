import React, {useCallback, useContext, useEffect, useState} from "react";
import {Form, Button} from "react-bootstrap";
import {getAllStateNamesInExtent, ReactFlowContext} from "../../utils.tsx";
import {isStateMachine, ReactFlowContextProps} from "../../types.ts";
import {NO_PARENT} from "../../services/stateOrStateMachineService.tsx";

export default function RenameNodeComponent() {
    const INPUT_FIELD_NAME = "placeholder";
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const [nodeNameInput, setNodeNameInput] = useState<string>("");
    const {
        selectedNode,
        nodes,
        setNodes,
        setEdges,
        stateOrStateMachineService
    } = context;

    useEffect(() => {
        if (selectedNode) {
            setNodeNameInput(stateOrStateMachineService.getName(selectedNode.data));
        }
    }, [selectedNode, stateOrStateMachineService]);








    /**
     * Updates the transitions when a node is renamed.
     *
     * This function updates the source and target names of transitions in the edges
     * whenever a node is renamed. It ensures that any transition involving the renamed
     * node reflects the new name.
     *
     * @param {string} oldName - The old name of the node before renaming.
     * @param {string} newName - The new name of the node after renaming.
     */
    const updateTransitionsOnRename = useCallback((oldName: string, newName: string, nodeId: string) => {
        setEdges(edges => edges.map(edge => {
            if (edge.data?.transition && (edge.source === nodeId || edge.target === nodeId)) {
                const transition = edge.data.transition;
                let updated = false;
                if (transition.getSource() === oldName) {
                    transition.setSource(newName);
                    updated = true;
                }
                if (transition.getTarget() === oldName) {
                    transition.setTarget(newName);
                    updated = true;
                }
                if(transition.getElse() === oldName) {
                    transition.setElse(newName);
                }
                if (updated) {
                    return { ...edge, data: { ...edge.data, transition } };
                }
            }
            return edge;
        }));
    }, [setEdges]);

    const onNodeNameInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setNodeNameInput(event.target.value);
    },[setNodeNameInput]);

    const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!selectedNode){
            return;
        }

        const formElements = event.currentTarget.elements as typeof event.currentTarget.elements & {
            [INPUT_FIELD_NAME]: HTMLInputElement
        };
        const newName = formElements[INPUT_FIELD_NAME]?.value;
        console.log(`Logging NEW NAME FROM COMPONENT ${newName}`);

        const oldName = stateOrStateMachineService.getName(selectedNode.data);
        const parentID = selectedNode.parentId  || NO_PARENT;


        console.log("NAMES");
        getAllStateNamesInExtent(selectedNode,nodes,stateOrStateMachineService).forEach((n) =>{
            console.log(n)
        })
        if (getAllStateNamesInExtent(selectedNode,nodes,stateOrStateMachineService).has(newName) && newName !== oldName && parentID !== NO_PARENT) {
            console.error(`StateOrStateMachine name ${newName} already exists!`);
            return;
        }

        if(parentID === NO_PARENT) {
            console.log(`${newName}`)
            // Check if name exists on the highest level.
            if(oldName !== newName && stateOrStateMachineService.stateMachineHasState(newName, parentID)){
                console.error("Name already exists!")
                return;
            }

            if(isStateMachine(selectedNode.data) && getAllStateNamesInExtent(selectedNode, nodes,stateOrStateMachineService).has(newName)){
                console.error(`StateOrStateMachine name ${newName} already exists in extent of ${selectedNode.id}!`);
                return
            }


        }

        if (newName && newName !== oldName) {
            const newNodes = nodes.map(node => {
                if (node.id === selectedNode.id) {
                    const newData = stateOrStateMachineService.setName(newName, node.data);
                    return { ...node, data: newData };
                }
                return node;
            });

            stateOrStateMachineService.unregisterName(oldName)
            stateOrStateMachineService.registerName(newName)
            stateOrStateMachineService.unlinkStateNameFromStatemachine(oldName, parentID);
            stateOrStateMachineService.linkStateNameToStatemachine(newName, parentID, true);
            setNodes(newNodes);
            updateTransitionsOnRename(oldName, newName, selectedNode.id);
        }

    },[nodes, selectedNode, setNodes, stateOrStateMachineService, updateTransitionsOnRename])

    return (
        <div className={"rename-node-form-container"}>
            <Form onSubmit={onFormSubmit}>
                <Form.Group controlId="rename-node-form" className={"mb-3"}>
                    <Form.Label>Node Name</Form.Label>
                    <Form.Control
                        type="text"
                        name={INPUT_FIELD_NAME}
                        value={nodeNameInput}
                        onChange={onNodeNameInputChange}
                        placeholder="Enter node name"
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </Form>
        </div>
    );
}
