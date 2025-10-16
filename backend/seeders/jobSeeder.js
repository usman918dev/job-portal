import { faker } from '@faker-js/faker';
import Job from '../models/newJobs.js';

/**
 * Generate fake job data using Faker.js
 * @param {String} adminId - The admin user ID who creates the jobs
 * @param {Number} count - Number of jobs to create (default: 5)
 */
export const seedJobs = async (adminId, count = 5) => {
  try {
    const jobs = [];

    for (let i = 0; i < count; i++) {
      // Generate random job type
      const jobTypes = ['full-time', 'part-time', 'contract'];
      const jobType = faker.helpers.arrayElement(jobTypes);

      // Generate salary range
      const salaryFrom = faker.number.int({ min: 40000, max: 120000 });
      const salaryTo = faker.number.int({ min: salaryFrom + 10000, max: salaryFrom + 50000 });
      const salaryRange = `${salaryFrom} - ${salaryTo}`;

      // Generate experience range
      const experience = faker.number.int({ min: 0, max: 15 });

      // Generate deadline (between 30 to 90 days from now)
      const deadline = faker.date.future({ years: 0.25 }); // next 3 months

      // Generate job title
      const jobTitles = [
        'Senior Software Engineer',
        'Full Stack Developer',
        'Frontend Developer',
        'Backend Developer',
        'DevOps Engineer',
        'Product Manager',
        'UI/UX Designer',
        'Data Scientist',
        'Machine Learning Engineer',
        'Quality Assurance Engineer',
        'Mobile App Developer',
        'Cloud Architect',
        'Database Administrator',
        'Cybersecurity Specialist',
        'Business Analyst',
        'Scrum Master',
        'Technical Lead',
        'React Developer',
        'Node.js Developer',
        'Python Developer'
      ];

      const title = faker.helpers.arrayElement(jobTitles);

      // Generate relevant skills based on job title
      const skillsDatabase = {
        'Senior Software Engineer': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'AWS', 'Git', 'Agile', 'System Design', 'Microservices'],
        'Full Stack Developer': ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'HTML', 'CSS', 'JavaScript', 'REST API', 'Git'],
        'Frontend Developer': ['React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'Responsive Design', 'Webpack'],
        'Backend Developer': ['Node.js', 'Python', 'Java', 'MongoDB', 'PostgreSQL', 'REST API', 'GraphQL', 'Docker', 'Redis', 'AWS'],
        'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Jenkins', 'Terraform', 'Linux', 'Git', 'Monitoring', 'Shell Scripting'],
        'Product Manager': ['Agile', 'Scrum', 'Jira', 'Product Strategy', 'User Research', 'Data Analysis', 'Communication', 'Roadmapping', 'Stakeholder Management', 'A/B Testing'],
        'UI/UX Designer': ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Wireframing', 'Design Systems', 'HTML', 'CSS', 'Responsive Design'],
        'Data Scientist': ['Python', 'R', 'Machine Learning', 'TensorFlow', 'PyTorch', 'SQL', 'Data Visualization', 'Statistics', 'Pandas', 'Jupyter'],
        'Machine Learning Engineer': ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Deep Learning', 'NLP', 'Computer Vision', 'AWS', 'Docker', 'SQL'],
        'Quality Assurance Engineer': ['Selenium', 'Jest', 'Cypress', 'Test Automation', 'Manual Testing', 'Bug Tracking', 'Jira', 'API Testing', 'Performance Testing', 'Agile'],
        'Mobile App Developer': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android', 'Firebase', 'REST API', 'Git', 'App Store Deployment'],
        'Cloud Architect': ['AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'Docker', 'Microservices', 'Serverless', 'Terraform', 'System Design', 'Security'],
        'Database Administrator': ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Database Design', 'Performance Tuning', 'Backup & Recovery', 'Redis', 'Oracle', 'Linux'],
        'Cybersecurity Specialist': ['Network Security', 'Penetration Testing', 'Encryption', 'Firewall', 'SIEM', 'Vulnerability Assessment', 'Compliance', 'Incident Response', 'Linux', 'Python'],
        'Business Analyst': ['SQL', 'Excel', 'Data Analysis', 'Requirements Gathering', 'Business Intelligence', 'Tableau', 'Power BI', 'Jira', 'Agile', 'Documentation'],
        'Scrum Master': ['Agile', 'Scrum', 'Jira', 'Confluence', 'Sprint Planning', 'Backlog Management', 'Facilitation', 'Stakeholder Management', 'Kanban', 'Communication'],
        'Technical Lead': ['System Design', 'Architecture', 'Leadership', 'Code Review', 'Mentoring', 'Agile', 'JavaScript', 'Node.js', 'AWS', 'Git'],
        'React Developer': ['React', 'JavaScript', 'TypeScript', 'Redux', 'React Hooks', 'HTML', 'CSS', 'REST API', 'Git', 'Webpack'],
        'Node.js Developer': ['Node.js', 'Express', 'JavaScript', 'MongoDB', 'PostgreSQL', 'REST API', 'GraphQL', 'Docker', 'AWS', 'Git'],
        'Python Developer': ['Python', 'Django', 'Flask', 'FastAPI', 'PostgreSQL', 'REST API', 'Docker', 'Git', 'SQL', 'Linux']
      };

      // Get skills for this job title, or use default skills
      const allSkillsForJob = skillsDatabase[title] || ['JavaScript', 'Communication', 'Problem Solving', 'Git', 'Agile'];
      
      // Randomly select 5-8 skills from the available skills for this job
      const numberOfSkills = faker.number.int({ min: 5, max: 8 });
      const skills = faker.helpers.arrayElements(allSkillsForJob, numberOfSkills);

      // Generate job description
      const description = `
We are seeking a talented ${title} to join our dynamic team at ${faker.company.name()}.

Key Responsibilities:
${faker.lorem.paragraph()}

About the Role:
${faker.lorem.paragraph()}

What We Offer:
${faker.lorem.paragraph()}

Work Environment:
${faker.lorem.sentence()}
      `.trim();

      // Generate requirements
      const requirements = `
Required Qualifications:
- ${faker.lorem.sentence()}
- ${faker.lorem.sentence()}
- ${faker.lorem.sentence()}
- ${faker.lorem.sentence()}

Technical Skills:
- ${faker.lorem.words(3)}
- ${faker.lorem.words(3)}
- ${faker.lorem.words(3)}
- ${faker.lorem.words(3)}

Preferred Qualifications:
- ${faker.lorem.sentence()}
- ${faker.lorem.sentence()}
- ${faker.lorem.sentence()}

Soft Skills:
- Excellent communication skills
- Team collaboration
- Problem-solving abilities
- Time management
      `.trim();

      const jobData = {
        title,
        company: faker.company.name(),
        location: `${faker.location.city()}, ${faker.location.state()}`,
        jobType,
        salaryRange,
        experience: `${experience}`,
        deadline,
        description,
        requirements,
        skills, // Add skills to job data
        createdBy: adminId
      };

      jobs.push(jobData);
    }

    // Insert all jobs into the database
    const createdJobs = await Job.insertMany(jobs);
    
    console.log(`✅ Successfully created ${createdJobs.length} fake jobs`);
    return createdJobs;
  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
    throw error;
  }
};

/**
 * Clear all jobs from the database (use with caution!)
 */
export const clearJobs = async () => {
  try {
    const result = await Job.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} jobs from database`);
    return result;
  } catch (error) {
    console.error('❌ Error clearing jobs:', error);
    throw error;
  }
};
