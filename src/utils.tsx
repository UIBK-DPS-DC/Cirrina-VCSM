import {Edge, Node} from "@xyflow/react";
import {CsmEdgeProps, CsmNodeProps, isState, isStateMachine, OptionEnums, ReactFlowContextProps} from "./types.ts";
import React, {createContext} from "react";
import StateInfoForm from "./components/visualEditor/stateInfoForm.tsx";
import StateMachineInfoForm from "./components/visualEditor/stateMachineInfoForm.tsx";
import ContextVariable from "./classes/contextVariable.tsx";
import StateOrStateMachineService from "./services/stateOrStateMachineService.tsx";
import {CollaborativeStateMachineDescription} from "./pkl/bindings/collaborative_state_machine_description.pkl.ts";
import StateMachine from "./classes/stateMachine.ts";
import State from "./classes/state.ts";
import Event from "./classes/event.ts";
import CollaborativeStateMachine from "./classes/collaborativeStateMachine.tsx";


const DEBUG = false

export const ReactFlowContext = createContext<ReactFlowContextProps | null>(null);

function nodeIsEqual(node1: Node<CsmNodeProps>, node2: Node<CsmNodeProps>): boolean {
    if(DEBUG){
        console.log(`NODE1: ${node1} , NODE2: ${node2}`);
    }
    return node1.id === node2.id;
}

export const renderEnumAsOptions = (enumObject: OptionEnums) => {
    if(DEBUG){
        console.log(Object.keys(enumObject));
    }
    return (
        // Don't render timeout as option since only timeout actions can have this category
        Object.values(enumObject).filter((o) => o !== "Timeout Action").map((value) => {
            return <option key={value} value={value}>{value.toUpperCase()}</option>
        })
    );
    
}



export const setInitialState = (initialState: Node<CsmNodeProps>, nodes: Node<CsmNodeProps>[], edges: Edge<CsmEdgeProps>[]) =>  {

    let internalEdge = false
    edges.forEach(edge => {
        if(edge.source === initialState.id && edge.target === initialState.id) {
            console.error("Initial state cannot have internal transition");
            internalEdge = true
            return
        }
    })

    if(internalEdge){
        return
    }


    if(isState(initialState.data)){
        const siblings = nodes.filter((n) => n.parentId === initialState.parentId);
        siblings.forEach(sibling => {
            if(isState(sibling.data)){
                sibling.data.state.initial = false
            }
        })
        initialState.data.state.initial = true
        initialState.data.state.terminal = false
        console.log(`Set ${initialState.id} as initial state!`)
    }
    else {
        console.error("Statemachine can not be initial state")
    }
}

export const setStateAsTerminal = (terminalNode: Node<CsmNodeProps>, edges: Edge<CsmEdgeProps>[]) =>  {
    let outgoingEdge: boolean = false;
    edges.forEach((edge) => {
        if(edge.source === terminalNode.id){
            console.error("Terminal state cannot have outgoing transitions")
            outgoingEdge = true
            return
        }
    })

    if(outgoingEdge){
        return
    }

    if(isState(terminalNode.data)){
        terminalNode.data.state.terminal = true
        terminalNode.data.state.initial = false
        console.log(`Set ${terminalNode.id} as a terminal state`)
    }
    else{
        console.error("Statemachine cannot be terminal states")
    }

}



export const renderContextVariablesAsOptions = (vars: ContextVariable[]) => {
    return vars.map((variable) => {
        return(
            <option key={variable.name} value={variable.name}>{variable.name}</option>
        )
    })
}

export const renderStringsAsOptions = (strings: string[]) => {
    return strings.map((string) => {
        return (
            <option key={string} value={string}>{string}</option>
        )
    })
}

export function getNodeInfoForm(node: Node) {
    switch (node.type) {
        case "state-node":
            return StateInfoForm;
        case "state-machine-node":
            return StateMachineInfoForm;
    }
}


