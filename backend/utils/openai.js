const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get AI-powered resume analysis from Google Gemini
 * @param {string} resumeText - Extracted resume text
 * @param {string} jobRole - Target job role
 * @param {string} industry - Target industry
 * @param {Object} atsResults - ATS scoring results
 * @returns {Promise<Object>} AI analysis in structured format
 */
const analyzeFeedback = async (resumeText, jobRole, industry, atsResults) => {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an advanced ATS Resume Analyzer and Career Intelligence Engine.
Analyze the provided resume text for a ${jobRole} position in the ${industry} industry.

INPUT DATA:
- RESUME TEXT: ${resumeText.substring(0, 4000)}
- ATS KEYWORD DATA: Matched: ${atsResults.matchedKeywords.join(', ')}, Missing: ${atsResults.missingKeywords.join(', ')}

YOUR TASK:
Generate a structured evaluation across EXACTLY 10 sections:
1. Contact Information Quality
2. Professional Summary Strength
3. Skills Relevance & Depth
4. Work Experience Impact
5. Projects Evaluation
6. Education & Certifications
7. ATS Keyword Match
8. Formatting & Structure Safety
9. Grammar & Readability
10. Overall Personal Branding

For each section, provide:
- Score (0-10)
- Detailed Analysis
- Specific Strengths (list)
- Specific Weaknesses (list)
- Actionable Improvement Suggestions with examples (list)

Finally, provide:
- Overall ATS Score (0-100)
- Top 3 Priority Improvements
- Short professional summary (2-3 sentences)

IMPORTANT: Provide your response in valid JSON format ONLY, with no additional text.
Structure your JSON exactly like this:
{
  "sections": [
    {
      "name": "Contact Information Quality",
      "score": 8,
      "analysis": "...",
      "strengths": ["...", "..."],
      "weaknesses": ["...", "..."],
      "suggestions": ["...", "..."]
    },
    ... (total 10 sections)
  ],
  "overallScore": 85,
  "topImprovements": ["...", "...", "..."],
  "summary": "..."
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    let jsonText = text.trim();
    if (jsonText.includes('```')) {
      jsonText = jsonText.match(/\{[\s\S]*\}/)?.[0] || jsonText;
    }

    const analysis = JSON.parse(jsonText);

    // Basic validation
    if (!analysis.sections || !Array.isArray(analysis.sections)) {
      throw new Error('Invalid response structure from Gemini');
    }

    return analysis;

  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Provide fallback analysis if Gemini fails
    return {
      sections: Array.from({ length: 10 }).map((_, i) => ({
        name: [
          "Contact Information Quality", "Professional Summary Strength", "Skills Relevance & Depth",
          "Work Experience Impact", "Projects Evaluation", "Education & Certifications",
          "ATS Keyword Match", "Formatting & Structure Safety", "Grammar & Readability", "Overall Personal Branding"
        ][i],
        score: 7,
        analysis: "Generic analysis provided as a fallback due to API timeout or error.",
        strengths: ["Relevant content detected"],
        weaknesses: ["Keyword optimization could be improved"],
        suggestions: ["Consider adding more measurable achievements"]
      })),
      overallScore: 70,
      topImprovements: [
        "Optimize keywords for target role",
        "Add measurable accomplishments",
        "Enhance professional summary"
      ],
      summary: "Your resume shows a strong foundation but requires target-specific optimization to excel in ATS screening."
    };
  }
};


/**
 * Update resume data based on user message using Google Gemini
 * @param {Object} currentData - Current resume data
 * @param {string} userMessage - User's request
 * @param {Array} history - Chat history
 * @returns {Promise<Object>} Updated resume data and AI response
 */
const buildResume = async (currentData, userMessage, history) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an AI Resume Assistant. Your goal is to help the user build a professional resume through a chat interface.
    
    Current Resume Data:
    ${JSON.stringify(currentData, null, 2)}
    
    Recent Chat History:
    ${JSON.stringify(history, null, 2)}
    
    User Message: "${userMessage}"
    
    INSTRUCTIONS:
    1. Analyze the user's message to update the resume data.
    2. If the user provides personal info, experience, education, or skills, update the corresponding fields in the JSON.
    3. If the user is asking for advice, provide it and keep the JSON as is or with minor improvements.
    4. Provide your response as a valid JSON object with this exact structure:
    {
      "resumeData": { ... updated resume data ... },
      "chatResponse": "A helpful response to the user about what was updated or answering their question"
    }
    
    Resume Data Structure:
    {
      "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "summary": "" },
      "experience": [{ "company": "", "position": "", "duration": "", "description": "" }],
      "education": [{ "school": "", "degree": "", "year": "" }],
      "skills": ["SKILL1", "SKILL2"]
    }
    
    Respond ONLY with the JSON object.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const output = JSON.parse(jsonText);
    return output;

  } catch (error) {
    console.error('Gemini Build API error:', error);
    return {
      resumeData: currentData,
      chatResponse: "I'm sorry, I encountered an error while processing your request. Please try again."
    };
  }
};

module.exports = { analyzeFeedback, buildResume };
