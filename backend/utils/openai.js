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

    const prompt = `You are an expert resume analyst and career coach. Analyze the provided resume data and give detailed, actionable feedback.

IMPORTANT RULES:
1. DO NOT calculate or mention ATS scores - they are already calculated
2. Focus on qualitative analysis and improvements
3. Be specific and actionable in your recommendations
4. Provide your analysis in valid JSON format ONLY, with no additional text before or after

Analyze this resume for a ${jobRole} position in the ${industry} industry.

RESUME TEXT:
${resumeText.substring(0, 4000)}

ATS ANALYSIS RESULTS:
- Matched Keywords: ${atsResults.matchedKeywords.join(', ')}
- Missing Keywords: ${atsResults.missingKeywords.join(', ')}
- Section Status: ${JSON.stringify(atsResults.sectionStatus)}

Provide your response as a JSON object with this exact structure:
{
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "toRemove": ["item to remove 1", "item to remove 2"],
  "optimization": "Overall optimization advice in 2-3 sentences"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response (remove markdown code blocks if present)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const analysis = JSON.parse(jsonText);

    // Validate response structure
    if (!analysis.strengths || !analysis.weaknesses || !analysis.improvements) {
      throw new Error('Invalid response format from Gemini');
    }

    return analysis;

  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Provide fallback analysis if Gemini fails
    return {
      strengths: [
        'Resume includes relevant experience for the role',
        'Good keyword coverage based on the analysis',
        'Professional presentation of information'
      ],
      weaknesses: [
        'Could improve keyword optimization for better ATS performance',
        'Some expected sections may need enhancement',
        'Consider adding more quantifiable achievements'
      ],
      improvements: [
        `Add more ${jobRole}-specific keywords and technical terms`,
        'Include measurable achievements with numbers and percentages',
        'Ensure all required sections are comprehensive and well-structured',
        'Tailor the resume content specifically for the ${industry} industry'
      ],
      toRemove: [
        'Remove generic objective statements if present',
        'Remove outdated or irrelevant skills and experiences'
      ],
      optimization: `Focus on tailoring your resume to the ${jobRole} role in the ${industry} industry. Highlight measurable achievements and ensure all critical sections demonstrate your relevant expertise and impact.`
    };
  }
};

module.exports = { analyzeFeedback };