export const getParentNode = (node: Node<CsmNodeProps>, nodes: Node<CsmNodeProps>[]): Node<CsmNodeProps> | undefined => {
    return nodes.find((n) => n.id === node.parentId);
};

const getNodeDepth = (node: Node<CsmNodeProps>, nodes: Node<CsmNodeProps>[]): number => {
    if(isStateMachine(node.data)){
        const parentNode = getParentNode(node, nodes)
        if(parentNode){
            return 1 + getNodeDepth(parentNode, nodes)
        }
        return 0
    }
    return 0
}

// TODO: Maybe different background colors depending on depth.
export const colorMap = (nodeDepth: number) => {
    switch (nodeDepth) {
        default: {
            return "rgba(244, 2, 127, 0.11)"
        }
    }

}

export const recolorNode = (node: Node<CsmNodeProps>, nodes: Node<CsmNodeProps>[]) => {
    if(isStateMachine(node.data)){
        node.style = {
            ...node.style,
            backgroundColor: colorMap(getNodeDepth(node, nodes))
        }

    }
    return
}

export const getMostDistantAncestorNode = (
    node: Node<CsmNodeProps>,
    nodes: Node<CsmNodeProps>[],
    visited: Set<string> = new Set() // Track visited nodes
): Node<CsmNodeProps> => {
    // Check if the current node has already been visited (cycle detection)
    if (visited.has(node.id)) {
        throw new Error(`Cycle detected at node with ID: ${node.id}`);
    }

    visited.add(node.id);

    const ancestor = getParentNode(node, nodes);

    if (!ancestor) {
        return node;
    }

    return getMostDistantAncestorNode(ancestor, nodes, visited);
};

export const getAllStatemachineDescendants = (root: Node<CsmNodeProps>,
                                              nodes: Node<CsmNodeProps>[],
                                              visited: Set<string> = new Set()
): Node<CsmNodeProps>[] => {
    let statemachineNodes: Node<CsmNodeProps>[] = [];

    // Check if the current node has already been visited (cycle detection)
    if (visited.has(root.id)) {
        throw new Error(`Cycle detected at node with ID: ${root.id}`);
    }

    visited.add(root.id);

    nodes.forEach((node: Node<CsmNodeProps>) => {
        if (node.parentId === root.id && node.type === "state-machine-node") {
            statemachineNodes.push(node);
        }
    });

    statemachineNodes.forEach((node: Node<CsmNodeProps>) => {
        statemachineNodes = statemachineNodes.concat(getAllStatemachineDescendants(node, nodes, visited));
    });

    return statemachineNodes;
};


export const getRaisedEventsToStateMap = (nodes: Node<CsmNodeProps>[]) => {
    const stateToRaisedEventsMap: Map<State,Event[]> = new Map();
    nodes.forEach((node: Node<CsmNodeProps>) => {
        if(isState(node.data)){
            stateToRaisedEventsMap.set(node.data.state, node.data.state.getAllRaisedEvents())
        }
    })
    return stateToRaisedEventsMap
}

export const getConsumedEventsToStateMap = (nodes: Node<CsmNodeProps>[]) => {
    const stateToConsumedEventsMap: Map<State,string[]> = new Map();
    nodes.forEach((node: Node<CsmNodeProps>) => {
        if(isState(node.data)){
            stateToConsumedEventsMap.set(node.data.state, node.data.state.getAllConsumedEvents())
        }
    })

    return stateToConsumedEventsMap

}

