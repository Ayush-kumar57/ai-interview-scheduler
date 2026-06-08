const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware.js');
const interviewController = require('../controllers/interview.controller.js');
const upload = require('../middlewares/file.middleware.js');

const interviewRoutes = express.Router();

/**
 * @route POST /api/interview
 * @description generate new interview report on the basis of user self description ,resume pdf and job description.
 * @access Private
 */
interviewRoutes.post(
  '/',
  authMiddleware.authUser,
  upload.single('resume'),
  interviewController.scheduleInterview,
);

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId
 * @access Private
 */
interviewRoutes.get(
  '/report/:interviewId',
  authMiddleware.authUser,
  interviewController.getInterviewReportByIdController,
);

/**
 * @route GET /api/interview/history
 * @description get all interview reports of logged in user.
 * @access Private
 */
interviewRoutes.get(
  '/',
  authMiddleware.authUser,
  interviewController.getAllInterviewReportsController,
);


module.exports = interviewRoutes;
