import React, { useCallback, createContext, useMemo, useState } from 'react';
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
import { StateNode } from "./Nodes/stateNode.tsx";
import { StateMachineNode } from "./Nodes/stateMachineNode.tsx";
import StateOrStateMachineService from "../services/stateOrStateMachineService.tsx";
import {CsmNodeProps, ReactFlowContextProps, CsmEdgeProps, isState, isStateMachine} from "../types.ts";

import "../css/nodeForm.css";
import "../css/edgeForm.css"

import StateMachine from "../classes/stateMachine.ts";
import State from "../classes/state.ts";
import NodeInfoForm from "./nodeInfoForm.tsx";
import TransitionInfoForm from "./transitionInfoForm.tsx";
import CsmEdge from "./csmEdgeComponent.tsx";
import TransitionService from "../services/transitionService.tsx";


const nodeTypes = {
    'state-node': StateNode,
    'state-machine-node': StateMachineNode,
} satisfies NodeTypes;

const edgeTypes = {
    'csm-edge': CsmEdge,
}

const NODE_HISTORY_LENGTH = 10;
const initialNodes: Node<CsmNodeProps>[] = [];
const initialEdges: Edge<CsmEdgeProps>[] = [];

export const ReactFlowContext = createContext<ReactFlowContextProps | null>(null);

let nodeId = 0;
let edgeId = 0;
const getNewNodeId = () => `node_${nodeId++}`;
const getNewEdgeId = () => `edge_${edgeId++}`;

export default function Flow() {

    const stateOrStateMachineService: StateOrStateMachineService = useMemo(() => new StateOrStateMachineService(), []);
    const transitionService: TransitionService = useMemo(() => new TransitionService(stateOrStateMachineService), [stateOrStateMachineService]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node<CsmNodeProps> | null>(null);
    const [selectedEdge, setSelectedEdge] = useState<Edge<CsmEdgeProps> | null>(null)
    const [showSidebar, setShowSidebar] = useState(false);
    const [nameInput, setNameInput] = useState<string>("");
    const [nodeHistory, setNodeHistory] = useState<Node<CsmNodeProps>[][]>([[]]);
    const { getIntersectingNodes, screenToFlowPosition } = useReactFlow();

    const contextValue: ReactFlowContextProps = {
        nodes,
        setNodes,
        nodeHistory,
        setNodeHistory,
        edges,
        setEdges,
        selectedNode,
        setSelectedNode,
        selectedEdge,
        setSelectedEdge,
        showSidebar,
        setShowSidebar,
        nameInput,
        setNameInput,
        stateOrStateMachineService,
    };

    const updateNodeHistory = useCallback((nodes: Node<CsmNodeProps>[]) => {
        setNodeHistory(prev => {
            if (prev.length < NODE_HISTORY_LENGTH) {
                return [...prev, nodes];
            } else {
                return [...prev.slice(1), nodes];
            }
        });
    }, []);


    const onConnect: OnConnect = useCallback(
        (connection: Connection) => {
            // TODO: Add this new transition to the relevant states and statemachines.
            const newTransition = transitionService.connectionToTransition(connection)
            if(newTransition) {
                const edge: Edge<CsmEdgeProps> = { id: getNewEdgeId(), ...connection, type: 'csm-edge', data: {transition: newTransition} };
                setEdges(eds => addEdge(edge, eds));
            }

        },
        [setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            if (!type) {
                return;
            }

            const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
            const new_name: string = stateOrStateMachineService.generateUniqueName(type);
            stateOrStateMachineService.registerName(new_name);

            const newNode: Node<CsmNodeProps> = {
                id: getNewNodeId(),
                type,
                position,
                data: stateOrStateMachineService.getDefaultData(type, new_name),
            };

            // TODO: DELETE WHEN FINISHED
            console.log(`New State or statemachine : ${isState(newNode.data) ? newNode.data.state.name : 
                isStateMachine(newNode.data)? newNode.data.stateMachine.name : "none"}`)


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

            setNodes(nds => {
                if (type === 'state-machine-node') {
                    updateNodeHistory([newNode, ...nds]);
                    return [newNode, ...nds];
                } else {
                    updateNodeHistory([...nds, newNode]);
                    return [...nds, newNode];
                }
            });

            stateOrStateMachineService.linkNode(newNode.id, newNode.data);

        },
        [screenToFlowPosition, setNodes, stateOrStateMachineService, updateNodeHistory]
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
                                position: n.parentId !== intersectedBlock.id ? { x: 10, y: 10 } : n.position,
                            };
                        }
                        return n;
                    })
                );
            }
        },
        [setNodes, getIntersectingNodes]
    );

    const onNodesDelete = useCallback(
        (deletedNodes: Node[]) => {
            deletedNodes.forEach(node => {
                stateOrStateMachineService.unlinkNode(node.id)
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
            });
            updateNodeHistory(nodes.filter(n => !deletedNodes.some(d => d.id === n.id)));
        },
        [stateOrStateMachineService, updateNodeHistory, nodes]
    );

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node<CsmNodeProps>) => {
        if(selectedEdge){
            setSelectedEdge(null)
        }
        setSelectedNode(node);
        setShowSidebar(true);
    }, [selectedNode, selectedEdge]);

    const onEdgeClick = useCallback(
        (_: React.MouseEvent, edge: Edge<CsmEdgeProps>) => {
            if(selectedNode){
                setSelectedNode(null)
            }
            setSelectedEdge(edge)
            setShowSidebar(true);
        }, [selectedNode, selectedEdge]
    )

    const onPaneClick = useCallback(() => {
        setShowSidebar(false);
    }, []);

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
                onEdgeClick={onEdgeClick}
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
            <NodeInfoForm />
            <TransitionInfoForm/>
        </ReactFlowContext.Provider>
    );
}
