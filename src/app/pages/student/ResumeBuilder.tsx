import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useParams } from 'react-router';
import { useData } from '../../contexts/DataProvider';
import { Download, FileText, Edit2, Check, Plus, Trash2, Save } from 'lucide-react';

const ResumeBuilder = () => {
  const { studentId } = useParams();
  const {
    currentUser, getStudentData, updateProfile,
    addExperience, addEducation, addSkill,
    deleteExperience, deleteEducation, deleteSkill
  } = useData();

  const targetStudentId = studentId || currentUser?.id || '';
  const { profile, experience, education, skills, projects } = getStudentData(targetStudentId);

  const isOwner = currentUser?.id === targetStudentId && currentUser?.role === 'student';

  const [isEditing, setIsEditing] = useState(false);
  const [editingSummary, setEditingSummary] = useState('');

  useEffect(() => {
    if (profile) {
      setEditingSummary(profile.summary);
    }
  }, [profile]);

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${profile?.name || 'Student'}_Resume`,
  });

  if (!profile) return <div className="p-8 text-center text-gray-500">Profile not found or loading...</div>;

  const saveSummary = () => {
    updateProfile({ summary: editingSummary });
    setIsEditing(false);
  };

  const promptAddExperience = () => {
    const role = window.prompt("Enter Role/Title:");
    if (!role) return;
    const company = window.prompt("Enter Company Name:");
    if (!company) return;
    const startDate = window.prompt("Enter Start Date (e.g. Sep 2023):");
    const description = window.prompt("Enter brief description:");

    addExperience({
      role, company, startDate: startDate || '2023', description: description || '', achievements: []
    });
  };

  const promptAddEducation = () => {
    const institution = window.prompt("Enter Institution Name:");
    if (!institution) return;
    const degree = window.prompt("Enter Degree/Branch:");
    if (!degree) return;
    const startDate = window.prompt("Enter Start Year (e.g. 2020):");
    const endDate = window.prompt("Enter End Year (e.g. 2024):");

    addEducation({
      institution, degree, startDate: startDate || '', endDate: endDate || ''
    });
  };

  const promptAddSkill = () => {
    const name = window.prompt("Enter Skill Name (e.g. React, Python):");
    if (!name) return;
    const categoryPrompt = window.prompt("Enter Category (Frontend, Backend, Tools, Design, Other):", "Other");
    const category = (categoryPrompt as any) || 'Other';

    addSkill({
      name, category, level: 80
    });
  };

  // Health Check Logic
  const healthChecks = [
    {
      passed: !!profile?.summary && profile.summary.length > 50,
      label: "Profile Summary",
      message: "Your summary is too short or missing. Fix by expanding it.",
      action: () => setIsEditing(true)
    },
    {
      passed: projects.some(p => p.demoLink),
      label: "Project Links",
      message: "Add a live demo link to your projects in Project Manager."
    },
    {
      passed: skills.length > 5,
      label: "Skills Count",
      message: "Add more skills to showcase your breadth.",
      action: promptAddSkill
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200 sticky top-0 z-10 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-sm text-gray-500">Preview and export your resume.</p>
        </div>
        <div className="flex gap-3">
          {isOwner && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center px-4 py-2 rounded-md font-medium shadow-sm transition-colors ${isEditing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              {isEditing ? <><Check className="mr-2 h-4 w-4" /> Done Editing</> : <><Edit2 className="mr-2 h-4 w-4" /> Edit Resume</>}
            </button>
          )}
          <button
            onClick={() => handlePrint && handlePrint()}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 shadow-sm"
          >
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Health Check Sidebar */}
        <div className="space-y-6">
          {isOwner && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-indigo-600" /> Resume Health
              </h3>
              <div className="space-y-4">
                {healthChecks.map((check, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${check.passed ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${check.passed ? 'text-green-800' : 'text-amber-800'}`}>{check.label}</span>
                      {check.passed ? (
                        <span className="text-green-600 text-xs font-bold px-2 py-0.5 bg-green-200 rounded-full">PASS</span>
                      ) : (
                        <span className="text-amber-600 text-xs font-bold px-2 py-0.5 bg-amber-200 rounded-full">FIX</span>
                      )}
                    </div>
                    {!check.passed && (
                      <div className="mt-1">
                        <p className="text-xs text-amber-700 mb-2">{check.message}</p>
                        {check.action && (
                          <button
                            onClick={check.action}
                            className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded hover:bg-amber-200"
                          >
                            Fix Issue
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resume A4 Canvas */}
        <div className="lg:col-span-2 flex justify-center bg-gray-500/10 p-8 rounded-xl overflow-auto">
          <div
            ref={componentRef}
            className="bg-white w-[210mm] min-h-[297mm] p-[15mm] shadow-2xl text-gray-800 text-sm leading-normal font-sans mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-4 mb-6">
              <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-900">{profile.name}</h1>
              <div className="text-lg text-gray-600 font-medium mt-1">{profile.headline}</div>
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                <span>{profile.email}</span>
                <span>•</span>
                <span>{profile.location}</span>
                {profile.socials.linkedin && (
                  <>
                    <span>•</span>
                    <span>{profile.socials.linkedin}</span>
                  </>
                )}
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-3 gap-8">
              {/* Left Column (Main) */}
              <div className="col-span-2 space-y-6">
                {/* Summary */}
                <section>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-1 mb-2">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-800">Professional Summary</h2>
                    {isEditing && (
                      <button onClick={saveSummary} className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
                        <Save className="w-3 h-3 mr-1" /> Save
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <textarea
                      className="w-full text-gray-700 text-justify border border-indigo-300 rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      rows={4}
                      value={editingSummary}
                      onChange={(e) => setEditingSummary(e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-700 text-justify">{profile.summary}</p>
                  )}
                </section>

                {/* Experience */}
                <section>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-1 mb-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-800">Experience</h2>
                    {isEditing && (
                      <button onClick={promptAddExperience} className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {experience.map(exp => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-gray-900">{exp.role}</h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap">{exp.startDate} – {exp.endDate || 'Present'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-indigo-700 font-medium text-xs mb-1">{exp.company}</div>
                          {isEditing && (
                            <button onClick={() => deleteExperience(exp.id)} className="text-red-500 hover:text-red-700">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <p className="text-gray-700 mb-1">{exp.description}</p>
                        <ul className="list-disc list-inside text-xs text-gray-600 space-y-0.5">
                          {exp.achievements?.map((ach, i) => <li key={i}>{ach}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Projects */}
                <section>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-800 border-b border-gray-200 pb-1 mb-3">Key Projects</h2>
                  <div className="space-y-3">
                    {projects.filter(p => p.featured).slice(0, 3).map(proj => (
                      <div key={proj.id}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-gray-900">{proj.title}</h3>
                        </div>
                        <div className="text-xs text-gray-500 italic mb-1">{proj.techStack.join(', ')}</div>
                        <p className="text-gray-700">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column (Sidebar) */}
              <div className="space-y-6">
                {/* Education */}
                <section>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-1 mb-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-800">Education</h2>
                    {isEditing && (
                      <button onClick={promptAddEducation} className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {education.map(edu => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                          {isEditing && (
                            <button onClick={() => deleteEducation(edu.id)} className="text-red-500 hover:text-red-700">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <div className="text-xs text-indigo-700">{edu.degree}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{edu.startDate} – {edu.endDate}</div>
                      </div>
                    ))}
                    {/* Fallback if no education added yet since this mock data might be empty for new students */}
                    {education.length === 0 && (
                      <div>
                        <h3 className="font-bold text-gray-900">University</h3>
                        <div className="text-xs text-indigo-700">{profile.branch}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Batch {profile.batch}</div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Skills */}
                <section>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-1 mb-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-800">Skills</h2>
                    {isEditing && (
                      <button onClick={promptAddSkill} className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xs font-bold text-gray-700 mb-1">Technical</h3>
                      <div className="flex flex-wrap gap-1">
                        {skills.filter(s => s.category !== 'Design' && s.category !== 'Other').map(s => (
                          <span key={s.id} className="group relative text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 flex items-center">
                            {s.name}
                            {isEditing && (
                              <button onClick={() => deleteSkill(s.id)} className="ml-1 text-red-500 hover:text-red-700 z-10 cursor-pointer p-0.5">
                                ×
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-700 mb-1">Design & Tools</h3>
                      <div className="flex flex-wrap gap-1">
                        {skills.filter(s => s.category === 'Design' || s.category === 'Tools' || s.category === 'Other').map(s => (
                          <span key={s.id} className="group relative text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 flex items-center">
                            {s.name}
                            {isEditing && (
                              <button onClick={() => deleteSkill(s.id)} className="ml-1 text-red-500 hover:text-red-700 z-10 cursor-pointer p-0.5">
                                ×
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
