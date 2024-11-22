/**
 * Express server which connects to OpenAI backend.
 * Defines REST api to interact with gpt model.
 * Provides for context injections, basic testing, and user feedback.
 */
import express from 'express';
import cors from "cors";
import {getGPTSummarizeResponse, 
    getTTSResponse, 
    getGPTSimplifyResponse, 
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
 * Endpoint: /summarize
 * Send data to OpenAI API to summarize
 * @param req Request from client. Should contain:
 *      - 'message': text to summarize
 *      - 'context': instruct OpenAPI about what potential avoidance and dangerous content
 *      - 'vocabLevel': level of vocabulary that we expect from OpenAI API response
 * @return string summarization from OpenAI API
 */
app.post('/summarize', async (req, res) => {
    const message = req.body.params['0']['message'];
    const context = req.body.params['0']['context'];
    const vocab = req.body.params['0']['vocabLevel'];

    if (!message || !context) {
        return res.status(400).send("No message or context provided");
    }

    if (!vocab) {
        return res.status(400).send("Missing vocabLevelContext under context")
    }

    if (isDev){
        res.send("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
    } else {
        const response = await getGPTSummarizeResponse(message, context, vocab);
        res.send(response.choices[0].message.content); // Send back to FE
    }
});

/**
 * Endpoint: /tts
 * Send data to OpenAI API to synthesize into text-to-speech
 * @param req Request from client. Should contain:
 *      - 'message': text to synthesize
 *      - 'voice': voice to use for the output
 * @return arrayBuffer array buffer data that can be converted into blob for playing mp3
 */
app.post('/tts', async (req, res) => {
    const message = req.body.params['0']['message'];
    const voice = req.body.params['0']['voice'];

    if (!message || !voice) {
        return res.status(400).send("No message or voice provided");
    }

    if (isDev) {
        fs.readFile('./res/alloy.wav', (err, data) => {
            if (err) {
                console.error('Error reading the .wav file:', err);
                res.status(500).send('Error reading the audio file');
                return;
            }

            res.set({
                'Content-Type': 'audio/wav',
                'Content-Disposition': 'inline; filename=tts.mp3',
            });

            res.send(data);
        });
    } else {
        try {
            const mp3 = await getTTSResponse(message, voice)

            // Convert the MP3 response to a buffer
            const buffer = Buffer.from(await mp3.arrayBuffer());

            // Send the buffer to the client with appropriate headers
            res.set({
                "Content-Type": "audio/mpeg",
                "Content-Disposition": "inline; filename=tts.mp3",
            });
            res.send(buffer);
        } catch (error) {
            console.error("Error generating TTS:", error);
            res.status(500).send("Failed to generate TTS.");
        }
    }
});

/**
 * Endpoint: /feedback
 * Take feedback data from client and append it to the server's CSV file
 * @param req Request from client. Should contain:
 *      - 'summarizationScore': score that the user rate for the summarization feature
 *      - 'ttsScore': score that the user rate for the tts feature
 *      - 'customizationScore': score that the user rate for the customization feature
 *      - 'other': other comments user might have
 * @return string whether the response is recorded or not
 */
app.post('/feedback', async (req, res) => {
    const summarizeScore = req.body.params['0']['summarizationScore'];
    const ttsScore = req.body.params['0']['ttsScore'];
    const customizationScore = req.body.params['0']['customizationScore'];
    const other = req.body.params['0']['other'];

    const csvRow = `${summarizeScore},${ttsScore},${customizationScore},"${other}"\n`;
    const filePath = '../feedback.csv';
    if (!fs.existsSync(filePath)) {
        const headers = 'Summarization Score,TTS Score,Customization Score,Other\n';
        fs.writeFileSync(filePath, headers);
    }

    fs.appendFileSync(filePath, csvRow, 'utf8');

    res.send("Response recorded.");
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