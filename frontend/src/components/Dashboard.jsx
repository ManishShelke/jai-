import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AnalysisResults from './AnalysisResults';

const API_URL = 'http://localhost:5000/api';

const jobRoles = [
  'Software Engineer',
  'Data Scientist',
  'Product Manager',
  'UI/UX Designer',
  'Marketing Manager',
  'Business Analyst'
];

const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'E-commerce',
  'Education',
  'Consulting'
];

function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please upload a resume');
      return;
    }

    if (!jobRole || !industry) {
      setError('Please select job role and industry');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('jobRole', jobRole);
      formData.append('industry', industry);

      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setJobRole('');
    setIndustry('');
    setResults(null);
    setError('');
  };

  return (
    <div className="min-h-screen p-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-white rounded-[2rem] p-8 mb-8 flex justify-between items-center animate-slideUp shadow-xl">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-500 font-medium mt-1">Hello, {user.name} 👋</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-red-500/10 text-red-600 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20"
          >
            Sign Out
          </button>
        </div>

        {!results ? (
          <div className="glass-white rounded-[2.5rem] p-12 animate-slideUp shadow-2xl border border-white/50">
            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3 text-lg">
                Upload Resume
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  {selectedFile ? (
                    <div className="flex items-center justify-center space-x-3">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-700">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedFile(null);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600 font-medium mb-1">
                        Drop your resume here or click to browse
                      </p>
                      <p className="text-sm text-gray-500">PDF or DOCX (Max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Job Role Dropdown */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3 text-lg">
                Job Role
              </label>
              <select
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="input-glass"
              >
                <option value="">Select a job role</option>
                {jobRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Industry Dropdown */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3 text-lg">
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="input-glass"
              >
                <option value="">Select an industry</option>
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !selectedFile || !jobRole || !industry}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Resume...
                </span>
              ) : (
                'Analyze Resume'
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <AnalysisResults results={results} />
            <div className="text-center">
              <button
                onClick={handleReset}
                className="btn-secondary"
              >
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
