import React, {useCallback, createContext, useMemo, useState, useEffect} from 'react';
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
import {CsmNodeProps, ReactFlowContextProps} from "../types.ts";

import "../css/nodeForm.css"
import StateMachine from "../classes/stateMachine.ts";
import State from "../classes/state.ts";


const nodeTypes = {
    'entry-node': EntryNode,
    'exit-node': ExitNode,
    'state-node': StateNode,
    'state-machine-node': StateMachineNode,
} satisfies NodeTypes;

const initialNodes: Node<CsmNodeProps>[] = [];
const initialEdges: Edge[] = [];

const ReactFlowContext = createContext({});

let id = 0;
const getNewId = () => `node_${id++}`;

export default function Flow() {

    const stateOrStateMachineService: StateOrStateMachineService = useMemo( () => new StateOrStateMachineService(), []);

    const [nodes, setNodes , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node<CsmNodeProps> | null>(null)
    const [showSidebar, setShowSidebar] = useState(false);
    const [nameInput, setNameInput] = useState<string>("");
    const {getIntersectingNodes, screenToFlowPosition } = useReactFlow();


    useEffect(() => {
        if(selectedNode){
            setNameInput(stateOrStateMachineService.getName(selectedNode.data))
        }
    },[selectedNode,stateOrStateMachineService])




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

            const new_name: string  = stateOrStateMachineService.generateUniqueName(type)
            stateOrStateMachineService.registerName(new_name)

            const newNode : Node<CsmNodeProps> = {
                id: getNewId(),
                type,
                position,
                data: stateOrStateMachineService.getDefaultData(type, new_name),
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
        [screenToFlowPosition, setNodes, stateOrStateMachineService],
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

    const onNodesDelete = useCallback(
        (deletedNodes: Node []) => {
            deletedNodes.map(
                (node) => {
                    stateOrStateMachineService.unregisterName(node.data.name);
                }
            )
        },[stateOrStateMachineService]
    )

    const onNodeClick =
        useCallback((_: React.MouseEvent, node: Node<CsmNodeProps>) => {
            setSelectedNode(node);
            setShowSidebar(true);
        },[])

    const onPaneClick =
        useCallback(() => {
            setShowSidebar(false);
        },[])

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
        }
    }, [nodes, setNodes, selectedNode, stateOrStateMachineService]);

    const onNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameInput(event.target.value);
    };





    return (
        <ReactFlowContext.Provider value={contextValue}>
            <ReactFlow
                nodes={nodes}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
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
            {showSidebar && selectedNode && (
                <div className = "node-form">
                    <form>
                        <h3>Hi mom! Its me {selectedNode.data.name}!</h3>
                    </form>

                </div>
            )

            }


        </ReactFlowContext.Provider>
    );
}
