import {Handle, NodeProps, Position} from "@xyflow/react";
import {ReactFlowContextProps, type StateNode} from "../../types.ts";
import {ReactFlowContext} from "../flow.tsx";
import {useContext} from "react";

export function StateNode ({data}: NodeProps<StateNode>) {

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {
        eventService
    } = context
    const events = eventService.getAllEventsRaised(data)


    const renderAssociatedEvents = () => {

        // TODO: Style this
        return(
            <div className="raised-event-display">
                <h4>Raised Events: </h4>
                {events.map(event => (
                    <p key={data.state.name + " " + event}>{event}</p>
                ))}
            </div>
        )
    }

    return (
        <div className="react-flow__node-default">
            <Handle type={"target"} position={Position.Top}/>
            {data.state.name && <div>{data.state.name}</div>}
            <div>
                {events.length >= 1 && renderAssociatedEvents()}
            </div>
            <Handle type={"source"} position={Position.Bottom}/>
        </div>
    );
}

