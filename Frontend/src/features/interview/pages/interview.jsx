import React from 'react';
import '../style/interview.scss';
import { useInterview } from '../hooks/useInterview';

const Interview = () => {
  const menuItems = [
    { id: 1, label: 'Technical Questions', icon: '❤️' },
    { id: 2, label: 'Behavioral Questions', icon: '📋' },
    { id: 3, label: 'Road Map', icon: '🗺️' },
  ];

  const [activeMenu, setActiveMenu] = React.useState(1);
  const [expandedQuestion, setExpandedQuestion] = React.useState(null);

  const { report } = useInterview();

  if (!report) {
    return (
      <div className="loading">Generating your custom interview plan...</div>
    );
  }

  const scoreColor =
    report?.matchScore >= 80
      ? 'score--high'
      : report?.matchScore >= 60
        ? 'score--medium'
        : 'score--low';

  const getSeverityClass = (severity) => {
    return `severity-${severity}`;
  };

  const toggleQuestion = (indexKey) => {
    setExpandedQuestion(expandedQuestion === indexKey ? null : indexKey);
  };

  const renderContent = () => {

    if (activeMenu === 3) {
      return (
        <div className="content-section">
          <div className="section-header-content">
            <h2 className="section-title">Preparation Road Map</h2>
            <p className="question-count">
              {report?.preparationPlan?.length || 0} Days Plan
            </p>
          </div>
          <div className="roadmap-timeline">
            {report?.preparationPlan?.map((plan, idx) => (
              <div key={idx} className="roadmap-day-card">
                <div className="roadmap-day-header">
                  <span className="day-badge">Day {plan.day}</span>
                  <h3 className="day-focus">{plan.focus}</h3>
                </div>
                <ul className="roadmap-tasks-list">
                  {plan.tasks?.map((task, taskIdx) => (
                    <li key={taskIdx} className="roadmap-task-item">
                      <span className="task-bullet">⚡</span> {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    }

    let questions = [];
    let title = '';

    if (activeMenu === 1) {
      questions = report?.technicalQuestions || [];
      title = 'Technical Questions';
    } else if (activeMenu === 2) {
      questions = report?.behavioralQuestions || [];
      title = 'Behavioral Questions';
    }

    return (
      <div className="content-section">
        <div className="section-header-content">
          <h2 className="section-title">{title}</h2>
          <p className="question-count">{questions.length} questions</p>
        </div>
        <div className="accordion-list">
          {questions.map((q, index) => {
            
            const currentKey = `${activeMenu}-${index}`;
            const isExpanded = expandedQuestion === currentKey;

            return (
              <div
                key={currentKey}
                className={`accordion-item ${isExpanded ? 'expanded' : ''}`}
              >
                <button
                  className="accordion-header"
                  onClick={() => toggleQuestion(currentKey)}
                >
                  <span className="question-badge">Q{index + 1}</span>
                  <span className="accordion-question">{q.question}</span>
                  <span className="accordion-icon">
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </button>
                {isExpanded && (
                  <div className="accordion-content">
                    <div className="detail-section">
                      <label className="detail-label">Intention</label>
                      <p className="detail-text">{q.intention}</p>
                    </div>
                    <div className="detail-section">
                      <label className="detail-label">Suggested Answer</label>
                      <p className="detail-text">{q.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="interview-container">
      {/* Left Sidebar - Navigation */}
      <aside className="sidebar left-sidebar">
        <div className="sidebar-header">
          <p className="sidebar-label">SECTIONS</p>
        </div>
        <nav className="menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveMenu(item.id);
                setExpandedQuestion(null); 
              }}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Center Content */}
      <main className="main-content">{renderContent()}</main>

      {/* Right Sidebar - Score & Skills */}
      <aside className="sidebar right-sidebar">
        {/* Match Score */}
        <div className="match-score-section">
          <p className="sidebar-label">MATCH SCORE</p>
          <div className={`score-circle ${scoreColor}`}>
            <span className="score-value">{report?.matchScore || 0}%</span>
          </div>
          <p className="match-status">
            {report?.matchStatus ||
              (report?.matchScore >= 80
                ? 'Strong match for this role'
                : 'Good match')}
          </p>
        </div>

        {/* Skill Gaps */}
        <div className="skill-gaps-section">
          <p className="sidebar-label">SKILL GAPS</p>
          <div className="skill-gaps-container">
            {report?.skillGaps?.map((skill, idx) => (
              <div
                key={idx}
                className={`skill-badge ${getSeverityClass(skill.severity)}`}
              >
                {skill.skill}
              </div>
            ))}
            {(!report?.skillGaps || report.skillGaps.length === 0) && (
              <p className="no-gaps">No major skill gaps identified! 🎉</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Interview;
