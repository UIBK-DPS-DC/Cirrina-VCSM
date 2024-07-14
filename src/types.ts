import {Edge, Node} from "@xyflow/react";
import Transition from "./classes/transition.ts";
import StateMachine from "./classes/stateMachine.ts";
import State from "./classes/state.ts";

// One Type to avoid repeating ourselves. Can be expanded/unionized as needed.
export type CsmNodeProps = {state: State} | {stateMachine: StateMachine} | {name: string};

export type NodeType =
    | 'entry-node'
    | 'exit-node'
    | 'state-node'
    | 'state-machine-node'

export type EntryNode = Node<{name: string}, 'entry-node'>;

//export type StateNode = Node<CsmNodeProps, 'state-node'>;

//export type StateMachineNode = Node<CsmNodeProps, 'state-machine-node'>;

export type StateNode = Node<{
   state : State
}, 'state-node'>;

export type StateMachineNode = Node<{
   stateMachine : StateMachine
}, 'state-machine-node'>;


export type ExitNode = Node<{name: string}, 'exit-node'>;


// Node Types with classes. Unsure if needed
export type CsmEdgeProps = Edge<{
    transition: Transition
}, 'csmEdge'>;

export type StateMachineProps = Node<{
    stateMachine: StateMachine
}>



// Guards

// Type guards
export function isState(data: CsmNodeProps): data is { state: State } {
    return (data as { state: State }).state !== undefined;
}

export function isStateMachine(data: CsmNodeProps): data is { stateMachine: StateMachine } {
    return (data as { stateMachine: StateMachine }).stateMachine !== undefined;
}

export function isExitOrEntry(data: CsmNodeProps): data is {name: string}{
    return (data as {name: string}).name !== undefined;
}
