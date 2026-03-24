import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  headline: { type: String, default: '' },
  summary: { type: String, default: '' },
  email: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  avatarUrl: { type: String, default: '' },
  resumeUrl: { type: String },
  branch: { type: String, default: '' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  batch: { type: String, default: '' },
  section: { type: String },
  gpa: { type: Number, min: 0, max: 10 },
  isPublished: { type: Boolean, default: false },
  expertiseTracks: [{
    type: String, enum: [
      'Software Development', 'Core Engineering', 'Data / AI / Analytics',
      'Research & Higher Studies', 'Management / Consulting'
    ]
  }],
  socials: {
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    website: { type: String },
  },
}, { timestamps: true });

export default mongoose.model('StudentProfile', studentProfileSchema);
