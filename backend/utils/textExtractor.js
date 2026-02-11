const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extract text from PDF or DOCX file buffer
 * @param {Object} file - Multer file object with buffer
 * @returns {Promise<string>} Extracted text
 */
const extractText = async (file) => {
  try {
    const mimeType = file.mimetype;
    const buffer = file.buffer;

    if (mimeType === 'application/pdf') {
      // Extract from PDF
      const data = await pdfParse(buffer);
      return data.text;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Extract from DOCX
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
};

module.exports = { extractText };
