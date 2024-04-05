import { useCallback, useState } from 'react';
import 'reactflow/dist/style.css';
import "./MainFlow.css"
import StateNode from './classes/StateNode';
import { StateBuilder } from './classes/builders/StateBuilder';
import { StateClass } from './classes/StateClass';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    OnNodesChange,
    applyNodeChanges,
    ReactFlowProvider,
  } from 'reactflow';

const nodeTypes = {
    stateNode: StateNode
}

const initialStateName = "Initial";

const stateBuilder: StateBuilder = new StateBuilder();
const initialState: StateClass = stateBuilder.setName(initialStateName).setIsInitial(true).build();
StateClass.registerName(initialStateName);
console.log(initialState);



const initialNodes = [
    {id: initialState.name, type: 'stateNode',
    position:{x: 0, y: 0},
    data: { state: initialState} }
]

function Flow() {
    const [nodes, setNodes] = useState(initialNodes);

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes],
      );


    
  
    return (
    <div id = "flow-container">
        <div id = "main-flow">
        <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        fitView
        onNodesChange = {onNodesChange}
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

