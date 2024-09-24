import { Button } from "react-bootstrap";
import React, {useContext, useRef} from "react";
import {CollaborativeStateMachineDescription} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";
import {fromCollaborativeStatemachineDescription, ReactFlowContext} from "../utils.tsx";
import {ReactFlowContextProps} from "../types.ts";


let nodeId = 0;
let edgeId = 0;
const getNewNodeId = () => `node_${nodeId++}`;
const getNewEdgeId = () => `edge_${edgeId++}`;

export default function Import() {
    const inputFile = useRef<HTMLInputElement | null>(null);
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {contextService, transitionService, eventService, stateOrStateMachineService, actionService ,guardService} = context

    // Function to handle the button click and trigger the file input click
    const handleButtonClick = () => {
        if (inputFile.current) {
            inputFile.current.click(); // Trigger click on the hidden file input
        }
    };

    const resetServices = () => {
    }

    const loadCSM = (description: CollaborativeStateMachineDescription) => {
        // Get top level statemachines
        const topLevelStatemachines = fromCollaborativeStatemachineDescription(description)
        console.log("NUM TOP STATEMACHINES:" , topLevelStatemachines.length)
        // Get all state and statemachines


    }

    // Function to handle file selection
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0]; // Get the selected file
            const fileName = file.name;
            const fileContent = await file.text(); // Read file content as text

            // Send file data to the server
            fetch('http://localhost:3001/save-file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName,
                    fileContent,
                }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to save file.');
                    }
                    return response.json(); // Parse the response as JSON
                })
                .then(data => {
                    // Access the returned object from the server here
                    console.log('Response from server:', data);
                    loadCSM(data as CollaborativeStateMachineDescription)
                    // You can use the returned data here
                })
                .catch(error => {
                    console.error('Error saving file:', error);
                });
        }
    };

    return (
        <>
            <Button onClick={handleButtonClick}>
                Import
            </Button>
            <input
                type="file"
                accept=".pkl" // Limit file types to .pkl
                ref={inputFile}
                style={{ display: 'none' }} // Hide the input element
                onChange={handleFileChange} // Handle file selection
            />
        </>
    );
}
