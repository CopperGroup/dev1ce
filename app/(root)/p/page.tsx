"use client"
import { parseComponentCode } from "@/lib/test";
import { useState } from "react";

export default function JSXParserPage() {
  const [jsxInput, setJsxInput] = useState("<div className='container'><h1>Hello</h1></div>");
  const [parsedOutput, setParsedOutput] = useState(null);

  const handleParse = () => {
    try {
      const parsedResult = parseComponentCode(jsxInput);

      if (parsedResult) {
          console.log("--- Function Body ---");
          console.log(parsedResult.functionBody);
          console.log("\n--- JSX Object ---");
          // console.log(JSON.stringify(parsedResult.jsxObject, null, 2));
      } else {
          console.log("Failed to parse component code.");
      }

      setParsedOutput(parsedResult.jsxObject);
    } catch (error) {
      setParsedOutput({ error: "Invalid JSX syntax" });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">JSX Parser</h1>
      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={5}
        value={jsxInput}
        onChange={(e) => setJsxInput(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleParse}
      >
        Parse JSX
      </button>
      <pre className="mt-4 p-2 bg-gray-100 rounded overflow-auto text-sm">
        {JSON.stringify(parsedOutput, null, 2)}
      </pre>
    </div>
  );
}
