import React, { useState } from 'react';

function App() {
  const [resumeText, setResumeText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleParse = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse resume');
      }

      const data = await response.json();
      setParsedData(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '700px', margin: 'auto', padding: '2rem' }}>
      <h1>🧠 Intelligent Resume Parser</h1>

      <textarea
        rows="15"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        placeholder="Paste your resume text here..."
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
      />

      <button onClick={handleParse} disabled={loading || !resumeText.trim()} style={{ marginTop: '10px' }}>
        {loading ? 'Parsing...' : 'Parse Resume'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {parsedData && (
        <div style={{ marginTop: '20px' }}>
          <h2>Parsed Information:</h2>
          <pre style={{ backgroundColor: '#f4f4f4', padding: '10px' }}>
            {JSON.stringify(parsedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
