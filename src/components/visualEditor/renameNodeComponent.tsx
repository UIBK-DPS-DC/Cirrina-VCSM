import React, {useCallback, useContext, useEffect, useState} from "react";
import {ReactFlowContext} from "../../utils.ts";
import {ReactFlowContextProps} from "../../types.ts";

export default function RenameNodeComponent() {
    const INPUT_FIELD_NAME = "placeholder"
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
    const updateTransitionsOnRename = useCallback((oldName: string, newName: string) => {
        setEdges(edges => edges.map(edge => {
            if (edge.data?.transition) {
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

        if (!stateOrStateMachineService.isNameUnique(newName) && newName !== oldName) {
            console.error(`StateOrStateMachine name ${newName} already exists!`);
            return;
        }

        if (newName && newName !== oldName) {
            const newNodes = nodes.map(node => {
                if (node.id === selectedNode.id) {
                    const newData = stateOrStateMachineService.setName(newName, node.data);
                    return { ...node, data: newData };
                }
                return node;
            });

            stateOrStateMachineService.unregisterName(oldName);
            stateOrStateMachineService.registerName(newName);
            setNodes(newNodes);
            updateTransitionsOnRename(oldName, newName);
        }

    },[nodes, selectedNode, setNodes, stateOrStateMachineService, updateTransitionsOnRename])



    return (
        <div className={"rename-node-form-container"}>
            <form onSubmit={onFormSubmit}>
                <input type={"text"} name={INPUT_FIELD_NAME} value={nodeNameInput} onChange={onNodeNameInputChange}/>
                <button type={"submit"}>Save</button>
            </form>
        </div>
    )
}