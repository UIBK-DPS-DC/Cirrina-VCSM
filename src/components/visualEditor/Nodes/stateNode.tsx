import {Handle, NodeProps, Position} from "@xyflow/react";
import {type StateNode} from "../../../types.ts";
export function StateNode ({data}: NodeProps<StateNode>) {





    return (
        <div className="react-flow__node-default">
            <Handle type={"target"} position={Position.Top} id={"a"}/>
            <Handle type={"source"} position={Position.Top} id={"s"} style={{visibility: "hidden", left: "30%"}}/>
            {data.state.name && <div>{data.state.name}</div>}
            <Handle type={"target"} position={Position.Left} id={"t"} style={{visibility: "hidden", top: "50%"}}/>
            <Handle type={"source"} position={Position.Bottom} id={"b"}/>
        </div>
    );
}

