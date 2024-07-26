//import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS
import "../css/undoButton.css"
import {useCallback, useContext, useEffect, useState} from "react";
import {ReactFlowContext} from "./flow.tsx";
import {CsmNodeProps, ReactFlowContextProps} from "../types.ts";
import {Node} from "@xyflow/react";


export default function UndoButton() {

    const context: ReactFlowContextProps = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {setNodes, nodeHistory
    } = context;

    let currentIndex: number | undefined = undefined



    const onClick = useCallback(() => {
        console.log("Entering undo");
        if (currentIndex === undefined) {
            currentIndex = nodeHistory.length - 1
        }

        if(currentIndex <= 0){
            console.log("Beginning of array");
            return;
        }

        currentIndex = currentIndex -1;
        console.log(`Current index : ${currentIndex}`);

        setNodes((prev) => {
            if(currentIndex !== undefined){
                return(nodeHistory[currentIndex]);
            }
            return prev

        })





        console.log(nodeHistory);
    }, [nodeHistory]);

    return (
        <div>
            <button className="undoButton" onClick={onClick}>
                <i className="fas fa-undo"></i>
            </button>
        </div>
    );
}