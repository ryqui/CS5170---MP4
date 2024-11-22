/**
 * Express server which connects to OpenAI backend.
 * Defines REST api to interact with gpt model.
 * Provides for context injections, basic testing, and user feedback.
 */
import express from 'express';
import cors from "cors";
import {getGPTSimplifyResponse, 
    getGPTDefineResponse, 
    getGPTExplainResponse, 
    getGPTRewriteResponse, 
    isDev} from './openaiService.js';
import fs from 'fs';

// Server object
const app = express();

// These options enable us to dump json payloads and define the return signal
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(express.json());
app.use(cors(corsOptions));

// Default route, just to have it
app.get('/', (req, res) => {
    res.send("The server is up!");
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});

/**
 * Endpoint: /process
 * Send data to OpenAI API to process the text
 * @param req Request from client. Should contain:
 *      - 'text': text to process
 *      - 'context': context text to help form a response
 *      - 'vocabLevel': vocab level
 *      - 'type': type of process to do
 * @return string response from OpenAI API
 * @throws error if there is an error processing the request
 * @throws 400 if the request is missing required fields
 * @throws 500 if there is an error processing the request
 * @throws 400 if the type is invalid
 */
app.post('/process', async (req, res) => {
    const text = req.body.params['0']['text'];
    const context = req.body.params['0']['context'];
    const vocabLevel = req.body.params['0']['vocabLevel'];
    const type = req.body.params['0']['type'];
    const style = req.body.params['0']['style'];
    console.log(req.body.params);
    if (!text || !context) {
        return res.status(400).send("No text or context provided");
    }


    if (!type || !['explain', 'define', 'simplify', 'rewrite'].includes(type)) {
        return res.status(400).send("Invalid or missing type");
    }

    const gptFunctions = {
        explain: getGPTExplainResponse,
        define: getGPTDefineResponse,
        simplify: getGPTSimplifyResponse,
        rewrite: getGPTRewriteResponse
    };

    try {
        if (isDev){
            res.send("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
        } else {
            const response = await gptFunctions[type](text, context, vocabLevel, style);
            res.send(response.choices[0].text.content);
        }
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).send("An error occurred while processing your request.");
    }
});