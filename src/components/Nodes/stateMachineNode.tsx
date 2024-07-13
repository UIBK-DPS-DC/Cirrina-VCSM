import {NodeProps, NodeResizer} from "@xyflow/react";
import {type StateMachineNode} from "../../types.ts";

export function StateMachineNode ({data, selected}: NodeProps<StateMachineNode>) {
    return (
        <div className="react-flow__node-group">
            <NodeResizer
                color="#ff0071"
                isVisible={selected}
                minWidth={200}
                minHeight={300}
            />
            {data.name && <div>{data.name}</div>}
            <div>
            </div>
        </div>
    );
}
