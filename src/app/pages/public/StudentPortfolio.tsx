import React from 'react';
import { useParams, Link } from 'react-router';
import { useData } from '../../contexts/DataProvider';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import {
  ArrowLeft, ExternalLink, Github, Linkedin, Mail, MapPin, Calendar, Briefcase, GraduationCap, Code2, Award, CheckCircle
} from 'lucide-react';
import { motion } from 'motion/react';

const StudentPortfolio = () => {
  const { id } = useParams();
  const { getStudentData } = useData();
  const { profile, projects, skills, experience, education, achievements, internships } = getStudentData(id || '');

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-bold text-gray-900">Student Not Found</p>
        <Link to="/" className="text-indigo-600 hover:underline text-sm mt-2 inline-block">← Back to Directory</Link>
      </div>
    );
  }

  if (!profile.isPublished) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-bold text-gray-900">This portfolio is private</p>
        <Link to="/" className="text-indigo-600 hover:underline text-sm mt-2 inline-block">← Back to Directory</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero / Profile Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 relative z-10">
          <Link to="/" className="inline-flex items-center text-blue-200 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Directory
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="h-28 w-28 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl flex-shrink-0">
              <ImageWithFallback src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{profile.name}</h1>
              <p className="text-lg text-blue-200 mt-1">{profile.headline}</p>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-sm rounded-full border border-white/20">
                  <GraduationCap className="w-3.5 h-3.5 inline-block mr-1" /> {profile.branch}
                </span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-sm rounded-full border border-white/20">
                  <Calendar className="w-3.5 h-3.5 inline-block mr-1" /> Batch {profile.batch}
                </span>
                {profile.location && (
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-sm rounded-full border border-white/20">
                    <MapPin className="w-3.5 h-3.5 inline-block mr-1" /> {profile.location}
                  </span>
                )}
              </div>
              <div className="flex gap-3 mt-4">
                {profile.socials.github && <a href={profile.socials.github} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"><Github className="w-5 h-5" /></a>}
                {profile.socials.linkedin && <a href={profile.socials.linkedin} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"><Linkedin className="w-5 h-5" /></a>}
                <a href={`mailto:${profile.email}`} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"><Mail className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Summary */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" /> About
          </h2>
          <p className="text-gray-600 leading-relaxed pl-4">{profile.summary}</p>
        </motion.section>

        {/* Projects */}
        {projects.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" /> Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  <Link
                    to={`/student/${id}/project/${project.id}`}
                    className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-indigo-100 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="h-44 w-full bg-gray-100 overflow-hidden">
                      <ImageWithFallback
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{project.title}</h3>
                        {project.featured && <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-lg font-semibold border border-yellow-200">⭐ Featured</span>}
                      </div>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.techStack.map(t => (
                          <span key={t} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg font-medium">{t}</span>
                        ))}
                      </div>
                      <p className="text-indigo-500 text-sm mt-4 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                        View Details <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" /> Skills
            </h2>
            <div className="flex flex-wrap gap-2 pl-4">
              {skills.map(skill => (
                <span key={skill.id} className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 hover:border-indigo-200 hover:bg-indigo-50 transition-colors">
                  <Code2 className="w-3.5 h-3.5 inline-block mr-1 text-indigo-500" /> {skill.name}
                </span>
              ))}
            </div>
          </motion.section>
        )}

        {/* Experience & Internships */}
        {(experience.length > 0 || internships.length > 0) && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" /> Experience & Internships
            </h2>
            <div className="space-y-6 pl-4">
              {internships.map(intern => (
                <div key={intern.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{intern.role}</h3>
                        <p className="text-indigo-600 font-semibold">{intern.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-400 block">{intern.startDate} - {intern.endDate || 'Present'}</span>
                      {intern.verified && (
                        <span className="inline-flex items-center text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200 mt-2">
                          <CheckCircle className="w-3 h-3 mr-1" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                  {intern.description && <p className="text-gray-600 text-sm leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100">{intern.description}</p>}
                </div>
              ))}
              {experience.map(exp => (
                <div key={exp.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{exp.role}</h3>
                        <p className="text-indigo-600 font-semibold">{exp.company}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-400">{exp.startDate} - {exp.endDate || 'Present'}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Achievements & Awards */}
        {achievements.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" /> Achievements & Awards
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 pl-4">
              {achievements.map(ach => (
                <div key={ach.id} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col hover:shadow-lg transition-all border-l-4 border-l-indigo-500">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-indigo-50 rounded-lg">
                      <Award className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">{ach.category}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 leading-tight">{ach.title}</h3>
                  {ach.description && <p className="text-sm text-gray-600 flex-1 line-clamp-3 mb-4">{ach.description}</p>}
                  <div className="mt-auto text-xs text-gray-400 font-medium flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    {ach.date}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" /> Education
            </h2>
            <div className="space-y-4 pl-4">
              {education.map(edu => (
                <div key={edu.id} className="bg-white rounded-xl border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-indigo-600 text-sm font-medium">{edu.institution}</p>
                  <p className="text-xs text-gray-400 mt-1">{edu.startDate} - {edu.endDate}</p>
                  {edu.grade && <p className="text-sm text-gray-600 mt-2">Grade: {edu.grade}</p>}
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default StudentPortfolio;
