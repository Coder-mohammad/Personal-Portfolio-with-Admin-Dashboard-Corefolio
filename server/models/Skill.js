import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['Frontend', 'Backend', 'Tools', 'Design', 'Other'], default: 'Other' },
  level: { type: Number, min: 0, max: 100 },
  endorsed: { type: Boolean, default: false },
  endorsedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Skill', skillSchema);
