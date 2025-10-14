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
