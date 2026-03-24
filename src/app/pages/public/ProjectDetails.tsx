import React from 'react';
import { useParams, Link } from 'react-router';
import { useData } from '../../contexts/DataProvider';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Github, ExternalLink, ArrowLeft, CheckCircle } from 'lucide-react';

const ProjectDetails = () => {
  const { id, projectId } = useParams(); // Student ID and Project ID
  const { getStudentData } = useData();
  const { projects } = getStudentData(id || '');
  
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900">Project Not Found</h2>
        <Link to={`/student/${id}`} className="mt-4 text-indigo-600 hover:underline">Back to Portfolio</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link to={`/student/${id}`} className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="w-full h-64 md:h-96 relative">
          <ImageWithFallback 
             src={project.imageUrl} 
             alt={project.title} 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
             <div className="p-8 w-full">
               <h1 className="text-4xl font-bold text-white mb-2">{project.title}</h1>
               <div className="flex flex-wrap gap-2">
                 {project.techStack.map(tech => (
                   <span key={tech} className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30">
                     {tech}
                   </span>
                 ))}
               </div>
             </div>
           </div>
        </div>

        <div className="p-8 grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {project.detailedDescription || project.description}
              </p>
            </div>

            {project.outcomes && project.outcomes.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Key Outcomes</h2>
                <ul className="space-y-3">
                  {project.outcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Project Links</h3>
              <div className="space-y-3">
                {project.demoLink ? (
                  <a 
                    href={project.demoLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                  </a>
                ) : (
                   <div className="text-sm text-gray-500 italic">No live demo available</div>
                )}
                
                {project.repoLink ? (
                  <a 
                    href={project.repoLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Github className="mr-2 h-4 w-4" /> View Code
                  </a>
                ) : (
                  <div className="text-sm text-gray-500 italic">No repository available</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
