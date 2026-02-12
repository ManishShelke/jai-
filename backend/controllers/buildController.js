const { buildResume } = require('../utils/openai');

const buildResumeController = async (req, res) => {
  try {
    const { currentData, userMessage, history } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'User message is required' });
    }

    const result = await buildResume(currentData || {}, userMessage, history || []);

    res.json(result);

  } catch (error) {
    console.error('Build controller error:', error);
    res.status(500).json({ 
      error: 'Resume building failed', 
      details: error.message 
    });
  }
};

module.exports = { buildResumeController };
