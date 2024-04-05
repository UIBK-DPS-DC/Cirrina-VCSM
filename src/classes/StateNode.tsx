import { NodeProps, NodeToolbar,useReactFlow, useNodeId } from "reactflow";
import { useState } from "react";
import { StateData } from "./types";
import "../StateNode.css"


export default function StateNode(props: NodeProps<StateData>){
    const [stateName, setStateName] = useState(props.data.state.name);
    const [nodeData, setNodeData] = useState(props.data.state)
    const [isEditing, setIsEditing] = useState(false);
    const [toolbarIsVisible, setToolbarIsVisible] = useState(false);
    const reactFlow = useReactFlow();


    const handleStateNameChange = (e : React.ChangeEvent<HTMLInputElement>) =>{
        const name: string = e.target.value;
        setStateName(name);
        nodeData.name = name
        console.log("My name is," ,name);
        setNodeData(nodeData);
        
    }

    const handleDoubleClick = () => {
        setIsEditing(true);
    }

    const handleBlur = () => {
        setIsEditing(false);
        console.log(nodeData);
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          setIsEditing(false);
          console.log(nodeData);
        }

      };

    
    const handleOnClick = () => {
        setToolbarIsVisible(!toolbarIsVisible);

     };


    const handleButtonClick = (id: string | null) => {
        
    }



    return(
        <div className = "state-node" onDoubleClick={handleDoubleClick} onClick={handleOnClick} style={{border: nodeData.isInitial ? "2px solid green" : "none"}}>
            {isEditing? (
                <input className = "node-name-field" type = "text" value = {stateName} onChange={handleStateNameChange} onBlur={handleBlur} onKeyDown={handleKeyPress}></input>
            ) : ( <div>{stateName}</div>
            )}
            <NodeToolbar isVisible = {toolbarIsVisible}>
                <button onClick={handleButtonClick(useNodeId())}></button>
            </NodeToolbar>
            
        </div>
    )
}


