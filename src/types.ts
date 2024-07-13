import {Edge, Node} from "@xyflow/react";
import Transition from "./classes/transition.ts";
import StateMachine from "./classes/stateMachine.ts";

export type NodeType =
    | 'entry-node'
    | 'exit-node'
    | 'state-node'
    | 'state-machine-node'

export type EntryNode = Node<{
    name: string
}, 'entry-node'>;

export type StateNode = Node<{
    name : string
}, 'state-node'>;

export type StateMachineNode = Node<{
    name : string
}, 'state-machine-node'>;

export type ExitNode = Node<{
    name: string
}, 'exit-node'>;


// Node Types with classes. Unsure if needed
export type CsmEdgeProps = Edge<{
    transition: Transition
}, 'csmEdge'>;

export type StateMachineProps = Node<{
    stateMachine: StateMachine
}>