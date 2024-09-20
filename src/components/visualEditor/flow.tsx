import React, {useCallback, useContext, useEffect} from 'react';
import {
    addEdge,
    Background,
    Connection,
    ConnectionLineType,
    Controls,
    Edge,
    MarkerType,
    MiniMap,
    Node,
    type NodeTypes,
    type OnConnect,
    ReactFlow,
    useReactFlow,
    useUpdateNodeInternals
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import {StateNode} from "./Nodes/stateNode.tsx";
import {StateMachineNode} from "./Nodes/stateMachineNode.tsx";
import {CsmEdgeProps, CsmNodeProps, isState, isStateMachine, ReactFlowContextProps} from "../../types.ts";

import StateMachine from "../../classes/stateMachine.ts";
import State from "../../classes/state.ts";
import CsmEdge from "./csmEdgeComponent.tsx";
import {getAllStateNamesInExtent, getParentNode, ReactFlowContext} from "../../utils.tsx";
import {NO_PARENT} from "../../services/stateOrStateMachineService.tsx";
import {s} from "vite/dist/node/types.d-aGj9QkWt";

const nodeTypes = {
    'state-node': StateNode,
    'state-machine-node': StateMachineNode,
} satisfies NodeTypes;

const edgeTypes = {
    'csm-edge': CsmEdge,
}

const NODE_HISTORY_LENGTH = 10;

let nodeId = 0;
let edgeId = 0;
const getNewNodeId = () => `node_${nodeId++}`;
const getNewEdgeId = () => `edge_${edgeId++}`;

const defaultNodeBorder = '1px solid black';



export default function Flow() {
    const context: ReactFlowContextProps = useContext(ReactFlowContext) as ReactFlowContextProps;
    const updateNodeInternals = useUpdateNodeInternals();

    const {
        nodes,
        setNodes,
        onNodesChange,
        setNodeHistory,
        edges,
        setEdges,
        onEdgesChange,
        selectedNode,
        setSelectedNode,
        selectedEdge,
        setSelectedEdge,
        setShowSidebar,
        stateOrStateMachineService,
        contextService,
        transitionService,
        actionService,
        eventService,
        recalculateTransitions,
        setRecalculateTransitions
    } = context;

    const { getIntersectingNodes, screenToFlowPosition } = useReactFlow();

    const updateNodeHistory = useCallback((nodes: Node<CsmNodeProps>[]) => {
        setNodeHistory(prev => {
            if (prev.length < NODE_HISTORY_LENGTH) {
                return [...prev, nodes];
            } else {
                return [...prev.slice(1), nodes];
            }
        });
    }, [setNodeHistory]);

    const getAllDescendants = useCallback((node: Node<CsmNodeProps>) => {
        const children = nodes.filter((n: Node<CsmNodeProps>) => n.parentId === node.id);

        children.forEach((n: Node<CsmNodeProps>) => {
            if (isStateMachine(n.data)) {
                const descendants = getAllDescendants(n);
                children.push(...descendants);
            }
        });

        return children;
    }, [nodes]);


    const hideEdge = (edge: Edge<CsmEdgeProps>, hidden: boolean) =>  {
        return {
            ...edge,
            hidden,
        };
    };

    const hideNode = (node: Node<CsmNodeProps>, hidden: boolean) =>  {
        const parent = getParentNode(node, nodes)

        // Checks if parent is already collapsed. To ensure node visibility is not reset since it should already be hidden
        if(parent && isStateMachine(parent.data)){
            if(! parent.data.visibleResize && ! parent.data.draggable && node.hidden){
                return  node
            }
        }

        if (isState(node.data)) {
            return {
                ...node,
                hidden
            };
        }
        if (isStateMachine(node.data)) {
            node.data.visibleResize = !node.data.visibleResize;
            if (hidden) {
                node.data.draggable = !node.data.draggable;
            }

            if (node.style) {
                node.style.border = node.style.border === "hidden" ? defaultNodeBorder : "hidden";
            }

            // SM has just been hidden. Backing up properties
            if (node.style && node.style?.border === "hidden") {
                console.log(node.style);
                console.log("Setting");
                node.data.prevSize = {
                    height: node.height,
                    width: node.width
                };
                console.log(node.data.prevSize);
                node.height = 0;
                node.width = 0;
                console.log("Hiding ");
                console.log(`${node.style.height}`);

            }
            // SM has just been unhidden. Restore previous properties
            else {
                console.log(`Restoring ${node.id} to previous sizes`)
                // Statemachine node has a default height of 150 and undefined width
                node.height = node.data.prevSize?.height || 150;
                node.width = node.data.prevSize?.width || undefined

                if(hidden){
                    node.position.x = node.data?.prevPosition?.x || 0
                    node.position.y = node.data?.prevPosition?.y || 0

                    console.log(node.position.x, node.position.y)
                    updateNodeInternals(node.id)
                }

                console.log(`Height: ${node.height}, Width ${node.width}`)
            }
        }
        updateNodeInternals(node.id)
        return node;
    };

    const onConnect: OnConnect = useCallback(
        (connection: Connection) => {
            const newTransition = transitionService.connectionToTransition(connection);
            if (newTransition) {
                const edge: Edge<CsmEdgeProps> = { id: getNewEdgeId(),
                    ...connection,
                    type: 'csm-edge',
                    data: { transition: newTransition }, zIndex: 1, markerEnd: {type: MarkerType.ArrowClosed}};
                const sourceState = nodes.find((n) => n.id === connection.source)
                if (sourceState && isState(sourceState.data)) {
                    sourceState.data.state.addOnTransition(newTransition)
                }

                setEdges(eds => addEdge(edge, eds));
            }



        },
        [setEdges, transitionService, nodes]
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
            const newId = getNewNodeId();

            let newNode: Node<CsmNodeProps> = {
                id: newId,
                type,
                position,
                data: stateOrStateMachineService.getDefaultData(type, new_name, newId),
            };

            // Add style if it's a state machine node
            if (type === 'state-machine-node') {
                newNode.style = {
                    background: 'transparent',
                    fontSize: 12,
                    border: '1px solid black',
                    padding: 5,
                    borderRadius: 15,
                    height: 150,
                };

                newNode = {
                    ...newNode,
                    dragHandle: '.custom-drag-handle',
                };

                if (isStateMachine(newNode.data)) {
                    newNode.data.prevSize = {
                        height: newNode.height,
                        width: newNode.width
                    };
                }
            }

            setNodes(nds => {
                updateNodeHistory([...nds, newNode]);
                return [...nds, newNode];
            });

            const parentId = newNode.parentId || NO_PARENT;
            stateOrStateMachineService.linkStateNameToStatemachine(new_name, parentId, true);
            stateOrStateMachineService.linkNode(newNode.id, newNode.data);

            setRecalculateTransitions(!recalculateTransitions)

        },
        [screenToFlowPosition, setNodes, stateOrStateMachineService, updateNodeHistory,recalculateTransitions]
    );

    const onNodeDragStop = useCallback(
        (_: React.MouseEvent, node: Node<CsmNodeProps>) => {
            const intersections = getIntersectingNodes(node, false);
            const intersectedBlock = intersections.findLast((n) => n.type === "state-machine-node");

            const parentId = node.parentId || NO_PARENT;

            setNodes((ns: Node<CsmNodeProps>[]) => {
                return ns.map((n) => {
                    if (isState(n.data) && !n.hidden) {
                        n.data.prevPosition = { x: n.position.x, y: n.position.y };
                    }
                    if (isStateMachine(n.data) && n.data.draggable) {
                        n.data.prevPosition = { x: n.position.x, y: n.position.y };
                    }
                    return n;
                });
            });

            if (intersectedBlock) {
                if (node.parentId === intersectedBlock.id) return;

                const blockStateNames = getAllStateNamesInExtent(intersectedBlock as Node<CsmNodeProps>, nodes, stateOrStateMachineService);
                stateOrStateMachineService.unlinkStateNameFromStatemachine(stateOrStateMachineService.getName(node.data), parentId);

                if (isState(node.data)) {
                    if (blockStateNames && blockStateNames.has(node.data.state.name)) {
                        stateOrStateMachineService.linkStateNameToStatemachine(stateOrStateMachineService.getName(node.data), parentId);
                        return;
                    }

                    setNodes((ns: Node<CsmNodeProps>[]) => {
                        const newNodes = ns.filter(i => i.id !== node.id);
                        const index = newNodes.findIndex(i => i.id === intersectedBlock.id);
                        const firstPart = newNodes.slice(0, index + 1);
                        const secondPart = newNodes.slice(index + 1);
                        return [...firstPart, node as Node<CsmNodeProps>, ...secondPart];
                    });
                }

                if (isStateMachine(node.data)) {
                    if (blockStateNames && blockStateNames.has(node.data.stateMachine.name)) {
                        stateOrStateMachineService.linkStateNameToStatemachine(stateOrStateMachineService.getName(node.data), parentId);
                        return;
                    }

                    setNodes((ns: Node<CsmNodeProps>[]) => {
                        const children = getAllDescendants(node);
                        const newNodes = ns.filter(i => i.id !== node.id && !children.includes(i));
                        const index = newNodes.findIndex(i => i.id === intersectedBlock.id);
                        const firstPart = newNodes.slice(0, index + 1);
                        const secondPart = newNodes.slice(index + 1);
                        return [...firstPart, node, ...children, ...secondPart];
                    });
                }

                stateOrStateMachineService.linkStateNameToStatemachine(stateOrStateMachineService.getName(node.data), intersectedBlock.id, true);

                setNodes((ns) =>
                    ns.map((n) => {
                        if (n.id === node.id) {
                            return {
                                ...n,
                                parentId: intersectedBlock.id,
                                extent: "parent",
                                position: n.parentId !== intersectedBlock.id ? { x: 10, y: 10 } : n.position,
                                expandParent: false
                            };
                        }
                        return n;
                    })
                );
            }
        },
        [setNodes, getIntersectingNodes, nodes, stateOrStateMachineService]
    );

    const onNodesDelete = useCallback(
        (deletedNodes: Node[]) => {
            deletedNodes.forEach(node => {
                stateOrStateMachineService.unlinkNode(node.id);
                let parentId: string;
                switch (node.type) {
                    case "state-machine-node":
                        const stateMachine = node.data.stateMachine as StateMachine;
                        stateOrStateMachineService.unregisterName(stateMachine.name);
                        stateMachine.getAllContextVariables().forEach(variable => {
                            contextService.deregisterContextByName(variable.name);
                        });
                        parentId = node.parentId || NO_PARENT;
                        stateOrStateMachineService.unlinkStateNameFromStatemachine(stateMachine.name, parentId);
                        break;
                    case "state-node":
                        const state = node.data.state as State;
                        stateOrStateMachineService.unregisterName(state.name);
                        state.getAllContextVariables().forEach(variable => {
                            contextService.deregisterContextByName(variable.name);
                        });
                        parentId = node.parentId || NO_PARENT;
                        stateOrStateMachineService.unlinkStateNameFromStatemachine(state.name, parentId);
                        break;
                    default:
                        stateOrStateMachineService.unregisterName(node.data.name);
                }
            });
            updateNodeHistory(nodes.filter(n => !deletedNodes.some(d => d.id === n.id)));
        },
        [stateOrStateMachineService, updateNodeHistory, nodes, contextService]
    );

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node<CsmNodeProps>) => {
        if (selectedEdge) {
            setSelectedEdge(null);
        }
        setSelectedNode(node);
        setShowSidebar(true);
    }, [selectedEdge, setSelectedNode, setShowSidebar, setSelectedEdge]);

    const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node<CsmNodeProps>) => {
        event.preventDefault();

        if(isState(node.data)){
            const connection: Connection = {
                source: node.id, sourceHandle: "s", target: node.id, targetHandle: "t"

            }
            const newTransition = transitionService.connectionToTransition(connection);

            if(!newTransition) {
                return;
            }


            const newEdge: Edge<CsmEdgeProps> = {
                id: getNewEdgeId(),
                ...connection,
                type: 'csm-edge',
                markerEnd: {type: MarkerType.Arrow},
                markerStart:{type: MarkerType.Arrow},
                data: {transition: newTransition},
                zIndex: 1

            }

            setEdges(eds => addEdge(newEdge, eds));
            return

        }


        const connectedEdges: Edge<CsmEdgeProps>[] = [];
        setNodes((prevNodes) => {
            const descendants = getAllDescendants(node);
            return prevNodes.map((n) => {

                if (descendants.includes(n)) {

                    if (isStateMachine(n.data)) {

                        // draggable but not resizable means collapsed child statemachine.
                        if(n.data.draggable && !n.data.visibleResize){
                            n.position = {x: 0, y: 0}
                            n.data.draggable = false;
                            updateNodeInternals(n.id)
                            return n
                        }

                        else {
                            if (n.data.draggable) {
                                n.position = { x: 0, y: 0 };
                            } else {
                                n.position = n.data.prevPosition ? n.data.prevPosition : node.position;
                            }

                            return hideNode(n, true);
                        }

                    }

                    if (isState(n.data)) {
                        if (!n.hidden) {
                            n.position = { x: 0, y: 0 };
                        } else {
                            n.position = n.data.prevPosition ? n.data.prevPosition : node.position;
                        }
                        return hideNode(n, !n.hidden);
                    }

                    return n;
                }

                if (n.id === node.id) {
                    return hideNode(n, false);
                }

                return n;
            });
        });

        connectedEdges.filter((value, index, array) => array.indexOf(value) === index);

        setEdges((eds) => {
            return eds.map((e) => {
                if (connectedEdges.includes(e)) {
                    return hideEdge(e, !e.hidden);
                }
                return e;
            });
        });

        nodes.forEach((n) => updateNodeInternals(n.id))
    }, [nodes, edges, onNodeClick, onNodeDragStop, onNodesChange]);

    const onEdgeClick = useCallback(
        (_: React.MouseEvent, edge: Edge<CsmEdgeProps>) => {
            console.log("JO")
            if (selectedNode) {
                setSelectedNode(null);
            }
            setSelectedEdge(edge);
            setShowSidebar(true);
        }, [selectedNode, setSelectedEdge, setShowSidebar, setSelectedNode]
    );

    const onPaneClick = useCallback(() => {
        setShowSidebar(false);
    }, [setShowSidebar]);

    const removeEdges = useCallback((nodes: Node<CsmNodeProps>[]) => {
        const ids = nodes.map((n) => n.id);
        setEdges((prevEdges) =>  prevEdges.filter((e) => !ids.includes(e.source)));
    }, [edges, setEdges])

    useEffect(() => {
        // Get all statemachines
        const statemachines = nodes.filter((n) => n.type === "state-machine-node")
        // Remove all edges between statemachines.
        removeEdges(statemachines)

        //Group nodes by their Parent
        const parentMap: Map<string, Node<CsmNodeProps>[]> = new Map()
        statemachines.forEach((node) => {
            const parentId = node.parentId || "NO_PARENT"; // Replace with default if no parent
            if (parentMap.has(parentId)) {
                // If the parentId exists, push the node to the existing array
                parentMap.get(parentId)?.push(node);
            } else {
                // If the parentId doesnt exist, create a new array with the node
                parentMap.set(parentId, [node]);
            }

        });

        // Get all parent groups
        const groups = Array.from(parentMap.keys());



        // for every group
        groups.forEach((group) => {
            const groupNodes = parentMap.get(group);
            if(!groupNodes) {
                return
            }
            // Group is parent node
            // Get raised and consumed events of each group
            // If other group consumes event that other group raises => create edge between their parents

            // just for loggin delete later
            let i = 0
            // Map all events raised and consumed to the corresponding state machine nodes
            const statemachineToRaisedEvents: Map<string,string[]> = new Map()
            const statemachineConsumedEvents: Map<string,string[]> = new Map()

            groupNodes.forEach((n) => {
                // For ever sm get all state descendants (only they can raise and consume events)
                const descendants = getAllDescendants(n).filter((n) => n.type === "state-node")
                let raisedEvents: string[] = []
                let consumedEvents: string[] = []

                descendants.forEach((d) => {
                    if(isState(d.data)){
                        raisedEvents = raisedEvents.concat(d.data.state.getAllRaisedEvents().map((e) => e.name))
                        consumedEvents = consumedEvents.concat(d.data.state.getAllConsumedEvents())
                    }
                })
                // Add them to the Map
                statemachineToRaisedEvents.set(n.id, raisedEvents)
                statemachineConsumedEvents.set(n.id, consumedEvents)



            })

            console.log("Raise event map: ", statemachineToRaisedEvents)
            console.log("consumedEvents map", statemachineConsumedEvents)

            //Iterate over group nodes and if one group node consumes and event that another raises add edge








        })


        console.log(parentMap); // To verify the result



    }, [recalculateTransitions, setRecalculateTransitions]);

    return (
        <div className={"flow-container"}>
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
                onNodeContextMenu={onNodeContextMenu}
                onEdgeClick={onEdgeClick}
                onNodesDelete={onNodesDelete}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onNodeDragStop={onNodeDragStop}
                fitView
                connectionLineType={ConnectionLineType.Bezier}
            >
                <Background />
                <MiniMap />
                <Controls />
            </ReactFlow>
        </div>
    );
}
