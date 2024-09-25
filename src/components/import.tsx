// Make sure all required imports are correct and in place
import { Button } from "react-bootstrap";
import React, { useContext, useRef } from "react";
import { CollaborativeStateMachineDescription } from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";
import { fromCollaborativeStatemachineDescription, ReactFlowContext } from "../utils.tsx";
import { CsmEdgeProps, CsmNodeProps, isState, isStateMachine, ReactFlowContextProps } from "../types.ts";
import State from "../classes/state.ts";
import { Edge, Node } from "@xyflow/react";
import StateMachine from "../classes/stateMachine.ts";
import { NO_PARENT } from "../services/stateOrStateMachineService.tsx";
import ELK, { ElkNode } from 'elkjs/lib/elk.bundled.js';
import { PortSide } from "../enums.ts";

// Define the layout options for ELK
const layoutOptions = {
    'elk.algorithm': 'layered',
    'elk.direction': 'RIGHT',
    'elk.layered.spacing.edgeNodeBetweenLayers': '40',
    'elk.spacing.nodeNode': '40',
    'elk.layered.nodePlacement.strategy': 'SIMPLE',
};

// Create an ELK instance
const elk = new ELK();

// Utility functions to generate unique IDs for nodes and edges
let nodeId = 0;
let edgeId = 0;
const getNewNodeId = () => `node_${nodeId++}`;
const getNewEdgeId = () => `edge_${edgeId++}`;

// Import component definition
export default function Import() {
    // Set up ref and context
    const inputFile = useRef<HTMLInputElement | null>(null);
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const { contextService, eventService, stateOrStateMachineService, actionService, guardService, nodes, setNodes } = context;

    // Helper functions to map target and source sides for ports
    const getTargetSide = (t: { id: "t-t" } | { id: "r-t" } | { id: "l-t" } | { id: "b-t" }) => {
        switch (t.id) {
            case "t-t": return PortSide.NORTH;
            case "r-t": return PortSide.EAST;
            case "b-t": return PortSide.SOUTH;
            case "l-t": return PortSide.WEST;
            default: return PortSide.NORTH;
        }
    };

    const getSourceSide = (s: { id: "t-s" } | { id: "r-s" } | { id: "l-s" } | { id: "b-s" }) => {
        switch (s.id) {
            case "t-s": return PortSide.NORTH;
            case "r-s": return PortSide.EAST;
            case "b-s": return PortSide.SOUTH;
            case "l-s": return PortSide.WEST;
            default: return PortSide.NORTH;
        }
    };

    // Correctly typed and defined getLayoutedNodes function
    const getLayoutedNodes = async (
        nodes: Node<CsmNodeProps>[],
        edges: Edge<CsmEdgeProps>[]
    ): Promise<Node<CsmNodeProps>[]> => {
        const graph = {
            id: 'root',
            layoutOptions,
            children: nodes.map((n) => {
                const targetHandles = isState(n.data) ? State.TARGET_HANDLES : StateMachine.TARGET_HANDLES;
                const targetPorts = targetHandles.map((t) => ({
                    id: t.id,
                    properties: {
                        side: getTargetSide(t),
                    },
                }));

                const sourceHandles = isState(n.data) ? State.SOURCE_HANDLES : StateMachine.SOURCE_HANDLES;
                const sourcePorts = sourceHandles.map((s) => ({
                    id: s.id,
                    properties: {
                        side: getSourceSide(s),
                    },
                }));

                return {
                    id: n.id,
                    width: n.width ?? 150,
                    height: n.height ?? 50,
                    properties: {
                        'org.eclipse.elk.portConstraints': 'FIXED_ORDER',
                    },
                    ports: [{ id: n.id }, ...targetPorts, ...sourcePorts],
                };
            }),
            edges: edges.map((e) => ({
                id: e.id,
                sources: [e.sourceHandle || e.source],
                targets: [e.targetHandle || e.target],
            })),
        };

        // Await the ELK layout result
        const layoutedGraph = await elk.layout(graph);

        // Map the result to return updated nodes with positions
        const layoutedNodes = nodes.map((node) => {
            const layoutedNode = layoutedGraph.children?.find((lgNode: ElkNode) => lgNode.id === node.id);
            return {
                ...node,
                position: {
                    x: layoutedNode?.x ?? 0,
                    y: layoutedNode?.y ?? 0,
                },
            };
        });

        return layoutedNodes;
    };

    // Function to handle file input button click
    const handleButtonClick = () => {
        if (inputFile.current) {
            inputFile.current.click();
        }
    };

    // Function to reset services in the context
    const resetServices = () => {
        contextService.resetService();
        eventService.resetService();
        stateOrStateMachineService.resetService();
        actionService.resetService();
        guardService.resetService();
    };

    // Function to generate nodes recursively
    const generateNodes = (statemachines: StateMachine[], parentId: string | NO_PARENT): Node<CsmNodeProps>[] => {
        let nodes: Node<CsmNodeProps>[] = [];
        statemachines.forEach((machine) => {
            nodes.push(statemachineToNode(machine, parentId));
            const states = machine.getAllStates();
            states.forEach((state) => {
                nodes.push(stateToNode(state, machine.nodeId));
            });
            const nestedStatemachines = machine.getAllStateMachines();
            nodes = nodes.concat(generateNodes(nestedStatemachines, machine.nodeId));
        });
        return nodes;
    };

    // Convert statemachine to node
    const statemachineToNode = (statemachine: StateMachine, parentId: string | NO_PARENT): Node<CsmNodeProps> => {
        const id = getNewNodeId();
        statemachine.nodeId = id;
        if (parentId === NO_PARENT) {
            return {
                position: { x: 0, y: 0 },
                data: { stateMachine: statemachine },
                id: id,
                type: "state-machine-node",
                expandParent: true
            };
        } else {
            return {
                position: { x: 0, y: 0 },
                data: { stateMachine: statemachine },
                extent: "parent",
                id: id,
                parentId: parentId,
                type: "state-machine-node",
                expandParent: true
            };
        }
    };

    // Convert state to node
    const stateToNode = (state: State, parentId: string): Node<CsmNodeProps> => {
        const id = getNewNodeId();
        state.nodeId = id;
        return {
            position: { x: 0, y: 0 },
            data: { state: state },
            extent: "parent",
            id: id,
            parentId: parentId,
            type: "state-node",
            expandParent: true
        };
    };

    // Load the Collaborative State Machine description and generate nodes
    const loadCSM = async (description: CollaborativeStateMachineDescription) => {
        const topLevelStatemachines = fromCollaborativeStatemachineDescription(description);
        resetServices();
        const nodes = generateNodes(topLevelStatemachines, NO_PARENT);

        try {
            // Await the layouted nodes
            const layoutedNodes = await getLayoutedNodes(nodes, []);
            setNodes(layoutedNodes);
        } catch (error) {
            console.error("Error in laying out nodes:", error);
        }
    };

    // Function to handle file selection and load the CSM
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const fileName = file.name;
            const fileContent = await file.text();

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
                    return response.json();
                })
                .then(data => {
                    loadCSM(data as CollaborativeStateMachineDescription);
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
                accept=".pkl"
                ref={inputFile}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </>
    );
}
