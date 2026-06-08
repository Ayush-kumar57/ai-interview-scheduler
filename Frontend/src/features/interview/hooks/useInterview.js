  import {
    getAllInterviewReports,
    scheduleInterview,
    getInterviewReportById,
  } from '../services/interview.api';
  import { useContext } from 'react';
  import { InterviewContext } from '../interview.context';

  export const useInterview = () => {
    const context = useContext(InterviewContext);

    if (!InterviewContext) {
      throw new Error('useInterview Must be used within an InterviewProvider');
    }

    const { loading, setLoading, report, setReport, reports, setReports } =
      context;

    const generateReport = async ({
      title,
      resumeFile,
      selfDescription,
      jobDescription,
    }) => {
      setLoading(true);
      let response = null;
      try {
        response = await scheduleInterview({
          title,
          resumeFile,
          selfDescription,
          jobDescription,
        });
        setReport(response.interviewReport);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }

      return response.interviewReport;
    };

    const getReportById = async (interviewId) => {
      setLoading(true);
      let response = null;
      try {
        response = await getInterviewReportById(interviewId);
        setReport(response.interviewReport);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }

      return response.interviewReport;
    };

    const getReports = async () => {
      setLoading(true);
      let response = null;
      try {
        response = await getAllInterviewReports();
        setReports(response.interviewReports);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }

      return response.interviewReports;
    };
    return {
      loading,
      report,
      reports,
      generateReport,
      getReportById,
      getReports,
    };
  };



