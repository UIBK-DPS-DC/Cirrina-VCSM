import { Node, Edge } from "@xyflow/react"
import StateMachine from "./classes/statemachine"
import Transition from "./classes/transition";


export type StateMachineProps = Node<{
    stateMachine: StateMachine
}, "stateMachine">

export type CsmEdgeProps = Edge<{ 
    transition: Transition 
}, 'csmEdge'>;







