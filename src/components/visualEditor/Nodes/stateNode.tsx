import {Handle, NodeProps, Position} from "@xyflow/react";
import {ReactFlowContextProps, type StateNode} from "../../../types.ts";
import {useContext, useMemo} from "react";
import {ReactFlowContext} from "../../../utils.tsx";
import "../../../StateNode.css";

export function StateNode({ data }: NodeProps<StateNode>) {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {initialOrTerminalChange, setInitialOrTerminalChange, showStateDescriptions } = context;

    // Use useMemo to compute the className based on the state changes
    const border = useMemo(() => {
        if (data.state.terminal) {
            return "neonBorderRed";
        }
        if (data.state.initial) {
            return "neonBorder";
        }
        return "";
    }, [initialOrTerminalChange, setInitialOrTerminalChange]);

    // Optional: Add this effect to log when the state changes, if needed for debugging
    /*useEffect(() => {
        console.log(`Initial: ${data.state.initial}, Terminal: ${data.state.terminal}`);
        console.log(`Node:${selectedNode?.id} || Parent:${selectedNode?.parentId}`);
    }, [data.state.initial, data.state.terminal, selectedNode]);
    */

    const infoString = () => {
        let info = ""
        if(data.state.entry.length > 0) {
            info += "Entry:\n"
            data.state.entry.forEach(e => {
                info+= e.getInfoString()
                info+= "\n"
            })
        }

        if(data.state.while.length > 0) {
            info+= "\nWhile:\n"
            data.state.while.forEach(e => {
                info+= e.getInfoString()
                info+= "\n"
            })
        }

        if(data.state.after.length > 0) {
            info+= "\nAfter:\n"
            data.state.after.forEach(e => {
                info+= e.getInfoString()
                info+= "\n"
            })

        }

        if(data.state.exit.length > 0) {
            info+= "\nExit:\n"
            data.state.exit.forEach(e => {
                info+= e.getInfoString()
                info+= "\n"
            })

        }

        return info;
    }

    return (
        <div className={`react-flow__node-default  ${border}`}>
            <Handle className={"source-handle source-handle-top"}  type={"source"} position={Position.Top} id={"t-s"} isConnectableStart={true}/>
            <Handle className={"target-handle target-handle-top"} type={"target"} position={Position.Top} id={"t-t"} isConnectableStart={false}/>

            <Handle className={"source-handle source-handle-left"} type={"source"} position={Position.Left} id={"l-s"}/>
            <Handle className={"target-handle target-handle-left"} type={"target"} position={Position.Left} id={"l-t"} isConnectableStart={false}/>

            <Handle
                type={"source"}
                position={Position.Top}
                id={"s"}
                isConnectable={false}
                style={{ visibility: "hidden", left: "30%" }}
            />

            <Handle
                type={"target"}
                position={Position.Bottom}
                id={"t-3"}
                isConnectable={false}
                style={{visibility: "hidden", left: "30%" }}
            />


            <Handle
                type={"target"}
                position={Position.Right}
                id={"t-2"}
                isConnectable={false}
                style={{visibility: "hidden",top: "50%" }}
            />

            <Handle
                type={"target"}
                position={Position.Top}
                id={"t-1"}
                isConnectable={false}
                style={{visibility: "hidden",left: "70%" }}
            />

            {data.state.name &&
                <div>
                    <div>
                        {data.state.name}
                    </div>
                    {showStateDescriptions && (
                        <div>
                            {infoString()}
                        </div>
                    )}
                </div>}

            <Handle
                type={"target"}
                position={Position.Left}
                id={"t"}
                isConnectable={false}
                style={{ visibility: "hidden", top: "50%" }}
            />

            <Handle
                type={"source"}
                position={Position.Right}
                id={"s-1"}
                isConnectable={false}
                style={{visibility: "hidden",top: "50%" }}
            />

            <Handle
                type={"source"}
                position={Position.Bottom}
                id={"s-2"}
                isConnectable={false}
                style={{visibility: "hidden",left: "70%" }}
            />

            <Handle
                type={"source"}
                position={Position.Left}
                id={"s-3"}
                isConnectable={false}
                style={{visibility: "hidden",top: "50%" }}
            />


            <Handle className={"source-handle source-handle-right"} type={"source"} position={Position.Right} id={"r-s"}/>
            <Handle className={"target-handle target-handle-right"} type={"target"} position={Position.Right} id={"r-t"} isConnectableStart={false}/>

            <Handle className={"source-handle source-handle-bottom"} type={"source"} position={Position.Bottom} id={"b-s"}/>
            <Handle className={"target-handle target-handle-bottom"} type={"target"} position={Position.Bottom} id={"b-t"} isConnectableStart={false}/>
        </div>
    );
}
