import React, { useCallback, useContext, useEffect } from "react";
import { ReactFlowContext } from "./flow.tsx";
import { ReactFlowContextProps } from "../types.ts";

/**
 * NodeInfoForm Component
 *
 * This component renders a form that displays the properties of a selected node
 * and allows the user to update them. The form includes an input field for the
 * node name, which is pre-filled with the current name of the selected node.
 * Changes to the input field are reflected in the component state, and submitting
 * the form updates the node's name in the context.
 *
 * @component
 * @example
 * return (
 *   <NodeInfoForm />
 * )
 */
export default function NodeInfoForm() {
    const context: ReactFlowContextProps = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {
        nodes,
        setNodes,
        selectedNode,
        stateOrStateMachineService,
        showSidebar,
        nameInput,
        setNameInput,
        setEdges
    } = context;

    /**
     * useEffect hook to update the name input field when the selected node changes.
     */
    useEffect(() => {
        if (selectedNode) {
            setNameInput(stateOrStateMachineService.getName(selectedNode.data));
        }
    }, [selectedNode, setNameInput, stateOrStateMachineService]);

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

    const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedNode) return;

        const formElements = event.currentTarget.elements as typeof event.currentTarget.elements & {
            name: HTMLInputElement
        };

        const newName = formElements.name.value;
        const oldName = stateOrStateMachineService.getName(selectedNode.data);

        if (!stateOrStateMachineService.isNameUnique(newName) && newName !== oldName) {
            console.error(`StateOrStateMachine name ${newName} already exists!`);
            return;
        }

        if (newName !== oldName) {
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
    }, [nodes, setNodes, selectedNode, stateOrStateMachineService, updateTransitionsOnRename]);

    const onNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameInput(event.target.value);
    };

    return (
        showSidebar && selectedNode && (
            <div className="node-form">
                <form onSubmit={onFormSubmit}>
                    <h3>Hi mom! It's me {stateOrStateMachineService.getName(selectedNode.data)}!</h3>
                    <label htmlFor="name">Name: </label>
                    <input type="text" id="name" name="name" value={nameInput} onChange={onNameInputChange} />
                    <button type="submit">Save Changes</button>
                </form>
            </div>
        )
    );
}
