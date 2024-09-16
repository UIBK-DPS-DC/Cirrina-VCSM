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
            <Handle type={"target"} position={Position.Top} id={"a"}/>
            <Handle type={"source"} position={Position.Top} id={"s"} style={{visibility: "hidden", left: "10%"}}/>
            {data.state.name && <div>{data.state.name}</div>}
            <Handle type={"target"} position={Position.Left} id={"t"} style={{visibility: "hidden", top: "40%"}}/>
            <Handle type={"source"} position={Position.Bottom} id={"b"}/>
        </div>
    );
}

