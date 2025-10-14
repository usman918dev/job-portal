# Job Seeder API

This seeder allows you to quickly generate fake job data for testing and development purposes using Faker.js.

## Routes

### 1. Seed Jobs
**POST** `/api/seed/jobs`

Creates fake jobs in the database.

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "count": 5
}
```

**Parameters:**
- `count` (optional): Number of jobs to create (default: 5, max: 50)

**Response:**
```json
{
  "success": true,
  "message": "Successfully created 5 fake jobs",
  "count": 5,
  "jobs": [...]
}
```

**Example using cURL:**
```bash
curl -X POST http://localhost:5000/api/seed/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"count": 5}'
```

**Example using Postman:**
1. Method: POST
2. URL: `http://localhost:5000/api/seed/jobs`
3. Headers: 
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_ADMIN_TOKEN`
4. Body (raw JSON):
   ```json
   {
     "count": 5
   }
   ```

---

### 2. Clear All Jobs
**DELETE** `/api/seed/jobs`

Deletes all jobs from the database.

**⚠️ WARNING:** Use with caution! This will delete ALL jobs.

**Authentication:** Required (Admin only)

**Response:**
```json
{
  "success": true,
  "message": "Successfully deleted 25 jobs",
  "deletedCount": 25
}
```

**Example using cURL:**
```bash
curl -X DELETE http://localhost:5000/api/seed/jobs \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Fake Data Generated

Each fake job includes:

- **Title**: Random job title (e.g., "Senior Software Engineer", "Full Stack Developer")
- **Company**: Random company name
- **Location**: Random city and state
- **Job Type**: Random selection from full-time, part-time, or contract
- **Salary Range**: Random salary between $40,000 - $170,000
- **Experience**: Random years (0-15 years)
- **Deadline**: Random date within next 3 months
- **Description**: Detailed job description with multiple paragraphs
- **Requirements**: List of qualifications, technical skills, and soft skills

---

## Usage Examples

### Quick Test with 5 Jobs
Visit the route after logging in as admin, or use the API:

```javascript
// Frontend example
const seedJobs = async () => {
  const response = await api.post('/api/seed/jobs', { count: 5 });
  console.log(response.data);
};
```

### Create 20 Jobs for Load Testing
```javascript
const response = await api.post('/api/seed/jobs', { count: 20 });
```

### Clear Database Before Fresh Seed
```javascript
// Clear all jobs
await api.delete('/api/seed/jobs');

// Seed fresh data
await api.post('/api/seed/jobs', { count: 10 });
```

---

## Security

- Only authenticated admin users can access these routes
- Maximum of 50 jobs per request to prevent abuse
- All seeded jobs are linked to the admin user who created them

---

## Development Workflow

1. **Initial Setup**: Seed 5-10 jobs for basic testing
2. **Pagination Testing**: Seed 20-50 jobs to test pagination
3. **Clear & Reset**: Delete all and reseed when needed
4. **Production**: Disable or remove these routes in production!

---

## Notes

- Jobs created by the seeder are linked to the authenticated admin's ID
- Each visit to the seed route creates NEW jobs (duplicates possible)
- Use the clear route before seeding if you want a fresh dataset
- Generated data is random each time, ensuring variety in testing
