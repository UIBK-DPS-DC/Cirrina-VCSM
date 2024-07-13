import {Handle, NodeProps, Position} from "@xyflow/react";
import {type ExitNode} from "../../types.ts";

export function ExitNode ({data}: NodeProps<ExitNode>) {
    return (
        <div className="react-flow__node-default">
            <Handle type={"target"} position={Position.Top}/>
            {data.name && <div>{data.name}</div>}
            <div>
            </div>
        </div>
    );
}