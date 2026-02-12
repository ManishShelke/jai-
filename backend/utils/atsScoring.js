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
  'Software Engineer': ['javascript', 'python', 'java', 'react', 'node.js', 'git', 'api', 'database', 'algorithms', 'data structures', 'software development', 'agile', 'testing', 'debugging', 'version control', 'ci/cd', 'sql', 'aws', 'docker'],
  'Frontend Developer': ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'ui development', 'web standards', 'typescript', 'responsive design', 'sass', 'webpack', 'babel'],
  'Backend Developer': ['python', 'java', 'node.js', 'api development', 'microservices', 'sql', 'nosql', 'scalability', 'express', 'django', 'spring boot', 'go', 'ruby on rails'],
  'Full Stack Developer': ['react', 'node.js', 'mongodb', 'express', 'typescript', 'rest api', 'graphql', 'aws', 'testing', 'redux', 'full stack', 'javascript', 'sql'],
  'DevOps Engineer': ['kubernetes', 'terraform', 'ansible', 'jenkins', 'ci/cd', 'iac', 'cloud architecture', 'docker', 'aws', 'gcp', 'azure', 'monitoring', 'linux'],
  'Mobile App Developer': ['react native', 'flutter', 'swift', 'ios', 'android', 'kotlin', 'mobile design', 'mobile app', 'xcode', 'android studio', 'native'],
  'Data Scientist': ['python', 'machine learning', 'statistics', 'data analysis', 'sql', 'tensorflow', 'deep learning', 'pandas', 'numpy', 'visualization', 'r', 'scikit-learn', 'neural networks', 'modeling', 'big data', 'hadoop', 'spark', 'jupyter'],
  'Data Engineer': ['etl', 'data pipeline', 'spark', 'airflow', 'warehousing', 'sql', 'python', 'data modeling', 'hadoop', 'kafka', 'big data', 'nosql'],
  'AI/ML Engineer': ['pytorch', 'tensorflow', 'deep learning', 'nlp', 'computer vision', 'scikit-learn', 'neural networks', 'machine learning', 'ai', 'python', 'reinforcement learning'],
  'Cybersecurity Analyst': ['firewalls', 'siem', 'penetration testing', 'encryption', 'incident response', 'cissp', 'vulnerability assessment', 'cybersecurity', 'network security', 'soc', 'threat intelligence'],
  'Cloud Architect': ['aws', 'azure', 'gcp', 'cloud formation', 'serverless', 'microservices', 'networking', 'cloud architecture', 'infrastructure', 'security'],
  'QA Engineer': ['selenium', 'automation', 'testing', 'bugs', 'qa automation', 'jest', 'performance testing', 'cypress', 'regression testing', 'unit testing'],
  'Product Manager': ['product strategy', 'roadmap', 'stakeholder', 'requirements', 'user stories', 'agile', 'scrum', 'analytics', 'metrics', 'a/b testing', 'user research', 'prioritization', 'cross-functional', 'leadership', 'market analysis'],
  'Project Manager': ['pmp', 'scrum', 'risk management', 'stakeholder', 'budgeting', 'roadmap', 'agile', 'project planning', 'leadership', 'kanban', 'ms project'],
  'Product Designer': ['product design', 'visual design', 'prototyping', 'user research', 'figma', 'sketch', 'adobe creative suite', 'user centered design', 'design thinking'],
  'UI/UX Designer': ['figma', 'sketch', 'adobe xd', 'wireframes', 'prototypes', 'user research', 'user testing', 'personas', 'user flow', 'design systems', 'accessibility', 'responsive design', 'visual design', 'interaction design', 'usability'],
  'Business Analyst': ['requirements gathering', 'stakeholder management', 'process improvement', 'data analysis', 'sql', 'business intelligence', 'documentation', 'modeling', 'kpi', 'reporting', 'tableau', 'power bi', 'jira', 'agile', 'uml'],
  'Financial Analyst': ['financial modeling', 'excel', 'forecasting', 'valuation', 'budgeting', 'investment', 'market trends', 'cfa', 'accounting', 'financial analysis', 'reporting'],
  'Marketing Manager': ['digital marketing', 'seo', 'sem', 'content marketing', 'social media', 'analytics', 'campaign management', 'brand strategy', 'email marketing', 'google analytics', 'roi', 'market research', 'lead generation', 'crm'],
  'Sales Executive': ['crm', 'lead generation', 'negotiation', 'sales funnel', 'closing', 'b2b', 'prospecting', 'sales strategy', 'account management', 'pipeline management'],
  'Customer Success Manager': ['retention', 'churn', 'customer relationship', 'saas', 'onboarding', 'client satisfaction', 'customer experience', 'relationship management', 'renewal'],
  'HR Manager': ['recruitment', 'onboarding', 'employee relations', 'payroll', 'talent acquisition', 'hcm', 'compliance', 'hr strategy', 'performance management', 'benefits'],
  'Operations Manager': ['process improvement', 'supply chain', 'vendor management', 'efficiency', 'resource allocation', 'logistics', 'operations strategy', 'project management'],
  'Content Writer': ['copywriting', 'seo', 'blogging', 'editing', 'content strategy', 'social media', 'storytelling', 'content creation', 'journalism', 'proofreading'],
  'Legal Consultant': ['litigation', 'compliance', 'legal research', 'contracts', 'paralegal', 'legal analysis', 'corporate law', 'intellectual property', 'dispute resolution'],
  'System Administrator': ['linux', 'windows server', 'networking', 'active directory', 'security', 'troubleshooting', 'virtualization', 'scripts', 'bash', 'powershell', 'backup'],
  'Technical Recruiter': ['sourcing', 'hiring', 'technical interviewing', 'ats', 'job posting', 'candidate experience', 'talent acquisition', 'it recruitment', 'networking'],
  'Graphic Designer': ['photoshop', 'illustrator', 'indesign', 'branding', 'typography', 'visual communication', 'portfolio', 'creative direction', 'vector art', 'layout'],
  'Data Analyst': ['data cleaning', 'visualization', 'sql', 'excel', 'python', 'tableau', 'power bi', 'reporting', 'insight generation', 'statistics'],
  'Accountant': ['accounting', 'auditing', 'tax preparation', 'financial reporting', 'quickbooks', 'ledger', 'balance sheet', 'gaap', 'reconciliation'],
  'Digital Marketing Specialist': ['google ads', 'social media ads', 'content marketing', 'ppc', 'analytics', 'seo', 'sem', 'conversion rate optimization']
};

