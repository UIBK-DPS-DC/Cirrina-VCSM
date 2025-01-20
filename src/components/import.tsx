// Ensure all required imports are correct and in place
import {Button} from "react-bootstrap";
import React, {useCallback, useContext, useRef} from "react";
import {CollaborativeStateMachineDescription,} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";
import {colorMap, fromCollaborativeStatemachineDescription, ReactFlowContext, saveNodePositions,} from "../utils.tsx";
import {
    CreateActionProps,
    CsmEdgeProps,
    CsmNodeProps, InvokeActionProps,
    isState,
    isStateMachine,
    ReactFlowContextProps,
} from "../types.ts";
import State from "../classes/state.ts";
import {Edge, MarkerType, Node} from "@xyflow/react";
import StateMachine from "../classes/stateMachine.ts";
import ELK from "elkjs/lib/elk.bundled.js";
import Transition from "../classes/transition.ts";
import StateOrStateMachine from "../classes/stateOrStateMachine.ts";
import StateOrStateMachineService, {NO_PARENT,} from "../services/stateOrStateMachineService.tsx";
import ActionService from "../services/actionService.tsx";
import Action from "../classes/action.tsx";
import ContextVariableService from "../services/contextVariableService.tsx";
import {ActionType} from "../enums.ts";
import EventService from "../services/eventService.tsx";
import GuardService from "../services/guardService.tsx";
import Event from "../classes/event.ts";
import {getNewEdgeId, getNewGuardId, getNewNodeId,} from "./visualEditor/flow.tsx";
import ServiceTypeService from "../services/serviceTypeService.tsx";
import CollaborativeStateMachine from "../classes/collaborativeStateMachine.tsx";


// Define the layout options for ELK
const rootLayoutOptions = {
    "elk.algorithm": "layered",
    "elk.direction": "RIGHT",
    "elk.edgeRouting": "ORTHOGONAL", // Enable orthogonal edge routing
    "elk.allowEdgeNodeOverlap": "false",
    "elk.layered.spacing.nodeNodeBetweenLayers": "200", // Increased spacing between layers
    "elk.layered.spacing.edgeNodeBetweenLayers": "200", // Increased spacing between layers
    "elk.spacing.nodeNode": "1000", // Increased spacing between nodes in the same layer
    "elk.spacing.edgeEdge": "150",
    "elk.spacing.edgeNode": "200",
    "elk.contentAlignment": "V_CENTER",

    "portConstraints": "FIXED_ORDER",
    "elk.margins": "100",
     "elk.partitioning.activate": "true",
    "elk.layered.nodePlacement.strategy": "SIMPLE",
    "elk.padding": "50",
};

const parentLayoutOptions = {
    "elk.algorithm": "layered",
    "elk.direction": "RIGHT",
    "elk.edgeRouting": "ORTHOGONAL",
    "elk.allowEdgeNodeOverlap": "false",
    "elk.layered.spacing.nodeNodeBetweenLayers": "100", // Increased spacing between layers
    "elk.layered.spacing.edgeNodeBetweenLayers": "100", // Increased spacing between layers
    "elk.spacing.nodeNode": "500", // Increased spacing between nodes in the same layer
    "elk.spacing.edgeEdge": "100",
    "elk.spacing.edgeNode": "200",
    "portConstraints": "FIXED_ORDER",
    "elk.partitioning.activate": "true",
    "elk.margins": "100",
    "elk.layered.nodePlacement.strategy": "SIMPLE",
    "elk.contentAlignment": "V_CENTER",
    "elk.padding": "100", // Increased padding for parent nodes
};

