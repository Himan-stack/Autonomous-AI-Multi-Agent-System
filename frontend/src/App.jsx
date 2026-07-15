import { useState } from "react";
import "./App.css";


function App() {
  const [request, setRequest] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const generateDocument = async () => {

    if (!request.trim()) {
        alert("Please enter a request.");
        return;
    }

    setLoading(true);

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/agent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    request: request,
                }),
            }
        );

        const data = await response.json();

        setResult(data);

    } catch (error) {

        console.error(error);

        alert("Failed to connect to backend.");

    } finally {

        setLoading(false);

    }

};
  return (
    <div className="container">

      <div className="card">

        <h1>🤖 Autonomous AI Agent</h1>

        <p className="subtitle">
          Generate professional business documents using an Autonomous AI Workflow.
        </p>

        <label>
          Enter your request
        </label>

        <textarea
    value={request}
    onChange={(e) => setRequest(e.target.value)}
    placeholder={`Example:
Create a business proposal for launching an AI Healthcare Startup...`}
></textarea>
    
       <button
    onClick={generateDocument}
    disabled={loading}
>
    {loading
        ? "Generating..."
        : "Generate Document"}
    </button>
    {
    result && (
        <pre>
            {JSON.stringify(result, null, 2)}
        </pre>
    )
}

      </div>

    </div>
  );
}

export default App;