import {NodeProps, NodeResizer} from "@xyflow/react";
import {type StateMachineNode} from "../../../types.ts";

export function StateMachineNode ({data, selected}: NodeProps<StateMachineNode>) {
    return (
        <div className="react-flow__node-group">
            <NodeResizer
                color="#ff0071"
                isVisible={selected}
                minWidth={183}
                minHeight={150}
            />
            {data.stateMachine.name && <div>{data.stateMachine.name}</div>}
            <div>
            </div>
        </div>
    );
}