const childLayoutOptions = {
    "elk.algorithm": "layered",
    "elk.direction": "DOWN",
    "elk.edgeRouting": "ORTHOGONAL",
    "elk.allowEdgeNodeOverlap": "false",
    "portConstraints": "FIXED_ORDER",
    "elk.layered.spacing.nodeNodeBetweenLayers": "200", // Increased spacing between layers
    "elk.layered.spacing.edgeNodeBetweenLayers": "200", // Increased spacing between layers
    "elk.spacing.nodeNode": "200", // Increased spacing between nodes in the same layer
    "elk.spacing.edgeEdge": "250",
    "elk.spacing.edgeNode": "150",
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
        setHideFlowEdges,
        serviceTypeService,
        setCsm,
        setShowStateDescriptions
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
        serviceTypeService.resetService()
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

    const setUpServiceTypeService = (service: ServiceTypeService, nodes: Node<CsmNodeProps>[]) => {

        nodes.forEach((node) => {
            if(isState(node.data)){
                node.data.state.getAllActions()
                    .filter((a) => a.type === ActionType.INVOKE).forEach((i) => {
                        const invokeActionProps = i.properties as InvokeActionProps;
                        service.registerServiceType(invokeActionProps.serviceType)
                })
            }
        })
    }


    // TODO get events raised by a transition
    const setupEventService = (
        service: EventService,
        nodes: Node<CsmNodeProps>[]
    ) => {
        // Get raise event actions
        // Get timeout actions that are raise event actions

        let raisedEvents: Event[] = [];


        nodes.forEach((node) => {
            if (isState(node.data)) {
                raisedEvents = raisedEvents.concat(node.data.state.getAllRaisedEvents())
            }

        });

        raisedEvents.forEach((e) => {
            service.registerEvent(e);
        })



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

    const registerCsmContext = (csm: CollaborativeStateMachine) => {
        csm.persistentContext.forEach((v) => contextService.registerContext(v))
        csm.localContext.forEach((v) => contextService.registerContext(v));
    }

    const adjustInternalTransitionHandles = (edges: Edge<CsmEdgeProps>[], nodes: Node<CsmNodeProps>[]) => {
        edges.forEach((e) => {
            if(e.source === e.target){
                const sourceNode = nodes.find((n) => n.id === e.source)
                if(sourceNode && isState(sourceNode.data)) {

                    let sourceHandle = ""
                    let targetHandle: string

                    State.INTERNAL_SOURCE_HANDLES.every((handle) => {
                        if(isState(sourceNode.data)){

                            if(!sourceNode.data.state.isSourceHandleUsed(handle)){
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

                    e.sourceHandle = sourceHandle
                    e.targetHandle = targetHandle
                    sourceNode.data.state.addSourceHandle(sourceHandle)
                }



            }
            // Adjust else edges to have same source handle as edge with else.
            if(e.data?.transition.isElseEdge){
                console.log("ELSE EDGE FOUND")
                const newSource = edges.find((edge) => edge.data?.transition.getId() === e.data?.transition.elseSourceId)
                console.log(`NEW SOURCE ${newSource}`)
                if(newSource){
                    e.sourceHandle = newSource.sourceHandle
                }
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
        nodes: Node<CsmNodeProps>[],
        parentId: string | undefined
    ) => {
        // Handle internal
        let target: Node<CsmNodeProps> | undefined

        if(transition.getTarget().trim() === ""){
            target = nodes.find((n) => {
                if(isState(n.data)){
                    return n.data.state.name === sourceState.name && n.parentId === parentId
                }
                return false
            })
        }
        else {
            target = nodes.find((n) => {
                if (isState(n.data)) {
                    return n.data.state.name === transition.getTarget() && n.parentId === parentId;
                }
                return false;
            });
        }


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
            zIndex: transition.isElseEdge ? 0 : 1,
            markerEnd: { type: MarkerType.ArrowClosed },
        };

        console.log(`ELSE ${transition.isElseEdge}`)

        return edge;
    };

    // Function to load the CSM and generate nodes and edges
    const loadCSM = async (description: CollaborativeStateMachineDescription) => {
        const collaborativeStateMachine = fromCollaborativeStatemachineDescription(
            description
        );

        console.log(`DESCIRPTION : 
            ${description.stateMachines}`)

        // Generate nodes and edges
        const nodes = generateNodes(collaborativeStateMachine.stateMachines);
        let edges: Edge<CsmEdgeProps>[] = [];

        nodes.forEach((node) => {
            if (isState(node.data)) {
                const sourceState = node.data.state;
                sourceState.on.forEach((transition) => {
                    const edge = transitionToEdge(sourceState, transition, nodes, node.parentId);
                    if (edge) {
                        edges.push(edge);
                    }
                });

                sourceState.always.forEach((transition) => {
                    const edge = transitionToEdge(sourceState, transition, nodes, node.parentId);
                    if (edge) {
                        edges.push(edge);
                    }
                });


            }
        })

        const elseTransitions = edges.filter((e) => e.data?.transition.getElse().trim() !== "")

        elseTransitions.forEach((e) => console.log(e.data?.transition.getSource() + "=>" + e.data?.transition.getElse()))

        elseTransitions.forEach((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source)
            if(sourceNode){
                const targetNode: Node<CsmNodeProps> | undefined = nodes.find((n) => isState(n.data) && n.data.state.name === edge.data?.transition.getElse() && n.parentId === sourceNode.parentId)
                if (targetNode && isState(sourceNode.data) && isState(targetNode.data)) {
                    console.log(`${edge.source}  - ${edge.target}`);
                    const newTransition = new Transition(sourceNode.data.state.name,targetNode.data.state.name, false, true, edge.data?.transition.getId())
                    const newEdge = transitionToEdge(sourceNode.data.state, newTransition, nodes, sourceNode.parentId);
                    if (newEdge) {
                        edges.push(newEdge);
                    }


                }
            }





        })

        ;

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
            setUpServiceTypeService(serviceTypeService, nodes);





            // Perform layout
            getLayoutedElements(nodes, edges);



            stateOrStateMachineService.showStatemachineStateNames();
            setHideFlowEdges(true)
            setShowStateDescriptions(false)
            registerCsmContext(collaborativeStateMachine)
            setCsm(collaborativeStateMachine)


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
                ) => {
                    const node = nodeMap.get(elkNode.id);

                    if (node) {
                        node.position = {
                            x: (elkNode.x ?? 0),
                            y: (elkNode.y ?? 0),
                        };
                    }
                    if (elkNode.children) {
                        elkNode.children.forEach((childElkNode: any) => {
                            updateNodePositions(
                                childElkNode,
                            );
                        });
                    }
                };

                layoutedGraph.children?.forEach((elkNode: any) => {
                    updateNodePositions(elkNode);
                });

                const layoutedNodes = Array.from(nodeMap.values()).map((node) => {
                    if(node.parentId){
                        node.position = {x:node.position.x,y:node.position.y + 50};
                        return node
                    }
                    else{
                        return node
                    }
                });


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
                adjustInternalTransitionHandles(layoutedEdges, layoutedNodes )
                console.log(`NUM EDGES ${layoutedEdges.length}`)
                setEdges(layoutedEdges);
                saveNodePositions(setNodes)



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
