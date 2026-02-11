import React from 'react';

function AnalysisResults({ results }) {
  const { atsScore, matchedKeywords, missingKeywords, sectionStatus, aiAnalysis } = results;

  // Calculate circle circumference for progress circle
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (atsScore / 100) * circumference;

  // Determine score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className="space-y-8 animate-slideUp">
      {/* ATS Score Card */}
      <div className="glass-white rounded-[2.5rem] p-10 shadow-2xl border border-white/60 stagger-item" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-3xl font-black text-gray-800 mb-8 tracking-tight">ATS Analysis</h2>
        <div className="flex flex-col md:flex-row items-center justify-around gap-12">
          {/* Circular Progress */}
          <div className="relative w-56 h-56 mb-6 md:mb-0">
            <svg className="transform -rotate-90 w-56 h-56">
              <circle
                cx="112"
                cy="112"
                r={radius}
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                className="text-gray-100"
              />
              <circle
                cx="112"
                cy="112"
                r={radius}
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={progress}
                className={`${getScoreColor(atsScore)} transition-all duration-1000 ease-out`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className={`text-6xl font-black ${getScoreColor(atsScore)}`}>
                {atsScore}
              </span>
              <span className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-1">Score</span>
            </div>
          </div>

          {/* Score Breakdown */}
          {results.breakdown && (
            <div className="space-y-6 flex-1 max-w-md">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-gray-600 font-bold text-sm uppercase">Keyword Match</span>
                  <span className="font-black text-blue-600">{results.breakdown.keywordScore}/40</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 border border-white">
                  <div 
                    className={`bg-gradient-to-r ${getScoreGradient(results.breakdown.keywordScore * 2.5)} h-3 rounded-full transition-all duration-1000 delay-300 shadow-sm`}
                    style={{ width: `${(results.breakdown.keywordScore / 40) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-gray-600 font-bold text-sm uppercase">Section Presence</span>
                  <span className="font-black text-blue-600">{results.breakdown.sectionScore}/25</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 border border-white">
                  <div 
                    className={`bg-gradient-to-r ${getScoreGradient(results.breakdown.sectionScore * 4)} h-3 rounded-full transition-all duration-1000 delay-500 shadow-sm`}
                    style={{ width: `${(results.breakdown.sectionScore / 25) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-gray-600 font-bold text-sm uppercase">Skill Relevance</span>
                  <span className="font-black text-blue-600">{results.breakdown.skillScore}/20</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 border border-white">
                  <div 
                    className={`bg-gradient-to-r ${getScoreGradient(results.breakdown.skillScore * 5)} h-3 rounded-full transition-all duration-1000 delay-700 shadow-sm`}
                    style={{ width: `${(results.breakdown.skillScore / 20) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-gray-600 font-bold text-sm uppercase">Formatting</span>
                  <span className="font-black text-blue-600">{results.breakdown.formattingScore}/15</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 border border-white">
                  <div 
                    className={`bg-gradient-to-r ${getScoreGradient(results.breakdown.formattingScore * 6.67)} h-3 rounded-full transition-all duration-1000 delay-1000 shadow-sm`}
                    style={{ width: `${(results.breakdown.formattingScore / 15) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Keywords & Sections */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Matched Keywords */}
        <div className="glass-white rounded-[2rem] p-8 shadow-xl border border-white/50 stagger-item" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center mr-3">
              <span className="text-green-600 text-lg">✓</span>
            </div>
            Matched Skills
          </h3>
          <div className="flex flex-wrap gap-3">
            {matchedKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-br from-green-50 to-green-100 text-green-700 rounded-xl text-xs font-bold uppercase tracking-wider border border-green-200 shadow-sm hover:scale-105 transition-transform cursor-default"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="glass-white rounded-[2rem] p-8 shadow-xl border border-white/50 stagger-item" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center mr-3">
              <span className="text-red-600 text-lg">✗</span>
            </div>
            Gaps Identified
          </h3>
          <div className="flex flex-wrap gap-3">
            {missingKeywords.length > 0 ? (
              missingKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-br from-red-50 to-red-100 text-red-700 rounded-xl text-xs font-bold uppercase tracking-wider border border-red-200 shadow-sm hover:scale-105 transition-transform cursor-default"
                >
                  {keyword}
                </span>
              ))
            ) : (
              <p className="text-gray-400 italic">All critical skills are excellently covered.</p>
            )}
          </div>
        </div>
      </div>

      {/* Section Status */}
      <div className="glass-white rounded-[2rem] p-8 shadow-xl border border-white/50 stagger-item" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-widest text-sm">Structure Checklist</h3>
        <div className="grid md:grid-cols-4 gap-6">
          {Object.entries(sectionStatus).map(([section, present]) => (
            <div key={section} className="flex flex-col items-center p-4 rounded-2xl bg-gray-50/50 border border-gray-100 shadow-sm">
              {present ? (
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mb-3 text-red-600 font-bold">!</div>
              )}
              <span className={`text-xs font-black uppercase tracking-tighter text-center ${present ? 'text-gray-800' : 'text-red-600'}`}>
                {section}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Analysis */}
      {aiAnalysis && (
        <div className="space-y-8 stagger-item" style={{ animationDelay: '0.5s' }}>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Strengths */}
            <div className="glass rounded-[2rem] p-8 border-t-4 border-green-500 shadow-2xl">
              <h3 className="text-xl font-black text-white mb-6 flex items-center">
                <span className="mr-3">🦾</span> Strengths
              </h3>
              <ul className="space-y-4">
                {aiAnalysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start bg-white/5 p-4 rounded-xl border border-white/10 text-blue-50">
                    <span className="text-green-400 mr-3 mt-1 text-lg">✦</span>
                    <span className="text-sm font-medium leading-relaxed">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="glass rounded-[2rem] p-8 border-t-4 border-amber-500 shadow-2xl">
              <h3 className="text-xl font-black text-white mb-6 flex items-center">
                <span className="mr-3">⚡</span> Focal Points
              </h3>
              <ul className="space-y-4">
                {aiAnalysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start bg-white/5 p-4 rounded-xl border border-white/10 text-blue-50">
                    <span className="text-amber-400 mr-3 mt-1 text-lg">✦</span>
                    <span className="text-sm font-medium leading-relaxed">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Overall Optimization */}
          <div className="glass-white rounded-[2.5rem] p-10 shadow-2xl border border-white/60">
            <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center">
              <span className="mr-3 text-blue-600">🎯</span> Gemini Insights
            </h3>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-100">
              <p className="text-gray-700 leading-relaxed font-medium text-lg italic">"{aiAnalysis.optimization}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalysisResults;
