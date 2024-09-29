import React, {useContext} from "react";
import {NodeType, ReactFlowContextProps} from "../../types.ts";
import {ReactFlowContext} from "../../utils.tsx";
import CreateEventModal from "../Event/createEventModal.tsx";
import Event from "../../classes/event.ts";

export default function FlowSideBar() {
    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: NodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const context = useContext(ReactFlowContext) as ReactFlowContextProps
    const {eventService} = context

    const onNewEventSubmit = (event: Event) => {
        eventService.registerEvent(event)
    }

    return (
        <div className="flowSideBar bg-dark p-3" style={{position: "relative"}}>
            <aside>
                <div className="description text-light mb-2">
                    You can drag these nodes to the pane on the right.
                </div>
                <div
                    className="dndnode bg-light text-dark p-2 mb-2"
                    onDragStart={(event) => onDragStart(event, 'state-machine-node')}
                    draggable
                >
                    State Machine Node
                </div>
                <div
                    className="dndnode bg-light text-dark p-2"
                    onDragStart={(event) => onDragStart(event, 'state-node')}
                    draggable
                >
                    State Node
                </div>
                <div
                    style={{
                        position: "absolute",
                        bottom: "200px", //
                    }}
                >
                    <CreateEventModal event={undefined} onSubmit={onNewEventSubmit} buttonVariant={"light"} buttonSize={"lg"}></CreateEventModal>
                </div>
            </aside>
        </div>
    );
}