// Industry-specific keywords
const industryKeywords = {
  'Technology': ['innovation', 'scalability', 'cloud', 'automation', 'digital transformation', 'software', 'tech stack'],
  'Finance': ['compliance', 'risk management', 'financial analysis', 'regulations', 'audit', 'banking', 'investment'],
  'Healthcare': ['hipaa', 'patient care', 'clinical', 'medical', 'healthcare', 'hospit_al', 'patient records'],
  'Education': ['curriculum', 'learning', 'education', 'training', 'instruction', 'academic', 'teaching'],
  'Retail': ['merchandising', 'inventory', 'customer experience', 'point of sale', 'retail', 'sales', 'store management'],
  'E-commerce': ['conversion', 'customer acquisition', 'marketplace', 'fulfillment', 'inventory', 'online sales', 'saas'],
  'Real Estate': ['property management', 'leasing', 'market analysis', 'sales', 'real estate', 'brokerage', 'investment'],
  'Manufacturing': ['supply chain', 'lean', 'six sigma', 'production', 'quality control', 'automation', 'logistics'],
  'Automotive': ['engineering', 'automotive', 'manufacturing', 'automotive technology', 'design', 'vehicles', 'automotive industry'],
  'Energy & Utilities': ['solar', 'wind', 'sustainability', 'energy efficiency', 'environmental', 'renewables', 'utilities'],
  'Media & Entertainment': ['content production', 'broadcasting', 'creative', 'media', 'digital content', 'entertainment', 'film'],
  'Hospitality & Tourism': ['customer service', 'event planning', 'hotel', 'tourism', 'guest relations', 'hospitality', 'travel'],
  'Logistics & Supply Chain': ['inventory', 'procurement', 'warehousing', 'distribution', 'supply chain', 'logistics', 'shipping'],
  'Non-profit': ['fundraising', 'grant writing', 'community', 'advocacy', 'volunteer', 'philanthropy', 'non-profit'],
  'Government': ['public policy', 'administration', 'compliance', 'regulations', 'governance', 'public service'],
  'Legal Services': ['litigation', 'compliance', 'legal research', 'contracts', 'paralegal', 'legal analysis', 'law'],
  'Construction': ['project management', 'safety', 'civil engineering', 'blueprints', 'construction', 'contracting', 'infrastructure'],
  'Agriculture': ['farming', 'agribusiness', 'sustainability', 'crop science', 'agronomy', 'livestock', 'forestry'],
  'Aerospace': ['aerospace', 'defense', 'avionics', 'systems engineering', 'aerodynamics', 'satellites', 'navigation'],
  'Telecommunications': ['networking', 'satellite', 'fiber optics', 'protocols', 'telecom', '5g', 'wireless'],
  'Consulting': ['client management', 'consulting', 'advisory', 'strategy', 'implementation', 'problem solving', 'business analysis'],
  'Fashion & Apparel': ['design', 'trends', 'apparel', 'merchandising', 'fashion', 'retail', 'clothing'],
  'Pharmaceuticals': ['clinical trials', 'fda', 'biotechnology', 'pharma', 'research', 'drug development', 'medicine'],
  'Gaming': ['game development', 'unity', 'unreal engine', 'multiplayer', 'esports', 'interactive media', 'game design'],
  'Venture Capital': ['investment', 'startup', 'portfolio', 'fundraising', 'due diligence', 'equity', 'funding'],
  'Insurance': ['underwriting', 'claims', 'actuarial', 'risk assessment', 'insurance', 'brokerage', 'policies'],
  'Mining': ['extraction', 'geology', 'safety', 'exploration', 'resources', 'minerals', 'engineering'],
  'Food & Beverage': ['culinary', 'food safety', 'restaurant', 'beverage', 'hospitality', 'catering', 'food service'],
  'Consumer Electronics': ['hardware', 'gadgets', 'design', 'consumer tech', 'engineering', 'electronics', 'iot']
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
