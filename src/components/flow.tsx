import React, {useCallback, createContext, useMemo, useState} from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    type OnConnect, type NodeTypes, useReactFlow, Edge, Node, Connection
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { EntryNode } from "./Nodes/entryNode.tsx";
import { ExitNode } from "./Nodes/exitNode.tsx";
import { StateNode } from "./Nodes/stateNode.tsx";
import { StateMachineNode } from "./Nodes/stateMachineNode.tsx";
import StateOrStateMachineService from "../services/stateOrStateMachineService.tsx";
import {CsmEdgeProps, CsmNodeProps, ReactFlowContextProps} from "../types.ts";

import "../css/nodeForm.css"
import StateMachine from "../classes/stateMachine.ts";
import State from "../classes/state.ts";
import NodeInfoForm from "./nodeInfoForm.tsx";
import CsmEdge from "./csmEdgeComponent.tsx";

const nodeTypes = {
    'entry-node': EntryNode,
    'exit-node': ExitNode,
    'state-node': StateNode,
    'state-machine-node': StateMachineNode,
} satisfies NodeTypes;

const edgeTypes = {
    'csm-edge': CsmEdge,
}

const initialNodes: Node<CsmNodeProps>[] = [];
const initialEdges: Edge<CsmEdgeProps>[] = [];

export const ReactFlowContext = createContext({});

let nodeId = 0;
let edgeId = 0
const getNewNodeId = () => `node_${nodeId++}`;
const getNewEdgeId = () => `edge_${edgeId++}`;

export default function Flow() {

    const stateOrStateMachineService: StateOrStateMachineService = useMemo(() => new StateOrStateMachineService(), []);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node<CsmNodeProps> | null>(null)
    const [showSidebar, setShowSidebar] = useState(false);
    const [nameInput, setNameInput] = useState<string>("");
    const { getIntersectingNodes, screenToFlowPosition } = useReactFlow();

    const contextValue: ReactFlowContextProps = {
        nodes,
        setNodes,
        edges,
        setEdges,
        selectedNode,
        setSelectedNode,
        showSidebar,
        setShowSidebar,
        nameInput,
        setNameInput,
        stateOrStateMachineService
    }


    const onConnect: OnConnect = useCallback(
        (connection: Connection) => {
            const edge: Edge<CsmEdgeProps> = {id: getNewEdgeId(), ...connection, type: 'csm-edge' };
            setEdges((eds) => addEdge(edge, eds));
        },
        [setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const new_name: string = stateOrStateMachineService.generateUniqueName(type);
            stateOrStateMachineService.registerName(new_name);

            const newNode: Node<CsmNodeProps> = {
                id: getNewNodeId(),
                type,
                position,
                data: stateOrStateMachineService.getDefaultData(type, new_name),
            };

            // TODO add this to stylesheet
            if (type === 'state-machine-node') {
                newNode.style = {
                    background: 'transparent',
                    fontSize: 12,
                    border: '1px solid black',
                    padding: 5,
                    borderRadius: 15,
                    height: 150,
                };
            }

            console.log(`Created ${newNode.id}`);
            console.log(nodes)

            setNodes((nds) => {
                // Order is important for nesting to work. See https://reactflow.dev/learn/layouting/sub-flows
                if (type === 'state-machine-node') {

                    return [newNode, ...nds]; // Prepend state-machine-nodes to the beginning.
                } else {
                    return [...nds, newNode]; // Append other nodes to the end
                }
            });
        },
        [screenToFlowPosition, setNodes, stateOrStateMachineService],
    );


    const onNodeDragStop = useCallback(
        (_: React.MouseEvent, node: Node) => {
            const intersections = getIntersectingNodes(node, false);
            console.log("Intersection:", intersections)
            const intersectedBlock = intersections.findLast(
                (n) => n.type === "state-machine-node"
            );


            /** The parent always needs to before the child in the nodes array.
             * This bock moves the child node to the front of the parent node in the array to always ensure this*/
            if (intersectedBlock) {
                setNodes((ns: Node<CsmNodeProps> []) => {
                    ns = ns.filter(i => i.id !== node.id)
                    const index = ns.findIndex(i => i.id === intersectedBlock.id)
                    const firstPart = ns.slice(0, index + 1); // index + 1 because it splits at the index meaning the parent would be in the second part if not for the + 1
                    const secondPart = ns.slice(index + 1);
                    return [...firstPart, node as Node<CsmNodeProps>, ...secondPart];
                })


                setNodes((ns) =>
                    ns.map((n) => {
                        if (n.id === node.id) {
                            return {
                                ...n,
                                parentId: intersectedBlock.id,
                                extent: "parent",
                                ...(n.parentId !== intersectedBlock.id && {
                                    position: {
                                        x: 10,
                                        y: 10,
                                    },
                                }),
                            };
                        }
                        return {
                            ...n,
                            className: "",
                        };
                    }),
                );
            }
        },
        [setNodes, getIntersectingNodes],
    );

    const onNodesDelete = useCallback(
        (deletedNodes: Node[]) => {
            deletedNodes.map(
                (node) => {
                    switch (node.type) {
                        case "state-machine-node":
                            stateOrStateMachineService.unregisterName((node.data.stateMachine as StateMachine).name);
                            break;
                        case "state-node":
                            stateOrStateMachineService.unregisterName((node.data.state as State).name);
                            break;
                        default:
                            stateOrStateMachineService.unregisterName(node.data.name);
                    }
                }
            )
        }, [stateOrStateMachineService]
    )

    const onNodeClick =
        useCallback((_: React.MouseEvent, node: Node<CsmNodeProps>) => {
            setSelectedNode(node);
            setShowSidebar(true);
        }, [])

    const onPaneClick =
        useCallback(() => {
            setShowSidebar(false);
        }, [])

    return (
        <ReactFlowContext.Provider value={contextValue}>
            <ReactFlow
                nodes={nodes}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                edgeTypes={edgeTypes}
                onConnect={onConnect}
                onPaneClick={onPaneClick}
                onNodeClick={onNodeClick}
                onNodesDelete={onNodesDelete}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onNodeDragStop={onNodeDragStop}
                fitView
            >
                <Background />
                <MiniMap />
                <Controls />
            </ReactFlow>
            <NodeInfoForm></NodeInfoForm>
        </ReactFlowContext.Provider>
    );
}
