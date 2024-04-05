import { NodeProps, NodeToolbar,useReactFlow, Handle, Node, Position } from "reactflow";
import { useState } from "react";
import { StateData } from "./types";
import "../StateNode.css"
import { StateBuilder } from "./builders/StateBuilder";
import { StateClass } from "./StateClass";



// Used to generate numbers for newly created unnamed states
export class StateNameNumber {
    static stateNameNumber: number = 0;

    // Gets the current number without incrementing it
    static getCurrentNumber(): number{
        return this.stateNameNumber;
    }

    //Increments the internal counter and generates new number
    static getNewNumber(): number {
        this.stateNameNumber++;
        return this.stateNameNumber;
    }

}

export default function StateNode(props: NodeProps<StateData>){
    const [stateName, setStateName] = useState(props.data.state.name);
    const [tempStateName, setTempStateName] = useState(props.data.state.name);
    const [nodeData, setNodeData] = useState(props.data.state)
    const [isEditing, setIsEditing] = useState(false);
    const [toolbarIsVisible, setToolbarIsVisible] = useState(false);
    const [sourceHandleId, setSourceHandleId] = useState(createSourceHandleId(stateName));
    const [targetHandleId, setTargetHandleId] = useState(createTargetHandleId(stateName));

    const reactFlow = useReactFlow();
    const stateBuilder: StateBuilder = new StateBuilder();

    



    const handleStateNameChange = (e : React.ChangeEvent<HTMLInputElement>) =>{
        const name: string = e.target.value;
        setTempStateName(name);
        console.log("Temp name set", tempStateName);
        
    }

    const handleDoubleClick = () => {
        setIsEditing(true);
    }

    const handleBlur = () => {
        setIsEditing(false);
        
        if(StateClass.nameIsUnique(tempStateName)){

            StateClass.unregisterName(stateName);
            StateClass.registerName(tempStateName);

            nodeData.name = tempStateName;
            setStateName(tempStateName);
            setNodeData(nodeData);
            setSourceHandleId(createSourceHandleId(tempStateName));
            setTargetHandleId(createTargetHandleId(tempStateName));
            
        }
        else {
            console.log("Name not unique");
        }

    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          setIsEditing(false);
          if(StateClass.nameIsUnique(tempStateName)){

            StateClass.unregisterName(stateName);
            StateClass.registerName(tempStateName);

            nodeData.name = tempStateName;
            setNodeData(nodeData);
            setStateName(tempStateName);
            setSourceHandleId(createSourceHandleId(tempStateName));
            setTargetHandleId(createTargetHandleId(tempStateName));
          }
          else{
            console.log("Name not unique");
          }
          console.log(nodeData);

        }

      };

    
    const handleRightClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        setToolbarIsVisible(!toolbarIsVisible);

     };


    const handleButtonClick = () => {
        const newState: StateClass = createNewState();
        const newNode: Node<StateData> = {
            id: newState.name,
            type: "stateNode",
            position: {
                x: props.xPos + 30,
                y: props.yPos + 30,
            },
            data: {
                state : newState
            }

        }

        reactFlow.addNodes(newNode);
        
    }


    function createNewState(): StateClass{
        let newStateName: string = "state - " + StateNameNumber.getNewNumber().toString();
        while(!StateClass.nameIsUnique(newStateName)){
            newStateName = "state - " + StateNameNumber.getNewNumber().toString();
        }
        console.log("New unique name", newStateName);
        StateClass.registerName(newStateName);

        const newState: StateClass = stateBuilder.setName(newStateName).build();
        stateBuilder.reset();
        console.log(newState);
        return newState;
    }



    function createSourceHandleId(stateName: string): string {
        return (stateName) + "-" +"source";
    }

    function createTargetHandleId(stateName: string): string {
        return (stateName) + "-" + "target";
    }

    







    return(
        <div id = {stateName} className = "state-node" onDoubleClick={handleDoubleClick} onContextMenu={handleRightClick} style={{border: nodeData.isInitial ? "2px solid green" : nodeData.isTerminal ? "2px solid red" : "none"}}>
            <Handle type = "target" position = {Position.Top} id = {targetHandleId}></Handle>
            {isEditing? (
                <input className = "node-name-field" type = "text" value = {tempStateName} onChange={handleStateNameChange} onBlur={handleBlur} onKeyDown={handleKeyPress}></input>
            ) : ( <div>{stateName}</div>
            )}
            <NodeToolbar isVisible = {toolbarIsVisible}>
                <button onClick={handleButtonClick}>Add connected State</button>
            </NodeToolbar>
            <Handle type="source" position={Position.Bottom} id = {sourceHandleId}/>
            
        </div>
    )
}


