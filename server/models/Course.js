import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  semester: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
