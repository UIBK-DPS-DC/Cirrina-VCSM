import {Edge, Node, OnEdgesChange, OnNodesChange} from "@xyflow/react";
import Transition from "./classes/transition.ts";
import StateMachine from "./classes/stateMachine.ts";
import State from "./classes/state.ts";
import React from "react";
import Event from "./classes/event.ts";
import StateOrStateMachineService from "./services/stateOrStateMachineService.tsx";
import Action from "./classes/action.ts";
import ActionService from "./services/actionService.tsx";
import EventService from "./services/eventService.tsx";
import ContextVariableService from "./services/contextVariableService.tsx";
import GuardService from "./services/guardService.tsx";
import TransitionService from "./services/transitionService.tsx";
import {
    ActionCategory,
    ActionType,
    ContextType,
    EventChannel,
    MemoryUnit,
    ServiceLevel,
    ServiceType,
    TimeUnit
} from "./enums.ts";
import ContextVariable from "./classes/contextVariable.tsx";

// One Type to avoid repeating ourselves. Can be expanded/unionized as needed.
export type CsmNodeProps = {state: State} | {stateMachine: StateMachine} | {name: string};
export type CsmEdgeProps = {transition: Transition}

export type NodeType =
    | 'state-node'
    | 'state-machine-node'


export type OptionEnums = typeof ActionType | typeof ServiceType | typeof ServiceLevel | typeof ActionCategory
    | typeof TimeUnit | typeof MemoryUnit | typeof ContextType | typeof EventChannel


export type Transitionn = {
    target?: string;
    guards: string[]; //string placeholder for now
    actions: Action[];
    else?: string[];
    event?: string;
}

export type InvokeActionProps = {
    type: ActionType,
    serviceType: ServiceType,
    isLocal: boolean,
    input: ContextVariable[],
    done: Event[],
    output: ContextVariable[] // Maybe make it Context Variable array
}

export type CreateActionProps = {
    type: ActionType,
    variable: ContextVariable,
    isPersistent: boolean
}

export type ActionProps = InvokeActionProps | CreateActionProps | {}







export type StateNode = Node<{
   state : State
}, 'state-node'>;

export type StateMachineNode = Node<{
   stateMachine : StateMachine
}, 'state-machine-node'>;

export type TransitionEdge = Edge<{
    transition: Transition
}, 'csmEdge'>;


export type ReactFlowContextProps = {
    nodes: Node<CsmNodeProps>[];
    setNodes: React.Dispatch<React.SetStateAction<Node<CsmNodeProps>[]>>;
    onNodesChange: OnNodesChange<Node<CsmNodeProps>>
    nodeHistory: Node<CsmNodeProps>[][];
    setNodeHistory: React.Dispatch<React.SetStateAction<Node<CsmNodeProps>[][]>>;
    selectedEdge: Edge<CsmEdgeProps> | null
    setSelectedEdge: React.Dispatch<React.SetStateAction<Edge<CsmEdgeProps> | null>>
    edges: Edge<CsmEdgeProps>[];
    setEdges: React.Dispatch<React.SetStateAction<Edge<CsmEdgeProps>[]>>
    onEdgesChange: OnEdgesChange<Edge<CsmEdgeProps>>
    selectedNode: Node<CsmNodeProps> | null;
    setSelectedNode: React.Dispatch<React.SetStateAction<Node<CsmNodeProps> | null>>;
    showSidebar: boolean;
    setShowSidebar:  React.Dispatch<React.SetStateAction<boolean>>;
    nameInput: string;
    setNameInput: React.Dispatch<React.SetStateAction<string>>;
    stateOrStateMachineService: StateOrStateMachineService;
    actionService: ActionService;
    eventService: EventService;
    contextService: ContextVariableService;
    guardService: GuardService;
    transitionService: TransitionService;
}





// Type guards

/**
 * Type guard function to check if the provided data is of type `{ state: State }`.
 *
 * This function takes a `CsmNodeProps` object and checks if it has a `state` property.
 * It returns `true` if the `state` property is defined, indicating that the data is of type `{ state: State }`.
 *
 * @param {CsmNodeProps} data - The data to check.
 * @returns {data is { state: State }} - Returns `true` if the data is of type `{ state: State }`.
 */
export function isState(data: CsmNodeProps): data is { state: State } {
    if(!data){
        return false;
    }
    return (data as { state: State }).state !== undefined;
}

/**
 * Type guard function to check if the provided data is of type `{ stateMachine: StateMachine }`.
 *
 * This function takes a `CsmNodeProps` object and checks if it has a `stateMachine` property.
 * It returns `true` if the `stateMachine` property is defined, indicating that the data is of type `{ stateMachine: StateMachine }`.
 *
 * @param {CsmNodeProps} data - The data to check.
 * @returns {data is { stateMachine: StateMachine }} - Returns `true` if the data is of type `{ stateMachine: StateMachine }`.
 */
export function isStateMachine(data: CsmNodeProps): data is { stateMachine: StateMachine } {
    if(!data){
        return false;
    }
    return (data as { stateMachine: StateMachine }).stateMachine !== undefined;
}