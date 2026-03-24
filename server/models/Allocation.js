import mongoose from 'mongoose';

const allocationSchema = new mongoose.Schema({
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Allocation', allocationSchema);
