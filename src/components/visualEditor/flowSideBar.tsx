import React from "react";
import {NodeType} from "../../types.ts";


export default function FlowSideBar() {
    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: NodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };



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
            </aside>
        </div>
    );
}
