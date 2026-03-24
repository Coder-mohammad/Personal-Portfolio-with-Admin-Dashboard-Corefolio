import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['Certification', 'Hackathon', 'Workshop'], required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String },
  proofUrl: { type: String },
}, { timestamps: true });

export default mongoose.model('Achievement', achievementSchema);
