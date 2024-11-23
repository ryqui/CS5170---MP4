/**
 * Represents a vocabulary level with its corresponding instruction.
 */
export type VocabLevel = {
    /**
     * The name of the vocabulary level.
     */
    level: string;

    /**
     * The instruction associated with the vocabulary level.
     */
    instruction: string;
};

/**
 * An array of predefined vocabulary levels and their instructions.
 */
export const vocabLevels: VocabLevel[] = [
    { level: "Default", instruction: "Use the same level of language as the input text." },
    { level: "ELI5", instruction: "Use the same level of language as eli5." },
    { level: "Simple", instruction: "Use simple and easy-to-understand language." },
    { level: "Intermediate", instruction: "Use moderately complex language for intermediate readers." },
    { level: "Advanced", instruction: "Use advanced language with technical details where appropriate." },
];

/**
 * Helper function to get the instruction for a given vocabulary level.
 * 
 * @param level - The name of the vocabulary level.
 * @returns The instruction associated with the specified vocabulary level, or a default message if the level is not found.
 */
export const getInstructionForLevel = (level: string): string => {
    const vocabLevel = vocabLevels.find((v) => v.level === level);
    return vocabLevel?.instruction || "No instruction available for this level.";
};