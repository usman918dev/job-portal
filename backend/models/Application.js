import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    coverLetter: {
        type: String,
        default: ''
    },
    resumeUrl: {
        type: String,
        required: true
    },
    availableFrom: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    }
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);