const { extractText } = require('../utils/textExtractor');
const { calculateATSScore } = require('../utils/atsScoring');
const { analyzeFeedback } = require('../utils/openai');

const analyzeResume = async (req, res) => {
  try {
    const { jobRole, industry } = req.body;
    const file = req.file;

    // Validation
    if (!file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    if (!jobRole || !industry) {
      return res.status(400).json({ error: 'Job role and industry are required' });
    }

    // Step 1: Extract text from resume
    const resumeText = await extractText(file);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from resume' });
    }

    // Step 2: Calculate deterministic ATS score
    const atsResults = calculateATSScore(resumeText, jobRole, industry);

    // Step 3: Get ChatGPT analysis
    const aiAnalysis = await analyzeFeedback(resumeText, jobRole, industry, atsResults);

    // Step 4: Combine and return results
    res.json({
      success: true,
      atsScore: atsResults.atsScore,
      matchedKeywords: atsResults.matchedKeywords,
      missingKeywords: atsResults.missingKeywords,
      sectionStatus: atsResults.sectionStatus,
      aiAnalysis: aiAnalysis
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Resume analysis failed', 
      details: error.message 
    });
  }
};

module.exports = { analyzeResume };
