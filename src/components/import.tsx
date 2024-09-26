// Ensure all required imports are correct and in place
import { Button } from "react-bootstrap";
import React, { useCallback, useContext, useRef } from "react";
import { CollaborativeStateMachineDescription } from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";
import {
    colorMap,
    fromCollaborativeStatemachineDescription,
    ReactFlowContext,
} from "../utils.tsx";
import {
    CreateActionProps,
    CsmEdgeProps,
    CsmNodeProps,
    isState,
    isStateMachine,
    RaiseEventActionProps,
    ReactFlowContextProps,
    TimeoutActionProps,
} from "../types.ts";
import State from "../classes/state.ts";
import { Edge, MarkerType, Node } from "@xyflow/react";
import StateMachine from "../classes/stateMachine.ts";
import ELK from "elkjs/lib/elk.bundled.js";
import Transition from "../classes/transition.ts";
import StateOrStateMachine from "../classes/stateOrStateMachine.ts";
import StateOrStateMachineService, {
    NO_PARENT,
} from "../services/stateOrStateMachineService.tsx";
import ActionService from "../services/actionService.tsx";
import Action from "../classes/action.tsx";
import ContextVariableService from "../services/contextVariableService.tsx";
import { ActionType } from "../enums.ts";
import EventService from "../services/eventService.tsx";
import GuardService from "../services/guardService.tsx";
import {
    getNewEdgeId,
    getNewGuardId,
    getNewNodeId,
} from "./visualEditor/flow.tsx";

// Define the layout options for ELK
const rootLayoutOptions = {
    "elk.algorithm": "layered",
    "elk.direction": "RIGHT",
    "elk.edgeRouting": "ORTHOGONAL", // Enable orthogonal edge routing
    "elk.allowEdgeNodeOverlap": "false",
    "elk.layered.spacing.nodeNodeBetweenLayers": "300", // Increased spacing between layers
    "elk.layered.spacing.edgeNodeBetweenLayers": "300", // Increased spacing between layers
    "elk.spacing.nodeNode": "500", // Increased spacing between nodes in the same layer
    "elk.spacing.edgeEdge": "250",
    "elk.spacing.edgeNode": "300",

    "portConstraints": "FIXED_ORDER",
    "elk.margins": "200",
     "elk.partitioning.activate": "true",
    "elk.layered.nodePlacement.strategy": "SIMPLE",
    "elk.padding": "50",
};

const parentLayoutOptions = {
    "elk.algorithm": "layered",
    "elk.direction": "RIGHT",
    "elk.edgeRouting": "ORTHOGONAL",
    "elk.allowEdgeNodeOverlap": "false",
    "elk.layered.spacing.nodeNodeBetweenLayers": "200", // Increased spacing between layers
    "elk.layered.spacing.edgeNodeBetweenLayers": "200", // Increased spacing between layers
    "elk.spacing.nodeNode": "1200", // Increased spacing between nodes in the same layer
    "elk.spacing.edgeEdge": "250",
    "elk.spacing.edgeNode": "300",
    "portConstraints": "FIXED_ORDER",
    "elk.partitioning.activate": "true",
    "elk.margins": "200",
    "elk.layered.nodePlacement.strategy": "SIMPLE",
    "elk.padding": "50", // Increased padding for parent nodes
};

const childLayoutOptions = {
    "elk.algorithm": "layered",
    "elk.direction": "RIGHT",
    "elk.edgeRouting": "ORTHOGONAL",
    "elk.allowEdgeNodeOverlap": "false",
    "portConstraints": "FIXED_ORDER",
    "elk.layered.spacing.nodeNodeBetweenLayers": "200", // Increased spacing between layers
    "elk.layered.spacing.edgeNodeBetweenLayers": "200", // Increased spacing between layers
    "elk.spacing.nodeNode": "1000", // Increased spacing between nodes in the same layer
    "elk.spacing.edgeEdge": "250",
    "elk.spacing.edgeNode": "300",
    "elk.partitioning.activate": "true",
    "elk.margins": "200",
    "elk.layered.nodePlacement.strategy": "SIMPLE",
    "elk.padding": "50", // Increased padding for child nodes
};

// Create an ELK instance
const elk = new ELK();

