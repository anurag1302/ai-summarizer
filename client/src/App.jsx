import { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSummary("");

    try {
      const response = await axios.post(
        "http://localhost:9999/api/summarize/url",
        { url }
      );
      setSummary(response.data.summary);
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handlePdfSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) return;
    setLoading(true);
    setSummary("");

    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const response = await axios.post(
        "http://localhost:9999/api/summarize/pdf",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSummary(response.data.summary);
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🧠 AI Summarizer</h1>

      <form onSubmit={handleUrlSubmit} className="mb-6">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter article URL"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          Summarize URL
        </button>
      </form>

      <form onSubmit={handlePdfSubmit} className="mb-6">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          className="mb-2"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          Summarize PDF
        </button>
      </form>

      {loading && <p className="text-yellow-600">Summarizing...</p>}

      {summary && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="font-semibold mb-2">📝 Summary:</h2>
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
