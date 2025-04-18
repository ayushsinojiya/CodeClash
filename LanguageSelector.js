import React from 'react';
import "./LanguageSelector.css"

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

export default LanguageSelector;
