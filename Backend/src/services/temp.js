const { Language } = require('@google/genai');

const resume = `
  Rahul Sharma
  Bengaluru, India | rahul.sharma@email.com | +91 9988776655
  ://linkedin.com | ://github.com

  PROFESSIONAL SUMMARY:
    Frontend Developer with 2.5 years of experience specializing in React.js and modern ecosystem tooling.

  TECHNICAL SKILLS:
    Languages: JavaScript (ES6+), HTML5, CSS3
    Frameworks: React.js, Next.js (Basic)
    State Management: Redux Toolkit, Context API
    Styling: Tailwind CSS, Material UI, SASS
    Tools: Git, Vite, Webpack, Postman

  WORK EXPERIENCE:
    Frontend Engineer | PixelCraft Technologies | Mar 2024 - Present
      - Rebuilt core dashboard using React and Redux Toolkit, improving page load speed by 35%.
      - Implemented responsive, pixel-perfect UI components from Figma designs using Tailwind CSS.
      - Integrated complex RESTful APIs and optimized state re-renders.

    Junior Frontend Developer | AppStudio Labs | Nov 2022 - Feb 2024
      - Maintained and updated features on legacy React applications.
      - Conducted cross-browser compatibility testing and fixed UI bugs.
      - Collaborated with UX researchers to improve overall application accessibility (WCAG compliance).

  PROJECTS:
    E-Commerce Product Explorer
      - Built a dynamic storefront using React, utilizing lazy loading and infinite scroll.
      - Managed global cart state with Redux Toolkit.
    
    Crypto Dashboard
      - Developed a real-time tracking interface using React and custom hooks for WebSocket connections.
`;

const selfDescription = `
  I am a frontend developer who loves turning complex UI mockups into clean, interactive code. My core expertise is in React.js and writing highly reusable functional components. I focus a lot on frontend optimization, bundle sizes, and state synchronization. While I have used Next.js for a few small tasks, most of my production experience is with standard single-page apps (SPAs) built via Vite or Webpack. I am eager to step into a role where I can take ownership of complex client-side states and learn modern micro-frontend setups.
`;

const jobDescription = `
  Position: Frontend Engineer (React/Next.js)
  Company: FinTech ScaleUp
  
  REQUIREMENTS:
  - 2+ years of professional experience building complex web applications with React.js.
  - Strong proficiency in modern JavaScript, asynchronous patterns, and DOM manipulation.
  - Production experience with Next.js (App Router, SSR, and SSG features) is highly required.
  - Experience setting up automated frontend testing using Jest, React Testing Library, or Cypress.
  - Deep understanding of state management systems and architectural design patterns.
  
  RESPONSIBILITIES:
  - Migrate existing React SPAs into Next.js to leverage Server-Side Rendering (SSR).
  - Write comprehensive unit and integration tests to maintain high code coverage.
  - Optimize applications for maximum speed, core web vitals, and visual consistency.
`;
