import React, { useState } from 'react';
import { useData } from '../../contexts/DataProvider';
import { Plus, Trash2, Building2, CheckCircle, Clock, Save, X, Award, Calendar, FileText, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_EXPERTISE_TRACKS, ExpertiseTrack } from '../../types';
import AddAchievementModal from './AddAchievementModal';

const CATEGORY_CONFIG = {
  Certification: { color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700', badgeBg: 'bg-blue-100' },
  Hackathon: { color: 'purple', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-700', badgeBg: 'bg-purple-100' },
  Workshop: { color: 'emerald', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', textColor: 'text-emerald-700', badgeBg: 'bg-emerald-100' },
};

const ExperiencePage = () => {
  const { currentUser, getStudentData, addInternship, deleteInternship, deleteAchievement } = useData();
  const { internships, achievements } = getStudentData(currentUser?.id || '');

  const [activeTab, setActiveTab] = useState<'internships' | 'achievements'>('internships');
  const [addingInternship, setAddingInternship] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [internForm, setInternForm] = useState({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    expertiseTrack: '' as ExpertiseTrack | ''
  });

  const handleAddInternship = () => {
    if (!internForm.company || !internForm.role) return;
    addInternship({ ...internForm, expertiseTrack: (internForm.expertiseTrack || undefined) as ExpertiseTrack | undefined });
    setInternForm({ company: '', role: '', startDate: '', endDate: '', description: '', expertiseTrack: '' });
    setAddingInternship(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Experience & Achievements</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your professional experiences and academic milestones.</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'internships' ? (
            <button
              onClick={() => setAddingInternship(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add Internship
            </button>
          ) : (
            <button
              onClick={() => setShowAchievementModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add Achievement
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 space-x-8">
        <button
          onClick={() => setActiveTab('internships')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'internships' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Internships ({internships.length})
          {activeTab === 'internships' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" />}
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'achievements' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Achievements ({achievements.length})
          {activeTab === 'achievements' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'internships' ? (
          <motion.div
            key="internships"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            {addingInternship && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg"><Building2 className="w-5 h-5 text-indigo-600" /></div>
                  <h3 className="font-bold text-gray-900 text-lg">New Internship Experience</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Company *</label>
                    <input value={internForm.company} onChange={e => setInternForm(f => ({ ...f, company: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" placeholder="e.g. Google" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Role *</label>
                    <input value={internForm.role} onChange={e => setInternForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" placeholder="e.g. SDE Intern" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                    <input type="date" value={internForm.startDate} onChange={e => setInternForm(f => ({ ...f, startDate: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                    <input type="date" value={internForm.endDate} onChange={e => setInternForm(f => ({ ...f, endDate: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Expertise Track</label>
                    <select value={internForm.expertiseTrack} onChange={e => setInternForm(f => ({ ...f, expertiseTrack: e.target.value as ExpertiseTrack }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none">
                      <option value="">Select track (optional)</option>
                      {ALL_EXPERTISE_TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Brief Description</label>
                    <textarea value={internForm.description} onChange={e => setInternForm(f => ({ ...f, description: e.target.value }))} rows={3}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none outline-none" placeholder="Key responsibilities and achievements..." />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={handleAddInternship} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center">
                    <Save className="w-4 h-4 mr-2" /> Save Experience
                  </button>
                  <button onClick={() => setAddingInternship(false)} className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {internships.length === 0 && !addingInternship ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-100 p-20 text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-10 h-10 text-indigo-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Build your experience profile</h2>
                <p className="text-gray-500 max-w-sm mx-auto mb-8">Add your internship and industrial training experiences to showcase your professional growth.</p>
                <button onClick={() => setAddingInternship(true)} className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-2xl text-base font-bold hover:bg-indigo-50 transition-all">
                  Add Your First Internship
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {internships.map((intern, idx) => (
                  <motion.div key={intern.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-100 transition-all group relative">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-gray-900 leading-tight">{intern.role}</h3>
                          {intern.verified ? (
                            <span className="inline-flex items-center text-[10px] font-black uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              <Clock className="w-3 h-3 mr-1" /> Pending
                            </span>
                          )}
                        </div>
                        <p className="text-indigo-600 font-bold">{intern.company}</p>
                        <div className="flex items-center text-xs text-gray-400 mt-1 mb-3">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          {new Date(intern.startDate).toLocaleDateString()} — {intern.endDate ? new Date(intern.endDate).toLocaleDateString() : 'Present'}
                        </div>
                        {intern.description && <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100/50 mb-3">{intern.description}</p>}
                        {intern.expertiseTrack && (
                          <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 rounded-full text-[11px] font-bold border border-indigo-100">
                            <ChevronRight className="w-3 h-3 mr-1" /> {intern.expertiseTrack}
                          </div>
                        )}
                      </div>
                      <button onClick={() => { if (window.confirm('Remove this experience?')) deleteInternship(intern.id); }}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all absolute top-6 right-6">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-6"
          >
            {achievements.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-100 p-20 text-center">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10 text-amber-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Showcase your milestones</h2>
                <p className="text-gray-500 max-w-sm mx-auto mb-8">Add certificates, hackathon wins, and technical workshops to validate your skills.</p>
                <button onClick={() => setShowAchievementModal(true)} className="px-6 py-3 bg-white border-2 border-amber-500 text-amber-600 rounded-2xl text-base font-bold hover:bg-amber-50 transition-all">
                  Add Your First Achievement
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {achievements.map((achievement, idx) => {
                  const config = CATEGORY_CONFIG[achievement.category];
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`bg-white rounded-2xl border ${config.borderColor} overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col`}
                    >
                      <div className={`px-5 py-3 ${config.bgColor} border-b ${config.borderColor} flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <Award className={`w-4 h-4 ${config.textColor}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${config.textColor}`}>
                            {achievement.category}
                          </span>
                        </div>
                        <button
                          onClick={() => { if (window.confirm('Delete this achievement?')) deleteAchievement(achievement.id); }}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all p-1.5 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">{achievement.title}</h3>
                        {achievement.description && (
                          <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1 italic">"{achievement.description}"</p>
                        )}
                        <div className="mt-auto space-y-3">
                          <div className="flex items-center text-xs text-gray-400 font-medium">
                            <Calendar className="w-3.5 h-3.5 mr-2" />
                            {achievement.date}
                          </div>
                          {achievement.proofUrl && (
                            <div className={`inline-flex items-center text-[10px] font-bold ${config.textColor} ${config.badgeBg} px-2.5 py-1 rounded-lg border ${config.borderColor}`}>
                              <FileText className="w-3 h-3 mr-1.5" /> Proof verified
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {showAchievementModal && (
        <AddAchievementModal onClose={() => setShowAchievementModal(false)} />
      )}
    </div>
  );
};

export default ExperiencePage;
