// server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import {loadFromPath} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";

const app = express();
const PORT = 3001; // Server port

/**
 * Mimic dirname
 * Source: https://iamwebwiz.medium.com/how-to-fix-dirname-is-not-defined-in-es-module-scope-34d94a86694d
 */
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const FILE_DIRECTORY = path.join(__dirname, 'saved_files'); // Directory to save files
const FILE_NAME = "tmp.pkl"

// Create the directory if it doesn't exist
if (!fs.existsSync(FILE_DIRECTORY)) {
    fs.mkdirSync(FILE_DIRECTORY, { recursive: true });
}

// Middleware to handle CORS and JSON body parsing
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Adjust limit as necessary for larger files

// Endpoint to save the uploaded file
app.post('/save-file', (req: Request, res: Response) => {
    const { fileName, fileContent } = req.body;
    console.log(`GOT FILE ${fileName}`);

    if (!fileName || !fileContent) {
        return res.status(400).send('Invalid file data');
    }

    const filePath = path.join(FILE_DIRECTORY, FILE_NAME);

    // Save the file content to the server
    fs.writeFile(filePath, fileContent, async (err) => {
        if (err) {
            console.error('Error saving file:', err);
            return res.status(500).send('Failed to save file');
        }

        console.log(`File saved at ${filePath}`);

        try {
            // Load the saved file using loadFromPath and process it
            const result = await loadFromPath(filePath);
            console.log(result)

            // Send the processed object back to the frontend
            res.json(result); // Assuming loadFromPath returns an object that can be serialized to JSON
        } catch (loadError) {
            console.error('Error processing file:', loadError);
            res.status(500).send('Failed to process file');
        }

    });


});



const pklFilePath = path.join(__dirname, "saved_files", FILE_NAME)
console.log(pklFilePath)

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
