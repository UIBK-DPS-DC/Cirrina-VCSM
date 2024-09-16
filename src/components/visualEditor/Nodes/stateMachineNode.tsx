import {NodeProps, NodeResizer} from "@xyflow/react";
import {ReactFlowContextProps, type StateMachineNode} from "../../../types.ts";
import {useContext, useEffect, useState} from "react";
import {ReactFlowContext} from "../../../utils.tsx";

export function StateMachineNode ({data, selected}: NodeProps<StateMachineNode>) {

    const [resizeIsVisible, setResizeIsVisible] = useState<boolean>(data.visibleResize ? data.visibleResize : false);
    const [draggable, setDraggable] = useState<boolean>(data.draggable ? data.draggable : true);

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;

    const {nodes, setNodes} = context

    const dragHandleStyle = {
        display: 'inline-block',
        width: 25,
        height: 25,
        backgroundColor: 'teal',
        marginLeft: 5,
        borderRadius: '50%',
    };

    const labelStyle = {
        display: 'flex',
        alignItems: 'center',
    };

    useEffect(() => {
        if(data.visibleResize !== undefined){
            setResizeIsVisible(data.visibleResize);

        }

        if(data.draggable !== undefined) {
            setDraggable(data.draggable);
        }

    }, [data,selected, nodes, setNodes]);


    return (
        <>
            {(
                <div className="react-flow__node-group">
                        <NodeResizer
                            color="#ff0071"
                            isVisible={resizeIsVisible}
                            minWidth={0}
                            minHeight={0}>

                        </NodeResizer>

                    {draggable && (
                        <div style={labelStyle}>
                            {data.stateMachine.name}
                            {/* Use the class specified at node.dragHandle here */}
                            <span className="custom-drag-handle" style={dragHandleStyle}/>
                        </div>
                    )}
                </div>
            )}
        </>

    );
}
