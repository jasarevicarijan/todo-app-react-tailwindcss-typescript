import React from "react";

type TTextareaWithValidationProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isDescriptionValid: boolean;
  placeholder: string;
  minCharacters: number;
  maxCharacters: number;
};

const TextareaWithValidation = ({
  value,
  onChange,
  onBlur,
  onKeyDown,
  isDescriptionValid,
  placeholder,
  minCharacters,
  maxCharacters,
}: TTextareaWithValidationProps) => {
  return (
    <>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className={`px-3 py-2 border border-gray-300 rounded-md mb-4 resize-none ${
          !isDescriptionValid && "border-red-500"
        }`}
        rows={4}
      ></textarea>
      {!isDescriptionValid && (
        <p className="text-red-500 mb-2">
          Description must be between {minCharacters} and {maxCharacters}{" "}
          characters.
        </p>
      )}
    </>
  );
};

export default TextareaWithValidation;
