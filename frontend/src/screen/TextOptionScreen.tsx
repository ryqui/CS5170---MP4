import React from "react";
import "./TextOptionScreen.css";

import { useState } from "react";
import { useEffect } from "react";

/**
 * TextOptionScreen component that renders a screen with text options.
 *
 * @returns {JSX.Element} The TextOptionScreen component.
 */
const TextOptionScreen: React.FC<{ text: string; prompt: string; onClose: () => void }> = ({text, prompt, onClose}) => {
    const [response, setResponse] = useState<string>("");

    const fetchAIResponse = async () => {
        const response = await fetch("/api/ai-response", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, prompt }),
        });
        const data = await response.json();
        setResponse(data.response);
    };

    useEffect(() => {
        fetchAIResponse();
    }, [text, prompt]);
    
    return (
        <div className="text-option-container">
            <div className="text-option-content">
                <button className="close-btn" onClick={onClose}>X</button>
                <h2>AI Response</h2>
                <p><strong>Prompt:</strong> {prompt}</p>
                <p><strong>Response:</strong> {response || "Loading..."}</p>
            </div>
        </div>
    );
};

export default TextOptionScreen;