export default function Import() {
    // Set up ref
    const inputFile = useRef<HTMLInputElement | null>(null);

    // Use React Flow context to get setNodes and setEdges
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {
        setNodes,
        setEdges,
        actionService,
        stateOrStateMachineService,
        contextService,
        guardService,
        eventService,
    } = context;

    // Function to handle file input button click
    const handleButtonClick = () => {
        if (inputFile.current) {
            inputFile.current.click();
        }
    };

    const resetReactFlow = () => {
        setNodes([]);
        setEdges([]);
    };
    const resetServices = () => {
        actionService.resetService();
        stateOrStateMachineService.resetService();
        contextService.resetService();
        guardService.resetService();
        eventService.resetService();
    };

    const setupStateOrStatemachineService = (
        service: StateOrStateMachineService,
        nodes: Node<CsmNodeProps>[]
    ) => {
        nodes.forEach((node) => {
            const parentId = node.parentId || NO_PARENT;

            if (isState(node.data)) {
                const state = node.data.state;
                service.registerName(state.name);
                service.linkStateNameToStatemachine(state.name, parentId, true);
            }
            if (isStateMachine(node.data)) {
                const statemachine = node.data.stateMachine;
                service.registerName(statemachine.name);
                service.linkStateNameToStatemachine(statemachine.name, parentId, true);
            }

            // Node id to state/statemachine map
            service.linkNode(node.id, node.data);
        });
    };

    const setupActionService = (
        service: ActionService,
        nodes: Node<CsmNodeProps>[],
        edges: Edge<CsmEdgeProps>[]
    ) => {
        // Collect all actions
        let actions: Action[] = [];
        nodes.forEach((n) => {
            if (isState(n.data)) {
                actions = actions.concat(n.data.state.getAllActions());
            }
        });

        edges.forEach((e) => {
            actions = actions.concat(e.data?.transition.getActions() || []);
        });

        actions.forEach((a) => {
            service.registerAction(a);
        });
    };

    const setupContextVariableService = (
        service: ContextVariableService,
        nodes: Node<CsmNodeProps>[]
    ) => {
        // Create actions filter
        // Name to context
        nodes.forEach((node) => {
            if (isState(node.data)) {
                const state = node.data.state;
                const stateContext = state.getAllContextVariables();
                const stateCreateActions = state
                    .getAllActions()
                    .filter((a) => a.type === ActionType.CREATE);

                stateContext.forEach((c) => {
                    service.registerContext(c);
                    service.linkContextToState(c, state);
                });

                stateCreateActions.forEach((a) => {
                    const createActionsProps = a.properties as CreateActionProps;
                    service.setContextCreatedBy(createActionsProps.variable, state);
                });
            }
            if (isStateMachine(node.data)) {
                const statemachineContext =
                    node.data.stateMachine.getAllContextVariables();
                statemachineContext.forEach((c) => {
                    service.registerContext(c);
                });
            }
        });
    };

    const setupEventService = (
        service: EventService,
        nodes: Node<CsmNodeProps>[]
    ) => {
        // Get raise event actions
        // Get timeout actions that are raise event actions

        let raiseActions: Action[] = [];

        nodes.forEach((node) => {
            if (isState(node.data)) {
                raiseActions = raiseActions.concat(
                    node.data.state.getAllActions().filter((a) => a.type === ActionType.RAISE_EVENT)
                );

                const timeOutActions = node.data.state
                    .getAllActions()
                    .filter((a) => a.type == ActionType.TIMEOUT);
                timeOutActions.forEach((a) => {
                    const timeoutProps = a.properties as TimeoutActionProps;
                    if (timeoutProps.action.type === ActionType.RAISE_EVENT) {
                        raiseActions.push(timeoutProps.action);
                    }
                });
            }
        });

        raiseActions.forEach((a) => {
            const raiseEventProps = a.properties as RaiseEventActionProps;
            service.registerEvent(raiseEventProps.event);
        });
    };

    const setupGuardService = (service: GuardService, edges: Edge<CsmEdgeProps>[]) => {
        edges.forEach((e) => {
            if (e.data) {
                e.data.transition.getGuards().forEach((g) => {
                    g.name = getNewGuardId();
                    service.registerGuard(g);
                });
            }
        });
    };

    const adjustInternalTransitionHandles = (edges: Edge<CsmEdgeProps>[]) => {
        edges.forEach((e) => {
            if(e.source === e.target){
                e.sourceHandle = "s"
                e.targetHandle = "t"
            }
        })

    }



    // Function to generate nodes recursively
    const generateNodes = (
        statemachines: StateMachine[],
        parentId?: string
    ): Node<CsmNodeProps>[] => {
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
    const statemachineToNode = (
        statemachine: StateMachine,
        parentId?: string
    ): Node<CsmNodeProps> => {
        const id = getNewNodeId();
        statemachine.nodeId = id;
        return {
            position: { x: 0, y: 0 },
            data: {
                stateMachine: statemachine,
                prevSize: { height: 150, width: undefined },
                visibleResize: true,
                draggable: true,
            },
            id: id,
            type: "state-machine-node",
            expandParent: true,
            style: {
                background: "transparent",
                fontSize: 12,
                border: "1px solid black",
                padding: 5,
                borderRadius: 15,
                height: 150,
                backgroundColor: colorMap(0),
            },
            dragHandle: ".custom-drag-handle",
            ...(parentId ? { parentId, extent: "parent" } : {}),
        };
    };

    // Convert state to node
    const stateToNode = (state: State, parentId: string): Node<CsmNodeProps> => {
        const id = getNewNodeId();
        state.nodeId = id;
        return {
            position: { x: 0, y: 0 },
            data: { state: state },
            id: id,
            type: "state-node",
            expandParent: true,
            parentId: parentId,
            extent: "parent",
        };
    };

    // Function to convert transitions to edges
    const transitionToEdge = (
        sourceState: StateOrStateMachine,
        transition: Transition,
        nodes: Node<CsmNodeProps>[]
    ) => {
        const target = nodes.find((n) => {
            if (isState(n.data)) {
                return n.data.state.name === transition.getTarget();
            }
            return false;
        });

        if (!target) {
            return;
        }

        const edgeId = getNewEdgeId();

        const edge: Edge<CsmEdgeProps> = {
            id: edgeId,
            source: sourceState.nodeId,
            target: target.id,
            // Optionally specify sourceHandle and targetHandle here if known
            // sourceHandle: 'r-s',
            // targetHandle: 'l-t',
            type: "csm-edge",
            data: { transition: transition },
            zIndex: 1,
            markerEnd: { type: MarkerType.ArrowClosed },
        };

        return edge;
    };

    // Function to load the CSM and generate nodes and edges
    const loadCSM = async (description: CollaborativeStateMachineDescription) => {
        const topLevelStatemachines = fromCollaborativeStatemachineDescription(
            description
        );

        // Generate nodes and edges
        const nodes = generateNodes(topLevelStatemachines);
        let edges: Edge<CsmEdgeProps>[] = [];

        nodes.forEach((node) => {
            if (isState(node.data)) {
                const sourceState = node.data.state;
                sourceState.on.forEach((transition) => {
                    const edge = transitionToEdge(sourceState, transition, nodes);
                    if (edge) {
                        edges.push(edge);
                    }
                });

                sourceState.always.forEach((transition) => {
                    const edge = transitionToEdge(sourceState, transition, nodes);
                    if (edge) {
                        edges.push(edge);
                    }
                });

            }
        });

        try {
            // Reset services
            resetReactFlow();
            resetServices();

            // Set nodes and edges
            setNodes(nodes);
            setEdges(edges);

            // Set up services.
            setupStateOrStatemachineService(stateOrStateMachineService, nodes);
            setupContextVariableService(contextService, nodes);
            setupActionService(actionService, nodes, edges);
            setupEventService(eventService, nodes);
            setupGuardService(guardService, edges);




            // Perform layout
            getLayoutedElements(nodes, edges);



            stateOrStateMachineService.showStatemachineStateNames();


        } catch (error) {
            console.error("Error in laying out nodes:", error);
        }
    };

    // Function to perform layout using ELK
    const getLayoutedElements = useCallback(
        (nodes: Node<CsmNodeProps>[], edges: Edge<CsmEdgeProps>[]) => {
            const nodeMap = new Map<string, Node<CsmNodeProps>>();
            nodes.forEach((node) => nodeMap.set(node.id, node));

            // Organize nodes by their parentId
            const rootNodes: Node<CsmNodeProps>[] = [];
            const nodeChildrenMap = new Map<string, Node<CsmNodeProps>[]>();

            nodes.forEach((node) => {
                const parentId = node.parentId;
                if (parentId) {
                    if (!nodeChildrenMap.has(parentId)) {
                        nodeChildrenMap.set(parentId, []);
                    }
                    nodeChildrenMap.get(parentId)!.push(node);
                } else {
                    rootNodes.push(node);
                }
            });

            // Recursive function to build ELK nodes with hierarchy
            const buildELKNode = (node: Node<CsmNodeProps>, depth = 0): any => {
                const elkNode: any = {
                    id: node.id,
                    width: node.width ?? 150,
                    height: node.height ?? 50,
                    // If node has children, set layout options for it
                    ...(nodeChildrenMap.has(node.id)
                        ? {
                            layoutOptions: {
                                ...(isStateMachine(node.data)
                                    ? {...parentLayoutOptions, "elk.partitioning.partition": depth} // Apply parentLayoutOptions to statemachine nodes
                                    : {...childLayoutOptions, "elk.partitioning.partition": depth + 1,}), // Apply childLayoutOptions to other nodes with children
                            },
                            children: nodeChildrenMap.get(node.id)!.map(buildELKNode, depth + 1),
                        }
                        : {}),
                };
                return elkNode;
            };

            const elkNodes = rootNodes.map(buildELKNode);

            // Build ELK edges
            const elkEdges = edges.map((edge) => ({
                id: edge.id,
                sources: [edge.source],
                targets: [edge.target],
            }));

            const graph = {
                id: "root",
                layoutOptions: { ...rootLayoutOptions },
                children: elkNodes,
                edges: elkEdges,
            };

            elk.layout(graph).then((layoutedGraph) => {
                // Function to update node positions recursively
                const updateNodePositions = (
                    elkNode: any,
                    parentX = 0,
                    parentY = 0
                ) => {
                    const node = nodeMap.get(elkNode.id);

                    if (node) {
                        node.position = {
                            x: (elkNode.x ?? 0) + parentX,
                            y: (elkNode.y ?? 0) + parentY,
                        };
                    }
                    if (elkNode.children) {
                        elkNode.children.forEach((childElkNode: any) => {
                            updateNodePositions(
                                childElkNode,
                                node?.position.x || 0,
                                node?.position.y || 0
                            );
                        });
                    }
                };

                layoutedGraph.children?.forEach((elkNode: any) => {
                    updateNodePositions(elkNode);
                });

                const layoutedNodes = Array.from(nodeMap.values());

                setNodes(layoutedNodes);

                // Adjust edges to specify handles based on node positions
                const layoutedEdges = edges.map((edge) => {
                    const sourceNode = nodeMap.get(edge.source);
                    const targetNode = nodeMap.get(edge.target);

                    if (sourceNode && targetNode) {
                        const sourcePosition = sourceNode.position;
                        const targetPosition = targetNode.position;

                        // Determine handle IDs based on relative positions
                        let sourceHandleId = "r-s";
                        let targetHandleId = "l-t";

                        if (targetPosition.x < sourcePosition.x) {
                            // Target is to the left of source
                            sourceHandleId = "l-s";
                            targetHandleId = "r-t";
                        } else if (targetPosition.y < sourcePosition.y) {
                            // Target is above source
                            sourceHandleId = "t-s";
                            targetHandleId = "b-t";
                        } else if (targetPosition.y > sourcePosition.y) {
                            // Target is below source
                            sourceHandleId = "b-s";
                            targetHandleId = "t-t";
                        }

                        return {
                            ...edge,
                            sourceHandle: sourceHandleId,
                            targetHandle: targetHandleId,
                        };
                    }

                    return edge;
                });
                adjustInternalTransitionHandles(layoutedEdges)
                setEdges(layoutedEdges);
            });
        },
        [setNodes, setEdges]
    );

    // Function to handle file selection and load the CSM
    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const fileName = file.name;
            const fileContent = await file.text();

            fetch("http://localhost:3001/save-file", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fileName,
                    fileContent,
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to save file.");
                    }
                    return response.json();
                })
                .then((data) => {
                    loadCSM(data as CollaborativeStateMachineDescription);
                })
                .catch((error) => {
                    console.error("Error saving file:", error);
                });
        }
    };

    return (
        <>
            <Button onClick={handleButtonClick}>Import</Button>
            <input
                type="file"
                accept=".pkl"
                ref={inputFile}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </>
    );
}
