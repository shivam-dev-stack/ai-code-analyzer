import React, { useState, useEffect } from 'react';
import { Code, Bug, History, Trash2, Copy, Check, Loader } from 'lucide-react';

export default function CodeAssistant() {
  const [code, setCode] = useState('');
  const [issue, setIssue] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [copied, setCopied] = useState(false);

  const API_URL = 'http://localhost:5000/api';

  const languages = ['javascript', 'python', 'java', 'cpp', 'csharp', 'go', 'rust', 'typescript', 'php', 'ruby'];


  const handleDebug = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    setResponse('');
    
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, issue, language })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setResponse(data.analysis);
        
      } else {
        setResponse(`Error: ${data.error}`);
      }
    } catch (err) {
      setResponse(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Code Reviewer
          </h1>
          <p className="text-gray-400">Find bugs, improve code, and write better software instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Language Selector */}
            <div className="bg-slate-800/50 backdrop-blur p-4 rounded-lg">
              <label className="block text-sm font-medium mb-2">Programming Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Input Section */}
            
              <div className="space-y-4">
                <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg">
                  <label className="block text-sm font-medium mb-2">Your Code</label>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste your code here..."
                    className="w-full h-48 bg-slate-700 border border-slate-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
                  />
                </div>
                <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg">
                  <label className="block text-sm font-medium mb-2">Describe the issue (optional)</label>
                  <textarea
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder="E.g., The function throws an error when input is null..."
                    className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                  <button
                    onClick={handleDebug}
                    disabled={loading || !code.trim()}
                    className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Bug size={20} />
                        Analyze Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            
            {/* Response Section */}
            {response && (
              <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Result</h3>
                  <button
                    onClick={() => copyToClipboard(response)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm">
                  <code className="text-gray-300">{response}</code>
                </pre>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}