import { useState, useEffect } from "react";
import { executeCode } from "./api";
import { PlayIcon } from "lucide-react"; // Icons used

const Output = ({ editorRef, language, expectedOutput }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null); // New state to hold comparison result

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      setIsError(!!result.stderr);
      
      // Compare the output with expected output
    } catch (error) {
      console.error(error);
      alert(`An error occurred: ${error.message || "Unable to run code"}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset comparison result when expectedOutput changes
    setComparisonResult(null);
  }, [expectedOutput]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="col-span-3 bg-card rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Code Execution</h2>
          <div className="flex items-center gap-2">
            <button
              className={`inline-flex items-center border border-gray-500 rounded px-4 py-2 text-sm font-medium transition 
                          ${isLoading ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
              onClick={runCode}
              disabled={isLoading}
            >
              {isLoading ? "Running..." : <><PlayIcon className="w-4 h-4 mr-2" /> Run Code</>}
            </button>
          </div>
        </div>

        {/* Output Display */}
        <div className={`bg-muted rounded-md p-4 ${isError ? "bg-red-200" : ""}`}>
          <pre className="font-mono text-sm">
            {output ? output.map((line, i) => <p key={i}>{line}</p>) : 'Click "Run Code" to see the output here'}
          </pre>
          {comparisonResult && <p className="font-bold mt-4">{comparisonResult}</p>} {/* Display comparison result */}
        </div>
      </div>
    </div>
  );
};

export default Output;
