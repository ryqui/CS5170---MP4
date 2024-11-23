import './TextBox.css';
import React, {FC, ChangeEvent} from 'react';

/**
 * Props for the TextBox component.
 * 
 * @interface TextBoxProps
 * 
 * @property {string} value - The current value of the text box.
 * @property {(event: ChangeEvent<HTMLTextAreaElement>) => void} onChange - Callback function to handle changes to the text box value.
 * @property {string} [placeholder] - Optional placeholder text to display when the text box is empty.
 * @property {number} [rows] - Optional number of rows to display in the text box.
 * @property {boolean} [readonly] - Optional flag to make the text box read-only.
 */
interface TextBoxProps {
    value: string;
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    readonly?: boolean;
}

const TextBox: FC<TextBoxProps> = ({value, onChange, placeholder = 'Enter text here...', rows = 5, readonly = false}) => {
    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="custom-textbox"
            readOnly={readonly}
        />
    );
};

export default TextBox;
