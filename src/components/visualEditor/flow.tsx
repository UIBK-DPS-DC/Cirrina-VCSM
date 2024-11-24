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
import {
    colorMap,
    getAllStateNamesInExtent,
    getParentNode,
    hasHiddenAncestor,
    ReactFlowContext,
    saveNodePositions
} from "../../utils.tsx";
import {NO_PARENT} from "../../services/stateOrStateMachineService.tsx";

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
let guardId = 0

export const getNewNodeId = () => `node_${nodeId++}`;
export const getNewEdgeId = () => `edge_${edgeId++}`;
export const getNewGuardId = () => `guard_${guardId++}`

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
        recalculateTransitions,
        setRecalculateTransitions,
        initialOrTerminalChange,
        setInitialOrTerminalChange,
        darkMode
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

    const getNodeDepth = useCallback((node: Node<CsmNodeProps> | undefined): number => {
        if(!node){
            return 0
        }
        if(isStateMachine(node.data)){
            const parentNode = getParentNode(node, nodes)
            if(parentNode){
                return 1 + getNodeDepth(parentNode)
            }
            return 0
        }
        return 0
    },[nodes])


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
                node.style.backgroundColor = node.style.backgroundColor === "transparent" ? "rgba(244, 2, 127, 0.11)" : "transparent"
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
        [setEdges, transitionService, nodes, selectedEdge]
    );

    const onEdgesDelete = useCallback((edges: Edge<CsmEdgeProps>[]) => {

        const sources = edges.map((e) => e.source)
            .map((s) => stateOrStateMachineService.getLinkedStateOrStatemachine(s))
        const transitions = edges.map((e) => e.data?.transition)

        if(sources.length > 0 && transitions.length > 0){
            sources.forEach((s) => {
                transitions.forEach((t) => {
                    if(s instanceof State && t){
                        s.removeTransition(t)
                    }
                })
            })
        }

        edges.forEach((e) => {
            if(e.target === e.source){
                const sourceNode = nodes.find((n) => n.id === e.source)
                if(sourceNode && isState(sourceNode.data)){
                    sourceNode.data.state.removeSourceHandle(e.sourceHandle || "")
                    console.log(`Removed source handle ${e.sourceHandle}`)
                }
            }
        })


        setRecalculateTransitions(!recalculateTransitions);
    },[setEdges, setRecalculateTransitions, nodes, edges]);

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
                    height: 400,
                    width: 400,
                    backgroundColor: colorMap(0),
                };

                newNode = {
                    ...newNode,
                    dragHandle: '.custom-drag-handle',
                };

                if (isStateMachine(newNode.data)) {
                    newNode.data.prevSize = {
                        height: newNode.height,
                        width: newNode.width,
                    };
                }
            }

            // Create a Rect representing the new node's position and size
            const nodeWidth = newNode.width || (type === 'state-machine-node' ? 150 : 100);
            const nodeHeight = newNode.height || (type === 'state-machine-node' ? 150 : 50);

            const nodeRect = {
                x: position.x,
                y: position.y,
                width: nodeWidth,
                height: nodeHeight,
            };

            // Find intersecting nodes
            const intersectingNodes = getIntersectingNodes(nodeRect, false);

            const intersectedBlock = intersectingNodes.findLast(
                (n) => n.type === 'state-machine-node'
            );

            if (intersectedBlock) {
                newNode = {
                    ...newNode,
                    parentId: intersectedBlock.id,
                    extent: 'parent',
                    position: {
                        x: position.x - intersectedBlock.position.x,
                        y: position.y - intersectedBlock.position.y,
                    },
                    expandParent: true,
                };

                stateOrStateMachineService.linkStateNameToStatemachine(
                    stateOrStateMachineService.getName(newNode.data),
                    intersectedBlock.id,
                    true
                );
            } else {
                const parentId = newNode.parentId || NO_PARENT;
                stateOrStateMachineService.linkStateNameToStatemachine(
                    new_name,
                    parentId,
                    true
                );
            }

            setNodes((nds) => {
                updateNodeHistory([...nds, newNode]);
                return [...nds, newNode];
            });

            stateOrStateMachineService.linkNode(newNode.id, newNode.data);

            setRecalculateTransitions((prev) => !prev);


            // Check if no initial.
            if(isState(newNode.data)){
                const initial = nodes.filter((n) => n.parentId === intersectedBlock?.id &&
                    isState(n.data) &&
                    n.data.state.initial)

                newNode.data.state.initial = initial.length <= 0;

                setInitialOrTerminalChange(!initialOrTerminalChange)

            }
        },
        [
            screenToFlowPosition,
            setNodes,
            stateOrStateMachineService,
            updateNodeHistory,
            recalculateTransitions,
            getIntersectingNodes,
            setInitialOrTerminalChange,
            nodes
        ]
    );



    const onNodeDragStop = useCallback(
        (_: React.MouseEvent, node: Node<CsmNodeProps>) => {
            const nodeWidth = node.width || (node.type === 'state-machine-node' ? 150 : 100);
            const nodeHeight = node.height || (node.type === 'state-machine-node' ? 150 : 50);

            const nodeRect = {
                x: node.position.x,
                y: node.position.y,
                width: nodeWidth,
                height: nodeHeight,
            };
            const intersections = getIntersectingNodes(nodeRect, false);
            const intersectedBlock = intersections.findLast((n) => n.type === "state-machine-node");
            console.log(`Intersected Block ${intersectedBlock?.id}`)
            const parentId = node.parentId || NO_PARENT;



            saveNodePositions(setNodes)

            if (intersectedBlock) {
                console.log(node.parentId)
                if(intersectedBlock.position.x + 50 > node.position.x || intersectedBlock.position.y + 50 > node.position.y) {
                    return
                }

                // Dont allow switch to sm on same dephth
                if (node.parentId === intersectedBlock.id) return;
                if(node.parentId && intersectedBlock.parentId === node.parentId ) return;

                let parentNode = getParentNode(node,nodes)
                let intersectedParentNode = getParentNode(intersectedBlock as Node<CsmNodeProps>,nodes)

                if(getNodeDepth(intersectedParentNode) === getNodeDepth(parentNode) && node.parentId !== undefined) {
                    return
                }


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
                                position: n.parentId !== intersectedBlock.id ? { x: n.position.x - intersectedBlock.position.x, y: n.position.y - intersectedBlock.position.y } : n.position,
                                expandParent: true
                            };
                        }
                        return n;
                    })
                );

                // If there is already an existing initial node on the state remove initial flag from current state,
                // otherwise make state initial
                if(isState(node.data)){
                    const initial = nodes.filter((n) => n.parentId === intersectedBlock.id &&
                        isState(n.data) &&
                        n.data.state.initial)

                    node.data.state.initial = initial.length <= 0;

                    setInitialOrTerminalChange(!initialOrTerminalChange)

                }



            }

        },
        [setNodes, getIntersectingNodes, nodes, stateOrStateMachineService, onDrop]
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
            setRecalculateTransitions(!recalculateTransitions)
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

            let sourceHandle = ""
            let targetHandle: string

            State.INTERNAL_SOURCE_HANDLES.every((handle) => {
                if(isState(node.data)){

                    if(!node.data.state.isSourceHandleUsed(handle)){
                        sourceHandle = handle
                        return false
                    }
                }

                return true

            })


            switch (sourceHandle) {
                case "s" : {
                    targetHandle = "t"
                    break
                }

                case "s-1" : {
                    targetHandle = "t-1"
                    break
                }

                case "s-2" : {
                    targetHandle = "t-2"
                    break
                }

                case "s-3" : {
                    targetHandle = "t-3"
                    break
                }

                default: {
                    targetHandle = ""
                }


            }

            if(!targetHandle || !sourceHandle){
                return
            }








            const connection: Connection = {
                source: node.id, sourceHandle: sourceHandle, target: node.id, targetHandle: targetHandle

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

            node.data.state.addOnTransition(newTransition)
            node.data.state.addSourceHandle(sourceHandle)


            setEdges(eds => addEdge(newEdge, eds));
            return

        }



        const descendants = getAllDescendants(node);
        const descendantIds = descendants.map(d => d.id);
        const connectedEdges: Edge<CsmEdgeProps>[] = edges.filter(d => descendantIds.includes(d.source))
        setNodes((prevNodes) => {

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

        // Second pass to ensure correct hiding
        setNodes((prev) => {
            return prev.map((n) => {
                return hasHiddenAncestor(n,nodes) ? hideNode(n,true) : n
            })
        })


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

        const edgesToAdd: Edge<CsmEdgeProps>[] = []


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

            // Map all events raised and consumed to the corresponding state machine nodes
            const statemachineToRaisedEvents: Map<string,string[]> = new Map()
            const statemachineConsumedEvents: Map<string,string[]> = new Map()

            groupNodes.forEach((n) => {
                // For every sm get all state descendants (only they can raise and consume events)
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
            groupNodes.forEach((n) => {
                // Get events raised of a statemachine
                const localRaisedEvents = statemachineToRaisedEvents.get(n.id)
                // If it has raised events
                if(localRaisedEvents){
                    // Iterate over other Statemachines in the same group and check if they consume an event that is raised.
                   groupNodes.forEach((otherNode) => {
                       // Ignore self
                       if(otherNode.id !== n.id){
                           const localConsumedEvents = statemachineConsumedEvents.get(otherNode.id)

                           if (localConsumedEvents) {
                               // Check if any of the raised events are consumed
                               const hasCommonEvent = localConsumedEvents.some(event =>
                                   localRaisedEvents.includes(event)
                               );

                               // If there is at least one common event, perform the necessary action
                               if (hasCommonEvent) {



                                   // Dynamically set source and target handle depending on position
                                   let sourceHandle:string = otherNode.position.x > n.position.x ? "c" : "a"
                                   let targetHandle: string = otherNode.position.x > n.position.x ? "b" : "d"

                                   edgesToAdd.forEach((e)  => {
                                       if(e.source === otherNode.id && e.target === n.id){
                                           sourceHandle = e.sourceHandle || sourceHandle
                                           targetHandle = e.targetHandle || targetHandle

                                       }
                                   })

                                   console.log(`Node ${otherNode.id} consumes an event raised by Node ${n.id}`);
                                   const connection: Connection = {
                                       source: n.id, sourceHandle: sourceHandle, target: otherNode.id, targetHandle: targetHandle

                                   }
                                   const newTransition = transitionService.connectionToTransition(connection)
                                   if(newTransition){
                                       newTransition.isStatemachineEdge = true
                                       const newEdge: Edge<CsmEdgeProps> = {
                                           id: getNewEdgeId(),
                                           ...connection,
                                           type: 'csm-edge',
                                           markerEnd: {type: MarkerType.Arrow},
                                           markerStart:{type: MarkerType.Arrow},
                                           data: {transition: newTransition},
                                           animated: true,
                                           zIndex: 1

                                       }
                                       edgesToAdd.push(newEdge)
                                   }

                               }
                           }
                       }

                   })
                }

            })







        })

        // Here

        edgesToAdd.forEach((e) => {
            console.log(e.sourceHandle)
        })

        setEdges((prev) => [...prev, ...edgesToAdd])

        console.log(parentMap); // To verify the result



    }, [recalculateTransitions, setRecalculateTransitions, setEdges]);



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
                colorMode={darkMode ? "dark" : "light"}
                onEdgeClick={onEdgeClick}
                onEdgesDelete={onEdgesDelete}
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
