import {
    BaseEdge,
    EdgeLabelRenderer,
    type EdgeProps,
    getSmoothStepPath,
    getSimpleBezierPath,
} from '@xyflow/react';

import {
    ReactFlowContextProps,
    TransitionEdge,
} from '../../types.ts';
import { useContext, useEffect, useState } from 'react';
import { ReactFlowContext } from '../../utils.tsx';
import Transition from '../../classes/transition.ts';
import '../../css/edges.css';

export default function CsmEdge({
                                    id,
                                    sourceX,
                                    sourceY,
                                    targetX,
                                    targetY,
                                    sourcePosition,
                                    targetPosition,
                                    markerEnd,
                                    target,
                                    source,
                                    data,
                                    sourceHandleId,
                                }: EdgeProps<TransitionEdge>) {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        targetPosition,
        sourcePosition,
    });
    const [infoString, setInfoString] = useState<string>('');

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const { edges, setEdges, hideFlowEdges, showEdgeLabels } = context;




    // Event [guards] / actions
    const generateInfoString = (transition: Transition | undefined) => {
        if (!transition) {
            return '';
        }

        const event = transition.getEvent();
        const guards = transition.getGuards();
        const actions = transition.getActions();

        let guardString = '';
        let eventString = ""

        if(event){
            eventString+= `${event}:`
        }


        if (guards.length > 0) {
            guardString += '[';
            guards.forEach((guard, i) => {
                guardString += guard.expression;
                if (i !== guards.length - 1) {
                    guardString += ', ';
                }
            });
            guardString += ']';
        }

        let actionString = '';
        if (actions.length > 0) {
            actionString += '\u2192 '; // u2192 is the unicode for a right facing arrow
            actions.forEach((action, i) => {
                actionString += action.getInfoString(); // TODO: GENERATE ACTION INFO FUNCTION HERE
                if (i !== actions.length - 1) {
                    actionString += ', ';
                }
            });
        }

        return `${eventString} ${guardString} ${actionString}`;
    };

    useEffect(() => {
        setInfoString(generateInfoString(data?.transition));
    }, [edges, setEdges]);

    // For internal transitions
    const radiusX = (sourceX - targetX) * 0.8;
    const radiusY = 30;
    const internalPath = `M ${sourceX - 5} ${sourceY + 3} A ${radiusX} ${radiusY} 0 1 0 ${
        targetX + 2
    } ${targetY}`;

    const isStatemachineEdge = data?.transition.isStatemachineEdge;
    const [smEdgePath] = getSimpleBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    // Determine the condition for label positioning
    const topToBottom = sourceHandleId === 't-s' || sourceHandleId === 'b-s';
    const leftToRight = sourceHandleId === 'r-s' || sourceHandleId === 'l-s';

    let internalTransitionXOffset: number
    let internalTransitionYOffset: number


    switch (sourceHandleId){
        case "s": {
            internalTransitionXOffset = -120
            internalTransitionYOffset = 0;
            break
        }
        case "s-1": {
            internalTransitionXOffset = 110
            internalTransitionYOffset = -15
            break
        }
        case "s-2": {
            internalTransitionXOffset = 110
            internalTransitionYOffset = 45
            break
        }
        case "s-3": {
            internalTransitionXOffset = -90
            internalTransitionYOffset = 60
            break
        }
        default: {
            internalTransitionXOffset = 0
            internalTransitionYOffset = 0
        }
    }



    // Adjust label position based on the condition
    const labelOffsetX = topToBottom
        ? sourceHandleId === 't-s'
            ? 75
            : -75
        : 0;
    const labelOffsetY = leftToRight
        ? sourceHandleId === 'r-s'
            ? 15
            : -15
        : 0;

    // Calculate the midpoint for internal transitions
    const midPoint = {
        x: sourceX,
        y: sourceY - radiusY, // Adjust radiusY as needed
    };

    return (
        <>
            {target !== source && !isStatemachineEdge ? (
                <>
                    <BaseEdge
                        id={id}
                        path={edgePath}
                        markerEnd={markerEnd}
                        style={{
                            stroke: data?.transition.isElseEdge ? 'purple' : undefined,
                            strokeDasharray: data?.transition.isElseEdge ? '5,5' : undefined,
                        }}
                    />
                    <EdgeLabelRenderer>
                        {infoString.trim() && showEdgeLabels && (
                            <div
                                style={{
                                    position: 'absolute',
                                    transform: `
                                    translate(-50%, -50%)
                                    translate(${labelX}px, ${labelY}px)
                                    translate(${labelOffsetX}px, ${labelOffsetY}px)`,
                                    zIndex: 2,
                                }}
                                className="nodrag nopan fixed-label"
                            >
                                {infoString}
                            </div>
                        )}
                    </EdgeLabelRenderer>
                </>
            ) : target === source ? (
                <>
                    <path
                        id={id}
                        className="react-flow__edge-path"
                        d={internalPath}
                        markerEnd={markerEnd}
                    />
                    {infoString.trim() && showEdgeLabels && (
                        <EdgeLabelRenderer>
                            <div
                                style={{
                                    position: 'absolute',
                                    transform: `
                                    translate(-50%, -50%)
                                    translate(${midPoint.x + internalTransitionXOffset}px, ${midPoint.y + internalTransitionYOffset}px)`,
                                    zIndex: 2

                                }}
                                className="nodrag nopan fixed-label"
                            >
                                {infoString}
                            </div>
                        </EdgeLabelRenderer>
                    )}
                </>
            ) : (
                <>
                    <BaseEdge
                        id={id}
                        path={smEdgePath}
                        style={{
                            opacity: hideFlowEdges ? 0 : 1,
                        }}
                        interactionWidth={hideFlowEdges ? 0 : undefined}
                    />
                    <circle r="10" fill="#ff0073" opacity={hideFlowEdges ? 0 : 1}>
                        <animateMotion
                            dur="3s"
                            repeatCount="indefinite"
                            path={smEdgePath}
                        />
                    </circle>
                </>
            )}
        </>
    );
}
