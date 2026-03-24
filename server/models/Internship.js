import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String },
  expertiseTrack: { type: String },
  verified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Internship', internshipSchema);
