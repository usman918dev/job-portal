// Comprehensive list of professional skills similar to LinkedIn
export const AVAILABLE_SKILLS = [
  // Programming Languages
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'PHP',
  'Ruby',
  'Go',
  'Swift',
  'Kotlin',
  'Rust',
  'Scala',
  'R',
  'MATLAB',
  'SQL',
  'HTML',
  'CSS',
  
  // Frontend Development
  'React.js',
  'Vue.js',
  'Angular',
  'Next.js',
  'Svelte',
  'Redux',
  'React Native',
  'Flutter',
  'jQuery',
  'Bootstrap',
  'Tailwind CSS',
  'Material-UI',
  'SASS',
  'LESS',
  'Webpack',
  'Vite',
  
  // Backend Development
  'Node.js',
  'Express.js',
  'Django',
  'Flask',
  'Spring Boot',
  'ASP.NET',
  'Ruby on Rails',
  'Laravel',
  'FastAPI',
  'NestJS',
  'GraphQL',
  'REST API',
  'Microservices',
  
  // Databases
  'MongoDB',
  'MySQL',
  'PostgreSQL',
  'Redis',
  'Elasticsearch',
  'Oracle',
  'Microsoft SQL Server',
  'SQLite',
  'Firebase',
  'Cassandra',
  'DynamoDB',
  
  // Cloud & DevOps
  'AWS',
  'Azure',
  'Google Cloud Platform',
  'Docker',
  'Kubernetes',
  'Jenkins',
  'GitLab CI/CD',
  'GitHub Actions',
  'Terraform',
  'Ansible',
  'Linux',
  'Nginx',
  'Apache',
  
  // Mobile Development
  'iOS Development',
  'Android Development',
  'React Native',
  'Flutter',
  'Swift',
  'Kotlin',
  'Xamarin',
  
  // Data Science & AI
  'Machine Learning',
  'Deep Learning',
  'TensorFlow',
  'PyTorch',
  'Scikit-learn',
  'Natural Language Processing',
  'Computer Vision',
  'Data Analysis',
  'Data Visualization',
  'Pandas',
  'NumPy',
  'Jupyter',
  
  // Design
  'UI/UX Design',
  'Figma',
  'Adobe XD',
  'Sketch',
  'Adobe Photoshop',
  'Adobe Illustrator',
  'InVision',
  'Prototyping',
  'Wireframing',
  'User Research',
  
  // Project Management
  'Agile',
  'Scrum',
  'Kanban',
  'JIRA',
  'Trello',
  'Asana',
  'Project Management',
  'Product Management',
  'Stakeholder Management',
  
  // Soft Skills
  'Communication',
  'Leadership',
  'Team Collaboration',
  'Problem Solving',
  'Critical Thinking',
  'Time Management',
  'Adaptability',
  'Creativity',
  'Presentation Skills',
  'Public Speaking',
  'Conflict Resolution',
  'Negotiation',
  
  // Business & Marketing
  'Digital Marketing',
  'SEO',
  'Content Marketing',
  'Social Media Marketing',
  'Email Marketing',
  'Google Analytics',
  'A/B Testing',
  'Market Research',
  'Business Analysis',
  'Financial Analysis',
  'Sales',
  'Customer Relationship Management',
  
  // Testing & Quality
  'Test Automation',
  'Selenium',
  'Jest',
  'Cypress',
  'Unit Testing',
  'Integration Testing',
  'Quality Assurance',
  'Manual Testing',
  
  // Security
  'Cybersecurity',
  'Network Security',
  'Penetration Testing',
  'Ethical Hacking',
  'OWASP',
  
  // Other Technologies
  'Git',
  'GitHub',
  'GitLab',
  'Bitbucket',
  'Version Control',
  'API Development',
  'Web Services',
  'JSON',
  'XML',
  'OAuth',
  'JWT',
  'WebSockets',
  'Responsive Design',
  'Progressive Web Apps',
  'Accessibility',
  'Performance Optimization',
];

// Function to filter skills based on user input
export const filterSkills = (query, existingSkills = []) => {
  if (!query || query.trim().length === 0) return [];
  
  const lowerQuery = query.toLowerCase().trim();
  
  return AVAILABLE_SKILLS
    .filter(skill => 
      skill.toLowerCase().includes(lowerQuery) && 
      !existingSkills.includes(skill)
    )
    .slice(0, 10); // Limit to 10 suggestions
};

// Maximum number of skills a user can add
export const MAX_SKILLS = 50;

// Minimum characters to start showing suggestions
export const MIN_CHARS_FOR_SUGGESTIONS = 1;
