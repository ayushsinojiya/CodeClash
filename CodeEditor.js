import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Editor } from "@monaco-editor/react";
import { CODE_SNIPPETS } from "./Constants"; 
import Output from "./Output";

// Language versions for the dropdown
const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
  cpp: "14.0.0",
  c: "11.0.0",
};

// LanguageSelector component
const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ language, onSelect }) => {
  return (
    <div className="language-dropdown">
      <select value={language} onChange={(e) => onSelect(e.target.value)}>
        {languages.map(([lang, version]) => (
          <option key={lang} value={lang}>
            {lang} ({version})
          </option>
        ))}
      </select>
    </div>
  );
};

const CodeEditor = forwardRef(({ language, onLanguageChange }, ref) => {
  const editorRef = useRef();
  const [value, setValue] = useState(CODE_SNIPPETS[language] || ""); // Initialize with the selected language snippet

  useImperativeHandle(ref, () => ({
    getValue: () => {
      return editorRef.current ? value : ""; // Return current value or empty string if ref is not set
    },
  }));

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleLanguageChange = (language) => {
    setValue(CODE_SNIPPETS[language] || ""); // Update code snippet for the selected language
    onLanguageChange(language); // Notify the parent component of the language change
  };

  return (
    <div className="code-editor-container">
      {/* Right Column: Editor and Output */}
      <div className="right-column">
        <div className="row-editor">
          <div className="question"></div>

          {/* Code Editor */}
          <div className="code-editor">
            <div className="editor-header my-3">
              <LanguageSelector language={language} onSelect={handleLanguageChange} />
            </div>

            <Editor
              options={{ minimap: { enabled: false } }}
              height="350px"
              theme="vs-dark"
              language={language}
              value={value} // Controlled value
              onMount={onMount}
              onChange={(newValue) => setValue(newValue)} // Update state on change
            />
          </div>
        </div>

        {/* Output Section */}
        <Output editorRef={editorRef} language={language} />
      </div>
    </div>
  );
});

export default CodeEditor;
