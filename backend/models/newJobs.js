import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract'],
    required: true
  },
  salaryRange: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    trim: true
  },
  deadline: {
    type: Date
  },
  description: {
    type: String,
    trim: true
  },
  requirements: {
    type: String,
    trim: true
  },
  skills: {
    type: [String],
    default: [],
    validate: {
      validator: function(skills) {
        return skills.length <= 20; // Max 20 skills
      },
      message: 'Maximum 20 skills allowed'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
