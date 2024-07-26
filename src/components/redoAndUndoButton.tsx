//import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS
import "../css/redoUndoButton.css"
import {useCallback, useContext, useRef,} from "react";
import {ReactFlowContext} from "./flow.tsx";
import {ReactFlowContextProps} from "../types.ts";
import {differenceWith} from "lodash"
import {nodeIsEqual} from "../utils.tsx"



export default function RedoAndUndoButton() {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const { setNodes, nodeHistory, stateOrStateMachineService } = context;

    const currentIndex = useRef<number | undefined>(undefined);

    const onUndoClick = useCallback(() => {
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

    }, [nodeHistory, setNodes, stateOrStateMachineService]);


    const onRedoClick = useCallback(() => {
        console.log(`Current index : ${currentIndex.current}`);
        console.log("Entering redo");
        console.log(nodeHistory);

        if (currentIndex.current === undefined) {
            console.log("index is undefined");
            currentIndex.current = nodeHistory.length - 1;
        }

        if (currentIndex.current >= nodeHistory.length - 1) {
            console.log("End of array");
            return;
        }

        currentIndex.current = currentIndex.current + 1;
        console.log(`Current index : ${currentIndex.current}`);

        setNodes((prev) => {
            if (currentIndex.current !== undefined) {
                const diff = differenceWith(nodeHistory[currentIndex.current], prev, nodeIsEqual);
                console.log("DIFF", diff);
                diff.forEach((node) => {
                    stateOrStateMachineService.registerName(stateOrStateMachineService.getName(node.data));
                });
                return nodeHistory[currentIndex.current];
            }
            return prev;
        });


    },[nodeHistory, setNodes, stateOrStateMachineService])



    return (
        <div>
            <button className="redo-undo-button" onClick={onUndoClick}>
                <i className="fas fa-undo"></i> {/* Font Awesome undo icon */}
            </button>
            <button className="redo-undo-button" onClick={onRedoClick}>
                <i className="fas fa-redo"></i> {/* Font Awesome undo icon */}
            </button>
        </div>
    );
}