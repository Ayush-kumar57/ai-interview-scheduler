const { PDFParse } = require('pdf-parse');
const { generateInterviewReport ,generateResumePdf } = require('../services/ai.service.js');
const interviewReportModel = require('../models/interviewReport.model.js');

/**
 * @description Controller to generate interview report based on user self description , resume and job description.
 *
 */

async function scheduleInterview(req, res) {
  try {
    const resumeFile = req.file;
    if (!resumeFile) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }

    const parser = new PDFParse({ data: req.file.buffer });
    const parsedData = await parser.getText();

    const resumeContent = parsedData.text;

    const { title ,selfDescription, jobDescription } = req.body;

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user._id,
      title,
      resume: resumeContent,
      selfDescription,
      jobDescription,
      ...interviewReportByAi,
    });

    res.status(201).json({
      message: 'Interview report generated successfully',
      interviewReport,
    });
  } catch (error) {
    console.error('Error in scheduleInterview:', error);
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;
  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user._id,
  });

  if (!interviewReport) {
    return res.status(404).json({ message: 'Interview report not found' });
  }
  res.status(200).json({
    message: 'Interview report fetched successfully',
    interviewReport,
  });
}
/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select(
      '-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan',
    );
  res.status(200).json({
    message: 'Interview reports fetched successfully',
    interviewReports,
  });
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
  const { interviewReportId } = req.params;

  const interviewReport =
    await interviewReportModel.findById(interviewReportId);

  if (!interviewReport) {
    return res.status(404).json({
      message: 'Interview report not found.',
    });
  }

  const { resume, jobDescription, selfDescription } = interviewReport;

  const pdfBuffer = await generateResumePdf({
    resume,
    jobDescription,
    selfDescription,
  });

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename=resume_${interviewReportId}.pdf`,
  });

  res.send(pdfBuffer);
}

module.exports = {
  scheduleInterview,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
};
