import {Handle, NodeProps, Position} from "@xyflow/react";
import {type EntryNode} from "../../types.ts";

export function EntryNode ({data}: NodeProps<EntryNode>) {
    return (
        <div className="react-flow__node-default">
            {data.name && <div>{data.name}</div>}
            <div>
            </div>
            <Handle type={"source"} position={Position.Bottom}/>
        </div>
    );
}
