import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  scores: {
    innovation: { type: Number, min: 1, max: 10, default: 5 },
    complexity: { type: Number, min: 1, max: 10, default: 5 },
    uiux: { type: Number, min: 1, max: 10, default: 5 },
    backend: { type: Number, min: 1, max: 10, default: 5 },
    database: { type: Number, min: 1, max: 10, default: 5 },
    deployment: { type: Number, min: 1, max: 10, default: 5 },
    documentation: { type: Number, min: 1, max: 10, default: 5 },
    codeQuality: { type: Number, min: 1, max: 10, default: 5 },
  },
  totalScore: { type: Number, default: 0 },
  comments: { type: String, default: '' },
  status: { type: String, enum: ['Approved', 'Needs Improvement'], default: 'Needs Improvement' },
}, { timestamps: true });

// Auto compute total before save
evaluationSchema.pre('save', function (next) {
  const s = this.scores;
  this.totalScore = s.innovation + s.complexity + s.uiux + s.backend + s.database + s.deployment + s.documentation + s.codeQuality;
  next();
});

export default mongoose.model('Evaluation', evaluationSchema);
