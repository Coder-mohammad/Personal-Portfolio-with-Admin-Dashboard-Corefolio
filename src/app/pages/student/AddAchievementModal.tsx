import React, { useState } from 'react';
import { useData } from '../../contexts/DataProvider';
import { X, FileText, Upload, Lightbulb } from 'lucide-react';

type AchievementCategory = 'Certification' | 'Hackathon' | 'Workshop';

const CATEGORY_TIPS: Record<AchievementCategory, { title: string; subtitle: string }> = {
  Certification: {
    title: 'Add your best 2 professional certifications',
    subtitle: 'Include AWS, Google Cloud, Azure, or other industry certifications'
  },
  Hackathon: {
    title: 'Add your top 2 hackathon achievements',
    subtitle: 'Include competition name, position, and project details'
  },
  Workshop: {
    title: 'Add your 2 most impactful workshops',
    subtitle: 'Include technical workshops, bootcamps, or training programs'
  }
};

interface AddAchievementModalProps {
  onClose: () => void;
}

const AddAchievementModal: React.FC<AddAchievementModalProps> = ({ onClose }) => {
  const { addAchievement } = useData();
  const [category, setCategory] = useState<AchievementCategory>('Certification');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }));
  const [description, setDescription] = useState('');
  const [proofFile, setProofFile] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!title.trim()) return;

    addAchievement({
      category,
      title: title.trim(),
      date,
      description: description.trim() || undefined,
      proofUrl: proofFile || undefined
    });
    onClose();
  };

  const handleFileUpload = () => {
    // Simulated file upload - in production this would use a real upload
    setProofFile('uploaded_proof.pdf');
  };

  const tip = CATEGORY_TIPS[category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Add Achievement</h2>
                <p className="text-sm text-blue-100">Upload certificates, hackathon wins, or workshop details.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Category Tabs */}
          <div className="flex gap-2">
            {(['Certification', 'Hackathon', 'Workshop'] as AchievementCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg border-2 transition-all duration-200 ${category === cat
                    ? 'bg-blue-50 text-blue-600 border-blue-500'
                    : 'bg-gray-50 text-gray-500 border-transparent hover:border-gray-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Contextual Tip */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3 border border-gray-100">
            <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">{tip.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{tip.subtitle}</p>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={category === 'Certification' ? 'e.g. AWS Solutions Architect' : category === 'Hackathon' ? 'e.g. Smart India Hackathon - Winner' : 'e.g. React Advanced Workshop'}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-sm"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
            <div className="relative">
              <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description (Optional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="e.g. Professional level, completed in January 2025"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-sm resize-none"
            />
          </div>

          {/* File Upload Area */}
          <div>
            <button
              type="button"
              onClick={handleFileUpload}
              className={`w-full border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${proofFile
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`p-2 rounded-full ${proofFile ? 'bg-green-100' : 'bg-blue-50'}`}>
                  <Upload className={`w-5 h-5 ${proofFile ? 'text-green-600' : 'text-blue-500'}`} />
                </div>
                {proofFile ? (
                  <>
                    <p className="font-semibold text-green-700 text-sm">Proof uploaded ✓</p>
                    <p className="text-xs text-green-600">Click to replace</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-gray-700 text-sm">Click to upload proof</p>
                    <p className="text-xs text-gray-500">Upload certificate (PDF/Image)Image or PDF (Max 5MB)</p>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="flex-1 py-3 px-4 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              Save Achievement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAchievementModal;
