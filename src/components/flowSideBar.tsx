import React from "react";
import {NodeType} from "../types.ts";


export default function FlowSideBar () {
    const onDragStart = (event:React.DragEvent<HTMLDivElement>, nodeType : NodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className={"flowSideBar"}>
        <aside>
            <div className="description">You can drag these nodes to the pane on the right.</div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'entry-node')} draggable>
                Entry Node
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'state-machine-node')} draggable>
                State Machine Node
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'state-node')} draggable>
                State Node
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'exit-node')} draggable>
                Exit Node
            </div>
        </aside>
        </div>
    );
}
