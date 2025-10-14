import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    trim: true
  },
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  },
  endpoint: {
    type: String,
    required: true,
    trim: true
  },
  ip: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  requestBody: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  statusCode: {
    type: Number
  },
  errorMessage: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
auditLogSchema.index({ admin: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
