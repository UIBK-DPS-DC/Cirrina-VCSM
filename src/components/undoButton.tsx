//import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS
import "../css/undoButton.css"
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {ReactFlowContext} from "./flow.tsx";
import {CsmNodeProps, ReactFlowContextProps} from "../types.ts";
import {difference, differenceWith} from "lodash"
import {nodeIsEqual} from "../utils.tsx"
import {Node} from "@xyflow/react";


export default function UndoButton() {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const { setNodes, nodeHistory, stateOrStateMachineService } = context;

    const currentIndex = useRef<number | undefined>(undefined);

    const onClick = useCallback(() => {
        console.log("Entering undo");

        if (currentIndex.current === undefined) {
            console.log("index is undefined");
            currentIndex.current = nodeHistory.length - 1;
        }

        if (currentIndex.current <= 0) {
            console.log("Beginning of array");
            return;
        }

        currentIndex.current = currentIndex.current - 1;
        console.log(`Current index : ${currentIndex.current}`);

        setNodes((prev) => {
            if (currentIndex.current !== undefined) {
                const diff = differenceWith(prev, nodeHistory[currentIndex.current], nodeIsEqual);
                console.log("DIFF", diff);
                diff.forEach((node) => {
                    stateOrStateMachineService.unregisterName(stateOrStateMachineService.getName(node.data));
                });
                return nodeHistory[currentIndex.current];
            }
            return prev;
        });

        console.log(nodeHistory);
    }, [nodeHistory, setNodes, stateOrStateMachineService]);

    return (
        <div>
            <button className="undoButton" onClick={onClick}>
                <i className="fas fa-undo"></i> {/* Font Awesome undo icon */}
            </button>
        </div>
    );
}