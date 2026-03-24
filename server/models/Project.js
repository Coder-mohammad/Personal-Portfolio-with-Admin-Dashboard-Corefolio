import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  detailedDescription: { type: String },
  techStack: [{ type: String }],
  imageUrl: { type: String, default: '' },
  demoLink: { type: String },
  repoLink: { type: String },
  featured: { type: Boolean, default: false },
  outcomes: [{ type: String }],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  verified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expertiseTrack: { type: String },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