export const generateRaisedToConsumedInfoStrings = (nodes: Node<CsmNodeProps>[]) => {
    const infoStrings: string[] = [];
    const stateToRaisedEventsMap: Map<State, Event[]> = getRaisedEventsToStateMap(nodes);
    const stateToConsumedEventsMap: Map<State, string[]> = getConsumedEventsToStateMap(nodes);

    Array.from(stateToRaisedEventsMap.keys()).forEach((rk) => {
        const raisedEvents = stateToRaisedEventsMap.get(rk)?.map((e) => e.name);

        if (raisedEvents) {
            Array.from(stateToConsumedEventsMap.keys()).forEach((ck) => {
                const consumedEvents = stateToConsumedEventsMap.get(ck)?.filter((e) => raisedEvents.includes(e));

                if (consumedEvents && consumedEvents.length > 0) {
                    consumedEvents.forEach((e) => {
                        const infoString = `Event ${e} raised by state ${rk.name} is consumed by a transition out of state ${ck.name}`;
                        infoStrings.push(infoString);
                    });
                }
            });
        }
    });

    // Remove duplicate strings
    const uniqueInfoStrings = Array.from(new Set(infoStrings));

    return uniqueInfoStrings;
};






export const getAllStateNamesInExtent = (node: Node<CsmNodeProps>, nodes: Node<CsmNodeProps>[], service: StateOrStateMachineService): Set<string> => {
    const root = getMostDistantAncestorNode(node,nodes)
    const rootName = service.getName(root.data)
    const stateMachineChildren = getAllStatemachineDescendants(root, nodes)
    const stateNames = (service.getStateNames(root.id) || new Set()).add(rootName)

    stateMachineChildren.forEach(node => {
        const names = service.getStateNames(node.id)
        if(names){
            names.forEach((name) => stateNames.add(name));
        }
    })


    return stateNames

};

export const generateCsmSkeleton = (): CollaborativeStateMachineDescription => {
    const csm: CollaborativeStateMachineDescription = {
        localContext: {variables: []}, name: "csm", persistentContext: {variables: []}, stateMachines: [], version: "2.0"

    }

    return csm
}

export const fromCollaborativeStatemachineDescription = (description: CollaborativeStateMachineDescription): CollaborativeStateMachine => {
    // Get all statemachines
    const collaborativeStateMachine = new CollaborativeStateMachine(description.name, description.version)
    collaborativeStateMachine.persistentContext = description.persistentContext?.variables.map((v) => ContextVariable.fromDescription(v)) || []
    collaborativeStateMachine.localContext = description.localContext?.variables.map((v) => ContextVariable.fromDescription(v)) || []
    collaborativeStateMachine.stateMachines = description.stateMachines.map((s) => StateMachine.fromDescription(s))
    return collaborativeStateMachine;
}

export const hasHiddenAncestor = (
    node: Node<CsmNodeProps>,
    nodes: Node<CsmNodeProps>[]
): boolean => {
    const parent = getParentNode(node, nodes);
    if (parent) {
        return parent.hidden ? true : hasHiddenAncestor(parent, nodes);
    } else {
        return false;
    }
};

export const saveNodePositions = (setNodes: (value: React.SetStateAction<Node<CsmNodeProps>[]>) => void) => {
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
}






// Custom styles for dark mode

export const customSelectStyles = {
    // @ts-ignore
    control: (provided) => ({
        ...provided,
        backgroundColor: '#343a40', // Dark background
        color: '#ffffff', // Text color
        borderColor: '#495057', // Border color
    }),
    // @ts-ignore
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#343a40', // Dark background
        color: '#ffffff', // Text color
    }),
    // @ts-ignore
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#495057' : '#343a40', // Highlight on focus
        color: '#ffffff', // Text color
    }),
    // @ts-ignore
    singleValue: (provided) => ({
        ...provided,
        color: '#ffffff', // Text color
    }),
    // @ts-ignore
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#495057', // Background color for selected items
        color: '#ffffff', // Text color
    }),
    // @ts-ignore
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#ffffff', // Text color of multi-value labels
    }),
    // @ts-ignore
    multiValueRemove: (provided) => ({
        ...provided,
        color: '#ff6b6b', // Remove button color
        ':hover': {
            backgroundColor: '#e84118', // Hover background for remove button
            color: '#ffffff', // Hover text color
        },
    }),
};



export {nodeIsEqual}

