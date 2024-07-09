import { useState, useCallback } from 'react';
import {
  ReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type FitViewOptions,
  type DefaultEdgeOptions,
  type OnNodeDrag,

} from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';
import StateMachineNode from './classes/stateMachineNode';
import StateMachine from './classes/statemachine';


const nodeTypes = {
  stateMachine: StateMachineNode
}


const sm1 = new StateMachine("sm1")
const sm2 = new StateMachine("sm2")



 
const initialNodes: Node[] = [
  { id: '1', data: { stateMachine: sm1 }, position: { x: 5, y: 5 }, type: "stateMachine"},
  { id: '2', data: { stateMachine: sm2 }, position: { x: 5, y: 100 }, type: "stateMachine"},
];
 
const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2'}];
 
const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};
 
const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const onNodeDrag: OnNodeDrag = (_, node) => {
  console.log('drag event', node.data);
};
 
export default function App() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
 
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );
 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
     <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDrag={onNodeDrag}
      fitView
      fitViewOptions={fitViewOptions}
      defaultEdgeOptions={defaultEdgeOptions}>
        <Controls></Controls>
        <Background></Background>
        <MiniMap></MiniMap>
      </ReactFlow>
    </div>
  );
}