    import axios from 'axios';

    const api =axios.create({
        baseURL: "http://localhost:3000",
        withCredentials: true,
    });



    /**
     * @description service to schedule interview by sending resume file,self description and job description to backend and get interview report in response.
     */
    export const scheduleInterview = async ({title,resumeFile, selfDescription, jobDescription}) => {
        const formData = new FormData()
        formData.append('title', title);
        formData.append('selfDescription', selfDescription);
        formData.append('jobDescription', jobDescription);
        formData.append('resume', resumeFile);
        
        const response = await api.post('/api/interview', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    

    /**
     * @description service to get interview report by interviewId.
     */
    export const getInterviewReportById = async (interviewId) => {
        const response = await api.get(`/api/interview/report/${interviewId}`);
        return response.data;
    }

    /**
     * @description service to get all interview reports of logged in user.
     */
    export const getAllInterviewReports = async () => {
        const response = await api.get('/api/interview');
        return response.data;
    }


    