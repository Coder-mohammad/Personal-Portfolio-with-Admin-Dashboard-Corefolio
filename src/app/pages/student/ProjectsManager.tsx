import React from 'react';
import { useData } from '../../contexts/DataProvider';
import { Link } from 'react-router';
import { Plus, Edit2, Trash2, Briefcase } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { motion } from 'motion/react';

const ProjectsManager = () => {
  const { currentUser, getStudentData, deleteProject } = useData();
  const { projects } = getStudentData(currentUser?.id || '');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Add and manage your portfolio projects.</p>
        </div>
        <Link
          to="/dashboard/student/projects/new"
          className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Projects Yet</h2>
          <p className="text-gray-500 mb-6">Add your first project to showcase your work!</p>
          <Link
            to="/dashboard/student/projects/new"
            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md transition-all"
          >
            <Plus className="mr-2 h-4 w-4" /> Add First Project
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tech Stack</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Visibility</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {projects.map((project, idx) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-indigo-50/30 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-sm">
                        <ImageWithFallback src={project.imageUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{project.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{project.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.slice(0, 3).map((tech, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700">
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="text-xs text-gray-500">+{project.techStack.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {project.featured ? (
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-200">
                        ⭐ Featured
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-lg bg-gray-50 text-gray-600 border border-gray-200">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-1">
                      <Link
                        to={`/dashboard/student/projects/edit/${project.id}`}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this project?')) {
                            deleteProject(project.id);
                          }
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
