import React,{useCallback, useState} from "react"
import Sidebar from "./Sidebar";
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
  } from 'reactflow';

import "./MainFlow.css"

import 'reactflow/dist/style.css';

function MainFlow(){
    
    const initialNodes = [
        { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
        { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
      ];
      const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

    const onNodeDrop = (event: React.DragEvent<HTMLDivElement>) => {
        console.log(event);
        const nodeType = event.dataTransfer.getData('nodeType');
        console.log(nodeType);


        const newNode = {id : idCounter.toString(), position:{x:0, y:0}, data: {label : idCounter.toString()}}
            console.log(newNode);
            
         addNode(newNode)

        if(nodeType === "nodeType1"){
            const targetId = (event.target).getAttribute("data-id");
            const newEdge = {id: "e" + targetId.toString() + "-" +idCounter.toString(),
            source : targetId.toString(), target : idCounter.toString()}
            
            console.log(newEdge);
    
            addEdge(newEdge)
    
            
        }
        else{
            console.log("nodeType2");
        }
        incrementId()

        console.log(nodes);
       


        
    };

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [idCounter,setIdCounter] = useState(3)

    function incrementId(){
        setIdCounter((i)=> i + 1)
    }

    function addNode(node: any){
        setNodes([...nodes,node])
    }

    function addEdge(edge: any){
        setEdges([...edges, edge])
    }


    




    return(
        <div id = "flow-container" onDrop={onNodeDrop}
        onDragOver={(event) => event.preventDefault()}>
            <div id ="sidebar-container"><Sidebar></Sidebar></div>
            <div id = "main-flow">
            <ReactFlow 
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}>
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
            </div>
        </div>
    );
}


export default MainFlow



