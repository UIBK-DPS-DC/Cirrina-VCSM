import {BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath} from '@xyflow/react';

import {ReactFlowContextProps, TransitionEdge} from "../../types.ts";
import {useContext, useEffect, useState} from "react";
import {ReactFlowContext} from "../../utils.tsx";
import Transition from "../../classes/transition.ts";

export default function CsmEdge({
                                    id,
                                    sourceX,
                                    sourceY,
                                    targetX,
                                    targetY,
                                    markerEnd,
                                    target,
                                    source,
                                    data,

                                }: EdgeProps<TransitionEdge>) {
    const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });
    const [infoString,setInfoString] = useState<string>("");

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {edges, setEdges,selectedEdge} = context;

    const generateInfoString = (transition: Transition | undefined) => {
        if(transition && transition.getEvent()){
            if(transition.getGuards().length >= 1) {
                return transition.getEvent() + " / " + transition.getGuards().map((guard => {
                    return guard.name ? guard.name : guard.expression
                })).toString();
            }
            else {
                return transition.getEvent();
            }

        }
        return ""
    }

    useEffect(() => {
        setInfoString(generateInfoString(data?.transition))
    }, [edges,setEdges]);


    // For internal transitions
    const radiusX = (sourceX - targetX) * 0.8;
    const radiusY = 30;
    const internalPath = `M ${sourceX - 5} ${sourceY + 3} A ${radiusX} ${radiusY} 0 1 0 ${
        targetX + 2
    } ${targetY}`;






    return (
        <>
            {target !== source && (
                <>
                    <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} />
                    <EdgeLabelRenderer>
                        {selectedEdge?.id === id && infoString && (
                            <div
                                style={{
                                    position: 'absolute',
                                    transform: `translate(-50%, -100%) translate(${targetX}px,${targetY}px)`,
                                    background: '#34c9eb',
                                    padding: 10,
                                    borderRadius: 5,
                                    fontSize: 12,
                                    fontWeight: 500,
                                }}
                                className="nodrag nopan"
                            >
                                {infoString}
                            </div>
                        )}

                    </EdgeLabelRenderer>
                </>
            ) || (
                <path
                    id={id}
                    className="react-flow__edge-path"
                    d={internalPath}
                    markerEnd={markerEnd}
                />
            )}

        </>
    );


}






