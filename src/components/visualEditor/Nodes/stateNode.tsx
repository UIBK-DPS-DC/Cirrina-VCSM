import {Handle, NodeProps, Position} from "@xyflow/react";
import {ReactFlowContextProps, type StateNode} from "../../../types.ts";
import {useContext} from "react";
import {ReactFlowContext} from "../../../utils.tsx";

export function StateNode ({data}: NodeProps<StateNode>) {

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {
        eventService
    } = context
    const events = eventService.getAllEventsRaised(data)



    return (
        <div className="react-flow__node-default">
            <Handle type={"target"} position={Position.Top}/>
            {data.state.name && <div>{data.state.name}</div>}
            <Handle type={"source"} position={Position.Bottom}/>
        </div>
    );
}

