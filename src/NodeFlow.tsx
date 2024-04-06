import { useCallback, useState } from 'react';
import 'reactflow/dist/style.css';
import "./MainFlow.css"
import StateNode from './classes/StateNode';
import { StateBuilder } from './classes/builders/StateBuilder';
import { StateClass } from './classes/StateClass';
import { StateEdge } from './classes/StateEdge';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    OnNodesChange,
    applyNodeChanges,
    ReactFlowProvider,
    applyEdgeChanges,
  } from 'reactflow';
import { TransitionClass } from './classes/transition/TransitionClass';

const nodeTypes = {
    stateNode: StateNode
}

const edgeTypes = {
  stateEdge: StateEdge
}

const initialStateName = "Initial";
const terminalStateName = "Terminal";

const stateBuilder: StateBuilder = new StateBuilder();
const initialState: StateClass = stateBuilder.setName(initialStateName).setIsInitial(true).build();
stateBuilder.reset();
const terminalState: StateClass = stateBuilder.setName(terminalStateName).setIsTerminal(true).build(); 

StateClass.registerName(initialStateName);
StateClass.registerName(terminalStateName);
console.log(initialState);
console.log(terminalState);



const initialNodes = [
    {id: initialState.name, type: 'stateNode',
    position:{x: 0, y: 0},
    data: { state: initialState} },
    {id: terminalState.name, type: 'stateNode',
    position:{x: 0, y: 150},
    data: { state: terminalState} }

]

const initialEdges = [
  { id: 'a->b', type: 'stateEdge', source: initialStateName, target: terminalStateName, data: {transition: new TransitionClass(terminalStateName)} },
];



function Flow() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes],
      );

    
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
      );


    
  
    return (
    <div id = "flow-container">
        <div id = "main-flow">
        <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes= {edgeTypes}
        fitView
        onNodesChange = {onNodesChange}
        onEdgesChange = {onEdgesChange}
        >
        <Controls></Controls>
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
        </ReactFlowProvider>
      </div>
      </div>
    );
  }
  
  export default Flow;

