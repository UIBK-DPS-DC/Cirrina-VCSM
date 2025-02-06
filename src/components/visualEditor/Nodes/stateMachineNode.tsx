import {Handle, NodeProps, NodeResizer, Position} from "@xyflow/react";
import {ReactFlowContextProps, type StateMachineNode} from "../../../types.ts";
import {useContext, useEffect, useState} from "react";
import {ReactFlowContext} from "../../../utils.tsx";

export function StateMachineNode ({data, selected}: NodeProps<StateMachineNode>) {

    const [resizeIsVisible, setResizeIsVisible] = useState<boolean>(data.visibleResize ? data.visibleResize : true);
    const [draggable, setDraggable] = useState<boolean>(data.draggable ? data.draggable : true);

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;

    const {nodes, setNodes} = context


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

            <div
                className={`react-flow__node-group ${!draggable ? 'not-draggable' : ''}`}
                style={{visibility: draggable ? 'visible' : 'hidden'}}
            >


                {resizeIsVisible && (
                    <NodeResizer
                        color="#ff0071"
                        isVisible={resizeIsVisible}
                        minWidth={0}
                        minHeight={0}
                    />
                )}


                <div style={labelStyle}>

                    <span className="custom-drag-handle">{data.stateMachine.name} </span>

                </div>




                <>
                    <Handle
                        type="source"
                        position={Position.Top}
                        style={{
                            position: "absolute",
                            right: "100%",
                            left: 0,
                            transform: "translateY(250%)",
                            visibility: "hidden"
                        }}
                        id={"a"}
                    />

                    <Handle
                        type="target"
                        position={Position.Top}
                        style={{
                            position: "absolute",
                            right: "100%",
                            left: 0,
                            transform: "translateY(250%)",
                            visibility: "hidden"
                        }}
                        id={"b"}
                    />

                    <Handle
                        type="source"
                        position={Position.Top}
                        style={{
                            position: "absolute",
                            right: "100%",
                            left: 0,
                            transform: "translateY(250%) translateX(2550%)",
                            visibility: "hidden"
                        }}
                        id={"c"}
                    />

                    <Handle
                        type="target"
                        position={Position.Top}
                        style={{
                            position: "absolute",
                            right: "100%",
                            left: 0,
                            transform: "translateY(250%) translateX(2550%)",
                            visibility: "hidden"
                        }}
                        id={"d"}
                    />

                </>



            </div>
        </>


    );


}
