import { Button } from "react-bootstrap";
import React, { useRef } from "react";

export default function Import() {
    const inputFile = useRef<HTMLInputElement | null>(null);
    // Function to handle the button click and trigger the file input click
    const handleButtonClick = () => {
        if (inputFile.current) {
            inputFile.current.click(); // Trigger click on the hidden file input
        }
    };

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
                    if (response.ok) {
                        alert('File saved successfully!');
                    } else {
                        alert('Failed to save file.');
                    }
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
