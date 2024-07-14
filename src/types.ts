import {Edge, Node} from "@xyflow/react";
import Transition from "./classes/transition.ts";
import StateMachine from "./classes/stateMachine.ts";
import State from "./classes/state.ts";

// One Type to avoid repeating ourselves. Can be expanded/unionized as needed.
export type CsmNodeProps = {
    name: string
}

export type NodeType =
    | 'entry-node'
    | 'exit-node'
    | 'state-node'
    | 'state-machine-node'

export type EntryNode = Node<CsmNodeProps, 'entry-node'>;

export type StateNode = Node<CsmNodeProps, 'state-node'>;

export type StateMachineNode = Node<CsmNodeProps, 'state-machine-node'>;

export type ExitNode = Node<CsmNodeProps, 'exit-node'>;


// Node Types with classes. Unsure if needed
export type CsmEdgeProps = Edge<{
    transition: Transition
}, 'csmEdge'>;

export type StateMachineProps = Node<{
    stateMachine: StateMachine
}>