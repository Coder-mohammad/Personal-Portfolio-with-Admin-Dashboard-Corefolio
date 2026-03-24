import React from 'react';
import { Link } from 'react-router';
import { useData } from '../../contexts/DataProvider';
import { Search, MapPin, Briefcase, Sparkles, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { motion } from 'motion/react';
import { Hero } from '../../components/ui/animated-hero';

const LandingPage = () => {
  const { students, projects, skills } = useData();
  const [searchTerm, setSearchTerm] = React.useState('');

  // Filter for published students only
  const publishedStudents = students.filter(s => s.isPublished);

  const filteredStudents = publishedStudents.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100">
        <Hero />

        {/* Search Bar - Moved below animated hero and styled to fit */}
        <div className="max-w-xl mx-auto pb-12 px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm text-base"
              placeholder="Search students by name, branch, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
        </div>
      </div>

      {/* Student Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Portfolios</h2>
            <p className="text-sm text-gray-500 mt-1">{filteredStudents.length} students found</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student, idx) => {
            // Fix: Match against student.userId for projects and skills
            const studentProjects = projects.filter(p => p.studentId === (student.userId || student.id) && p.featured);
            const studentSkills = skills.filter(s => s.studentId === (student.userId || student.id)).slice(0, 3);

            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link
                  to={`/student/${student.userId || student.id}`}
                  className="group block bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-indigo-50 flex-shrink-0 shadow-md">
                        <ImageWithFallback src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{student.name}</h3>
                        <p className="text-sm text-indigo-600 font-medium truncate">{student.headline}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-0.5">
                          <MapPin className="w-3 h-3 mr-1" /> {student.location || 'Campus'}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
                      {student.summary}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] uppercase tracking-wider rounded-lg font-bold">{student.branch}</span>
                      <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-[10px] uppercase tracking-wider rounded-lg font-bold">Batch {student.batch}</span>
                    </div>

                    {studentSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-auto border-t border-gray-50 pt-4">
                        {studentSkills.map(skill => (
                          <span key={skill.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700">
                            {skill.name}
                          </span>
                        ))}
                        {skills.filter(s => s.studentId === (student.userId || student.id)).length > 3 && (
                          <span className="text-[10px] text-gray-400 font-medium self-center">
                            +{skills.filter(s => s.studentId === (student.userId || student.id)).length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Mini Project Preview */}
                  {studentProjects.length > 0 && (
                    <div className="bg-gradient-to-r from-gray-50 to-indigo-50/50 px-6 py-4 border-t border-gray-100 mt-auto">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center">
                        <Briefcase className="w-3 h-3 mr-1" /> Featured Project
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0">
                          <div className="h-10 w-14 rounded-lg bg-gray-200 overflow-hidden mr-3 shadow-sm flex-shrink-0">
                            <ImageWithFallback src={studentProjects[0].imageUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 truncate">{studentProjects[0].title}</p>
                            <p className="text-xs text-gray-500 truncate">{studentProjects[0].techStack.slice(0, 2).join(', ')}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
                      </div>
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No students found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
