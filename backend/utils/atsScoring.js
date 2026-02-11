/**
 * Deterministic ATS scoring algorithm
 * Scoring weights:
 * - 40% Keyword match
 * - 25% Section presence
 * - 20% Skill relevance
 * - 15% Formatting/length
 */

// Role-specific keywords database
const roleKeywords = {
  'Software Engineer': [
    'javascript', 'python', 'java', 'react', 'node.js', 'git', 'api', 'database',
    'algorithms', 'data structures', 'software development', 'agile', 'testing',
    'debugging', 'version control', 'ci/cd', 'sql', 'aws', 'docker'
  ],
  'Data Scientist': [
    'python', 'machine learning', 'statistics', 'data analysis', 'sql', 'tensorflow',
    'deep learning', 'pandas', 'numpy', 'visualization', 'r', 'scikit-learn',
    'neural networks', 'modeling', 'big data', 'hadoop', 'spark', 'jupyter'
  ],
  'Product Manager': [
    'product strategy', 'roadmap', 'stakeholder', 'requirements', 'user stories',
    'agile', 'scrum', 'analytics', 'metrics', 'a/b testing', 'user research',
    'prioritization', 'cross-functional', 'leadership', 'market analysis'
  ],
  'UI/UX Designer': [
    'figma', 'sketch', 'adobe xd', 'wireframes', 'prototypes', 'user research',
    'user testing', 'personas', 'user flow', 'design systems', 'accessibility',
    'responsive design', 'visual design', 'interaction design', 'usability'
  ],
  'Marketing Manager': [
    'digital marketing', 'seo', 'sem', 'content marketing', 'social media',
    'analytics', 'campaign management', 'brand strategy', 'email marketing',
    'google analytics', 'roi', 'market research', 'lead generation', 'crm'
  ],
  'Business Analyst': [
    'requirements gathering', 'stakeholder management', 'process improvement',
    'data analysis', 'sql', 'business intelligence', 'documentation', 'modeling',
    'kpi', 'reporting', 'tableau', 'power bi', 'jira', 'agile', 'uml'
  ]
};

// Industry-specific keywords
const industryKeywords = {
  'Technology': ['innovation', 'scalability', 'cloud', 'automation', 'digital transformation'],
  'Finance': ['compliance', 'risk management', 'financial analysis', 'regulations', 'audit'],
  'Healthcare': ['hipaa', 'patient care', 'clinical', 'medical', 'healthcare'],
  'E-commerce': ['conversion', 'customer acquisition', 'marketplace', 'fulfillment', 'inventory'],
  'Education': ['curriculum', 'learning', 'education', 'training', 'instruction'],
  'Consulting': ['client management', 'consulting', 'advisory', 'strategy', 'implementation']
};

// Required sections
const requiredSections = [
  { name: 'Contact Information', patterns: ['email', 'phone', 'linkedin', 'github'] },
  { name: 'Experience', patterns: ['experience', 'work history', 'employment', 'professional background'] },
  { name: 'Education', patterns: ['education', 'degree', 'university', 'college', 'bachelor', 'master'] },
  { name: 'Skills', patterns: ['skills', 'technical skills', 'competencies', 'proficiencies'] }
];

/**
 * Calculate ATS score for a resume
 * @param {string} resumeText - Extracted resume text
 * @param {string} jobRole - Target job role
 * @param {string} industry - Target industry
 * @returns {Object} ATS scoring results
 */
const calculateATSScore = (resumeText, jobRole, industry) => {
  const textLower = resumeText.toLowerCase();
  
  // 1. Keyword Match (40%)
  const roleKeys = roleKeywords[jobRole] || [];
  const industryKeys = industryKeywords[industry] || [];
  const allKeywords = [...roleKeys, ...industryKeys];
  
  const matchedKeywords = allKeywords.filter(keyword => 
    textLower.includes(keyword.toLowerCase())
  );
  
  const missingKeywords = allKeywords.filter(keyword => 
    !textLower.includes(keyword.toLowerCase())
  ).slice(0, 10); // Limit to top 10 missing keywords
  
  const keywordScore = allKeywords.length > 0 
    ? (matchedKeywords.length / allKeywords.length) * 40 
    : 20; // Default if no keywords

  // 2. Section Presence (25%)
  const sectionStatus = {};
  let foundSections = 0;
  
  requiredSections.forEach(section => {
    const hasSection = section.patterns.some(pattern => 
      textLower.includes(pattern.toLowerCase())
    );
    sectionStatus[section.name] = hasSection;
    if (hasSection) foundSections++;
  });
  
  const sectionScore = (foundSections / requiredSections.length) * 25;

  // 3. Skill Relevance (20%)
  // Check for specific technical skills mention
  const skillDensity = (matchedKeywords.filter(kw => 
    roleKeys.includes(kw)
  ).length / Math.max(roleKeys.length, 1)) * 20;

  // 4. Formatting & Length (15%)
  const wordCount = textLower.split(/\s+/).length;
  let formattingScore = 0;
  
  if (wordCount >= 300 && wordCount <= 1000) {
    formattingScore = 15; // Optimal length
  } else if (wordCount > 200 && wordCount < 1500) {
    formattingScore = 10; // Acceptable length
  } else {
    formattingScore = 5; // Too short or too long
  }

  // Calculate total score
  const atsScore = Math.round(keywordScore + sectionScore + skillDensity + formattingScore);

  return {
    atsScore: Math.min(atsScore, 100), // Cap at 100
    matchedKeywords: matchedKeywords.slice(0, 15), // Limit to top 15
    missingKeywords: missingKeywords,
    sectionStatus: sectionStatus,
    breakdown: {
      keywordScore: Math.round(keywordScore),
      sectionScore: Math.round(sectionScore),
      skillScore: Math.round(skillDensity),
      formattingScore: Math.round(formattingScore)
    }
  };
};

module.exports = { calculateATSScore };
