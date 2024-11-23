import React, { useState, useEffect, ChangeEvent, FC } from "react";
import "./ToolScreen.css";
import Dropdown from "../components/atom/Dropdown";
import {useSettings} from "../contexts/SettingsContext";
import ColorPicker from "../components/molecules/ColorPicker";
import HighlightableTextBox from "../components/molecules/HighlightableTextbox";
import { vocabLevels, getInstructionForLevel } from "../utils/VocabLevels";

const defaultColors = [
    "#c7afcc", "#7b9085", "#6c97a5", "#eadad6", "#9c85ea", "#f1ba8f", "#FFFFFF", "#555555"
];

const fontTypefaces = [
    "Arial", "Courier New", "Georgia", "Times New Roman", "Verdana", "Sans-serif", "Monospace"
];

const defaultTheme = {
    Background: "#FFFFFF",
    Text: "#000000"
};


/**
 * ToolScreen component.
 * 
 * This component represents a screen where users can input text, select vocabulary levels, 
 * change font styles, and customize the theme colors. It uses various states to manage 
 * the input text, submission status, loading status, and theme settings.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered ToolScreen component.
 */
const ToolScreen: FC = () => {
    // Define state with types
    const [text, setText] = useState<string>(() => localStorage.getItem("prevText") || "");
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [width, setWidth] = useState<string>("90%");

    const {voice, 
        vocabLevel, 
        setVocabLevel, 
        fontTypeface, 
        setFontTypeface,
        setBackgroundColor,
        setSecondaryBackgroundColor,
        setAccentLightColor,
        setAccentDarkColor,
        setFontColor,
        fontSize,
        setFontSize
    } = useSettings();

    const handleTextChange = (newValue: string) => {
        setText(newValue);
    };

    useEffect(() => {
        localStorage.setItem("prevText", text);
    }, [text]);

    // Event handler for Vocab Level
    const handleVocabLevelChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setVocabLevel(event.target.value);
    };

    const handleFontStyleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setFontTypeface(event.target.value);
    }

    const [theme, setTheme] = useState(defaultTheme);

    const handleColorSelect = (color: string) => {
        // Update the theme based on the selected background color
        const wcagCompliantTextColor = computeWCAGCompliantTextColor(color);
        const { secondary, lightAccent, darkAccent } = computeSecondaryAndAccentColors(color);
        
        setBackgroundColor(color);
        setFontColor(wcagCompliantTextColor);
        setSecondaryBackgroundColor(secondary);
        setAccentLightColor(lightAccent);
        setAccentDarkColor(darkAccent);
        
        const newTheme = { 
            Background: color, 
            Text: wcagCompliantTextColor,
            Secondary: secondary,
            lightAccent: lightAccent,
            darkAccent: darkAccent
        };

        // Update CSS variables
        document.documentElement.style.setProperty("--textbox-background-color", newTheme.Background);
        document.documentElement.style.setProperty("--textbox-font-color", newTheme.Text);
        document.documentElement.style.setProperty("--secondary-background-color", newTheme.Secondary);
        document.documentElement.style.setProperty("--accent-light-color", newTheme.lightAccent);
        document.documentElement.style.setProperty("--accent-dark-color", newTheme.darkAccent);

        setTheme(newTheme);
    };

    return (
        <div id="tool-screen">
            <div className="flex-box">
                <div id="tool-input-container" style={{width: width}}>
                    <div id="tool-title-wrapper">
                        <div id="tool-title" className="center-text disable-selection">
                            <p>Source</p>
                        </div>
                        <Dropdown
                            options={vocabLevels.map((level) => level.level)}
                            value={vocabLevel}
                            onChange={handleVocabLevelChange}
                        />
                    </div>
                    <div id="tool-textbox-container">
                    <HighlightableTextBox
                        value={text}
                        onChange={handleTextChange}
                        placeholder="Type here and highlight text to see options"
                    />
                    </div>
                    <div id="tool-display-settings">
                        <ColorPicker 
                            label="" 
                            colors={defaultColors} 
                            selectedColor={theme.Background} 
                            onColorSelect={(color) => { handleColorSelect(color); }} 
                        />
                        <Dropdown
                            options={fontTypefaces}
                            value={fontTypeface}
                            onChange={handleFontStyleChange}
                        />
                        <Dropdown
                            options={["12pt", "14pt", "16pt", "18pt", "20pt", "22pt", "24pt"]}
                            value={fontSize}
                            onChange={(event) => setFontSize(event.target.value)}
                        />
                    </div>
                    <div id="ai-inaccurate-message">
                        Note: The AI may not always provide accurate or appropriate responses. Please check all information for accuracy.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolScreen;

const normalizeHexColor = (hex: string): string => {
    // Remove invalid characters (keep only hex-compatible characters)
    const sanitized = hex.replace(/[^A-Fa-f0-9]/g, '');

    // Ensure the length is a multiple of 3 or 6 for valid RGB
    if (sanitized.length === 3 || sanitized.length === 6) {
        return `#${sanitized}`;
    }

    if (sanitized.length > 6) {
        // Truncate to the first 6 characters for valid RGB
        return `#${sanitized.slice(0, 6)}`;
    }

    if (sanitized.length < 6) {
        // Pad with zeros if it's too short
        return `#${sanitized.padEnd(6, '0')}`;
    }

    // Fallback (shouldn't reach here)
    return `#000000`;
};

const computeWCAGCompliantTextColor = (backgroundColor: string): string => {
    const hexToRgb = (hex: string) => {
        const bigint = parseInt(hex.slice(1), 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    };

    const luminance = (rgb: { r: number; g: number; b: number }) => {
        const channelLuminance = (channel: number) => {
            const sRGB = channel / 255;
            return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
        };
        return (
            0.2126 * channelLuminance(rgb.r) +
            0.7152 * channelLuminance(rgb.g) +
            0.0722 * channelLuminance(rgb.b)
        );
    };

    const contrastRatio = (lum1: number, lum2: number) => {
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
    };

    const normalizedBackground = normalizeHexColor(backgroundColor);
    const rgbBackground = hexToRgb(normalizedBackground);
    const luminanceBackground = luminance(rgbBackground);

    // Calculate contrast with both black and white text
    const blackLuminance = 0;
    const contrastWithBlack = contrastRatio(luminanceBackground, blackLuminance);

    // Return the text color that meets the 4.5:1 ratio
    return contrastWithBlack >= 4.5 ? "#000000" : "#FFFFFF";
};

const computeSecondaryAndAccentColors = (
    backgroundColor: string
): { secondary: string; lightAccent: string; darkAccent: string } => {
    const hexToRgb = (hex: string) => {
        const bigint = parseInt(hex.slice(1), 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    };

    const rgbToHex = (r: number, g: number, b: number) =>
        `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;

    const adjustBrightness = (rgb: { r: number; g: number; b: number }, factor: number) => ({
        r: Math.min(255, Math.max(0, Math.round(rgb.r * factor))),
        g: Math.min(255, Math.max(0, Math.round(rgb.g * factor))),
        b: Math.min(255, Math.max(0, Math.round(rgb.b * factor))),
    });

    const normalizedBackground = normalizeHexColor(backgroundColor);
    const rgbBackground = hexToRgb(normalizedBackground);

    // Generate a slightly lighter secondary background
    const lighterSecondary = adjustBrightness(rgbBackground, 1.3);
    const secondary = rgbToHex(lighterSecondary.r, lighterSecondary.g, lighterSecondary.b);

    // Generate a light accent color
    const lightAccentRgb = adjustBrightness(rgbBackground, 1.5);
    const lightAccent = rgbToHex(lightAccentRgb.r, lightAccentRgb.g, lightAccentRgb.b);

    // Generate a dark accent color
    const darkAccentRgb = adjustBrightness(rgbBackground, 0.5);
    const darkAccent = rgbToHex(darkAccentRgb.r, darkAccentRgb.g, darkAccentRgb.b);

    return { secondary, lightAccent, darkAccent };
};