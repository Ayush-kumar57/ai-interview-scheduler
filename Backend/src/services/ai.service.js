const { GoogleGenAI } = require('@google/genai');
const { z } = require('zod');
const { zodToJsonSchema } = require('zod-to-json-schema');
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
  apiKey: process.env.GoogleGenAI,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      'A score 0 to 100 between the candidate and the job description based on the analysis of resume, self description and job description.',
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            'The technical question can be asked during the interview.',
          ),
        intention: z
          .string()
          .describe(
            'The intention of interviewer behind asking the technical question.',
          ),
        answer: z
          .string()
          .describe(
            'How to answer this question, what points to cover , what approach to take etc.',
          ),
      }),
    )
    .describe(
      'Technical Questions that  cane be asked during interview along with their intention and answer.',
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            'The behavioral question can be asked during the interview.',
          ),
        intention: z
          .string()
          .describe(
            'The intention of interviewer behind asking the behavioral question.',
          ),
        answer: z
          .string()
          .describe(
            'How to answer this question, what points to cover , what approach to take etc.',
          ),
      }),
    )
    .describe(
      'Behavioral Questions that  cane be asked during interview along with their intention and answer.',
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe('The skill in which candidate is lacking.'),
        severity: z
          .enum(['low', 'medium', 'high'])
          .describe('The severity of the skill gap.'),
      }),
    )
    .describe(
      'List of skill gaps identified based on the analysis of resume, self description and job description.',
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe('The day number of the preparation plan.'),
        focus: z
          .string()
          .describe('The main focus of the preparation for that day.'),
        tasks: z
          .array(z.string())
          .describe(
            'The list of tasks to be completed on that day for preparation.',
          ),
      }),
    )
    .describe(
      'A day-wise preparation plan for the candidate to prepare for the interview based on the identified skill gaps and questions.',
    ),title: z.string().describe('The title of the job for which the interview report is generated.'),
});


async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: {
      top: '20mm',
      bottom: '20mm',
      left: '15mm',
      right: '15mm',
    },
  });

  await browser.close();

  return pdfBuffer;
}

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {

  const prompt = `You are an expert interviewer. Generate a detailed interview report for a candidate with the following details:
                  Resume: ${resume}
                  Self Description: ${selfDescription}
                  Job Description: ${jobDescription}
                  
                  CRITICAL INSTRUCTIONS:
                  - Generate exactly 5 to 7 high-quality technicalQuestions.
                  - Generate exactly 3 to 4 realistic behavioralQuestions.
                  - Provide a day-by-day preparationPlan covering at least 5 to 7 days.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: zodToJsonSchema(interviewReportSchema),
      },
    });

    console.log('--- Real Gemini Response ---');
    const parsedData = JSON.parse(response.text);
    console.log(parsedData);
    return parsedData;
  } catch (error) {
    if (
      error.status === 429 ||
      error.status == 404 ||
      error.status == 503 ||
      error.message.includes('quota') ||
      error.message.includes('UNAVAILABLE') ||
      error.message.includes('NOT_FOUND') ||
      error.message.includes('503')
    ) {
      console.warn(
        '# Gemini Quota Exceeded! Returning Mock Data for local testing...',
      );

      const mockResponse = {
        title: 'Interview Plan',
        matchScore: 85,
        technicalQuestions: [
          {
            question:
              'Explain the optimization techniques you used with MongoDB aggregation pipelines in your previous project.',
            intention:
              'To test the depth of knowledge in heavy data manipulation and performance query patterns.',
            answer:
              'Cover aggregation stages like $match, $group, and $project. Explain how using indexes before $match reduces documents scanned.',
          },
          {
            question:
              'What is the Virtual DOM in React, and how does the reconciliation process work?',
            intention:
              'To check understanding of React internals and rendering performance.',
            answer:
              'Explain how React creates a lightweight copy of the real DOM, compares it using the diffing algorithm, and batches updates.',
          },
          {
            question:
              'Explain the difference between Rest and Spread operators in JavaScript with examples.',
            intention: 'To evaluate core modern JavaScript (ES6+) familiarity.',
            answer:
              'Rest collects multiple elements into an array, while spread expands an array into individual elements.',
          },
        ],
        behavioralQuestions: [
          {
            question:
              'Describe a situation where you had to lead a migration from a monolithic architecture to services.',
            intention:
              'To assess system design knowledge and engineering leadership traits.',
            answer:
              'Explain the modular breaking strategy, setting up separate business routing modules, and handling backward compatibility.',
          },
          {
            question:
              'Tell me about a time when you had a disagreement with a team member. How did you resolve it?',
            intention:
              'To test conflict resolution and professional communication skills.',
            answer:
              'Focus on empathy, active listening, keeping the discussion data-backed, and aligning with the business goal.',
          },
        ],
        skillGaps: [
          { skill: 'AWS Infrastructure Management', severity: 'medium' },
          { skill: 'CI/CD Deployment Automation', severity: 'high' },
        ],
        preparationPlan: [
          {
            day: 1,
            focus: 'Cloud Fundamentals & AWS Basics',
            tasks: [
              'Understand EC2 instances and S3 setups',
              'Deploy a dummy node backend using an AWS free tier account',
            ],
          },
          {
            day: 2,
            focus: 'CI/CD Pipelines & Automation',
            tasks: [
              'Learn GitHub Actions workflows and syntax',
              'Set up an automated linting and testing pipeline for your repository',
            ],
          },
          {
            day: 3,
            focus: 'System Design & Architecture Refresher',
            tasks: [
              'Study microservices patterns and API Gateway concepts',
              'Practice system design diagrams for a scalable e-commerce app',
            ],
          },
        ],
      };

      console.log(mockResponse);
      return mockResponse;
    }

    console.error('Unexpected SDK Error:', error.message);
    throw error;
  }
}

async function generateResumePdf({resume, selfDescription ,jobDescription}) {
  const resumePdfSchema = z.object({
    html:z.string().describe("The HTML content of the resume which can be converted to PDF using and library like puppeteer")
  })
  const prompt = `Generate a resume for a candidate with the following details:
  Resume: ${resume}
  Self Description: ${selfDescription}
  job Description: ${jobDescription}
  
   the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.`;



  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: zodToJsonSchema(resumePdfSchema),
    },
  });
  const jsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;

}

module.exports = { generateInterviewReport ,generateResumePdf };
