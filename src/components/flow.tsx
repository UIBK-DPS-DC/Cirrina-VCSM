import React, { useCallback, createContext } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    type OnConnect, type NodeTypes, useReactFlow, Edge, Node
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import {EntryNode} from "./Nodes/entryNode.tsx";
import {ExitNode} from "./Nodes/exitNode.tsx";
import {StateNode} from "./Nodes/stateNode.tsx";
import {StateMachineNode} from "./Nodes/stateMachineNode.tsx";
import StateOrStateMachineService from "../services/stateOrStateMachineService.tsx";


const nodeTypes = {
    'entry-node': EntryNode,
    'exit-node': ExitNode,
    'state-node': StateNode,
    'state-machine-node': StateMachineNode,
} satisfies NodeTypes;

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const ReactFlowContext = createContext({});

let id = 0;
const getNewId = () => `node_${id++}`;

export default function Flow() {


    const [nodes, setNodes , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const {getIntersectingNodes, screenToFlowPosition } = useReactFlow();


    const stateOrStateMachineService = new StateOrStateMachineService()
    const contextValue = {
        nodes,
        setNodes,
        edges,
        setEdges,
        stateOrStateMachineService,
    }


    const onConnect: OnConnect = useCallback(
        (connection) => setEdges((edges) => addEdge(connection, edges)),
        [setEdges]
    );

    const onDragOver = useCallback((event:React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event:React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode : Node = {
                id: getNewId(),
                type,
                position,
                data: { name: `${type + " " + id}` },
            };

            // TODO add this to stylesheet
            if(type === 'state-machine-node') {
                newNode.style = {
                    background: 'transparent',
                        fontSize: 12,
                        border: '1px solid black',
                        padding: 5,
                        borderRadius: 15,
                        height: 100,
                }
            }

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes],
    );

    const onNodeDragStop = useCallback(
        (_: React.MouseEvent, node: Node) => {
            const intersections = getIntersectingNodes(node, false);
            const intersectedBlock = intersections.findLast(
                (n) => n.type === "state-machine-node"
            );
            if (intersectedBlock) {
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

    return (
        <ReactFlowContext.Provider value={contextValue}>
            <ReactFlow
                nodes={nodes}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onNodeDragStop={onNodeDragStop}
                fitView
            >
                <Background />
                <MiniMap />
                <Controls />
            </ReactFlow>
        </ReactFlowContext.Provider>
    );
}
