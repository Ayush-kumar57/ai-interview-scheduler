import React, { useRef } from 'react';
import '../style/home.scss';
import { useInterview } from '../hooks/useInterview';
import { useNavigate } from 'react-router';

const Home = () => {
  // Props/State placeholders for hooks layer
  const [jobDescription, setJobDescription] = React.useState('');
  const [resume, setResume] = React.useState(null);
  const [selfDescription, setSelfDescription] = React.useState('');
  const [isLoading] = React.useState(false);


  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResume(file);
    }
  };

  const handleResumeDelete = () => {
    setResume(null);
  };


  const charCount = jobDescription.length;
  const maxChars = 5000;

  const { loading, generateReport } = useInterview();
  

  const resumeInputRef = useRef();

  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    const data = await generateReport({
      title: 'Interview Plan',
      resumeFile,
      selfDescription,
      jobDescription,
    });

    if (data && data._id) {
      navigate(`/interview/${data._id}`);
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Loading Your Interview Plan...</h1>
      </main>
    );
  }

  return (
    <main className="home">
      <div className="container">
        {/* Header Section */}
        <header className="header">
          <h1 className="title">
            Create Your Custom <span className="highlight">Interview Plan</span>
          </h1>
          <p className="subtitle">
            Let our AI analyze the job requirements and your unique profile to
            build a winning strategy.
          </p>
        </header>

        {/* Form Container */}
        <div className="form-container">
          <div className="form-layout">
            {/* Left: Job Description Section */}
            <section className="form-section left-section">
              <div className="section-header">
                <span className="icon">📋</span>
                <h2>Target Job Description</h2>
                <span className="required">REQUIRED</span>
              </div>

              <textarea
                id="jobDescription"
                name="jobDescription"
                className="textarea-large"
                placeholder="Paste the full job description here...&#10;e.g. Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                maxLength={maxChars}
              />
              <div className="char-counter">
                {charCount} / {maxChars} chars
              </div>
            </section>

            {/* Right: Profile Section */}
            <section className="form-section right-section">
              <div className="section-header">
                <span className="icon">👤</span>
                <h2>Your Profile</h2>
              </div>

              {/* Resume Upload */}
              <div className="upload-section">
                <p className="upload-label">
                  Upload Resume{' '}
                  <span className="best-results">BEST RESULTS</span>
                </p>

                <div className="file-upload-area">
                  <input
                    ref={resumeInputRef}
                    hidden
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf,.docx,.doc"
                    onChange={handleResumeUpload}
                  />

                  {resume ? (
                    <div className="file-preview">
                      <span className="file-icon">📄</span>
                      <div className="file-info">
                        <p className="file-name">{resume.name}</p>
                        <p className="file-size">Max 5MB</p>
                      </div>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={handleResumeDelete}
                        aria-label="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="resume" className="upload-placeholder">
                      <span className="upload-icon">📤</span>
                      <p className="upload-text">
                        Click to upload or drag & drop
                      </p>
                      <p className="upload-hint">PDF or DOCX (Max 5MB)</p>
                    </label>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="divider">
                <span>OR</span>
              </div>

              {/* Self Description */}
              <div className="self-description-section">
                <label htmlFor="selfDescription" className="label">
                  Quick Self-Description
                </label>
                <textarea
                  id="selfDescription"
                  name="selfDescription"
                  className="textarea-medium"
                  placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                />
              </div>

              {/* Validation Message */}
              <div className="validation-message">
                <span className="info-icon">ℹ️</span>
                <p>
                  Either a <strong>Resume</strong> or a{' '}
                  <strong>Self Description</strong> is required to generate a
                  personalized plan.
                </p>
              </div>
            </section>
          </div>

          {/* Generate Button */}
          <button
            className="generate-button"
            onClick={handleGenerateReport}
            disabled={isLoading || (!resume && !selfDescription)}
          >
            <span className="button-icon">🚀</span>
            {isLoading ? 'Generating...' : 'Generate My Interview Strategy'}
          </button>

          {/* Footer Text */}
          <div className="generation-info">
            <span>AI-Powered Strategy Generation</span>
            <span>Approx. 30s</span>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <footer className="page-footer">
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
        <a href="#help">Help Center</a>
      </footer>
    </main>
  );
};

export default Home;
