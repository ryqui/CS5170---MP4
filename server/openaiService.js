/**
 * Used for connecting to OpenAI.
 * Provides connection, and response function wrapper
 */
import OpenAI from 'openai';
import fs from 'fs';

let apiKey = ""
try {
    apiKey = fs.readFileSync("./api_key.txt", 'utf8').trim();
} catch (error) {
    console.error("API key file not found. Assuming this is dev mode");
}
const isDev = !apiKey;

// Creates an OpenAI connection using the provided api key
const openai = new OpenAI({
    apiKey: apiKey
});

console.log("API key: " + apiKey);

/**
 * Function for getting a response that simplifies text.
 * @param message The text to simplify
 * @param context The context message to help form a response
 * @param vocabLevel Target vocabulary level for simplification
 * @returns GPT response object
 */
const getGPTSimplifyResponse = async (message, context, vocabLevel, style) => await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "user", content: "Simplify this text to make it easier to understand" },
        { role: "user", content: message },
        { role: "system", content: context },
        { role: "system", content: vocabLevel }
    ]
});

/**
 * Function for getting a response that explains text in detail.
 * @param message The text to explain
 * @param context The context message to help form a response
 * @returns GPT response object
 */
const getGPTExplainResponse = async (message, context, vocabLevel, style) => await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "user", content: "Explain this in detail to help the user understand better" },
        { role: "user", content: message },
        { role: "system", content: context }
    ]
});

/**
 * Function for getting a response that defines text.
 * @param message The text to define
 * @param context The context message to help form a response
 * @returns GPT response object
 */
const getGPTDefineResponse = async (message, context, vocabLevel, style) => await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "user", content: "Define the text provided in an informative and descriptive way" },
        { role: "user", content: message },
        { role: "system", content: context }
    ]
});

/**
 * Function for getting a response that rewrites text.
 * @param message The text to rewrite
 * @param context The context message to help form a response
 * @returns GPT response object
 */
const getGPTRewriteResponse = async (message, context, vocabLevel, style) => await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "user", content: "Rewrite this based in this style: " + style },
        { role: "user", content: message },
        { role: "system", content: style },
        { role: "system", content: vocabLevel },
        { role: "system", content: context }
    ]
});

export {getGPTDefineResponse, 
    getGPTExplainResponse, 
    getGPTSimplifyResponse, 
    getGPTRewriteResponse,
    isDev};