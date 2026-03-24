import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';
import { useData } from '../../contexts/DataProvider';
import { Project } from '../../types';
import { Save, ArrowLeft } from 'lucide-react';

const ProjectEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, getStudentData, addProject, updateProject } = useData();
  const { projects } = getStudentData(currentUser?.id || '');

  const isEditing = !!id;

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<Project>({
    defaultValues: {
      techStack: [],
      outcomes: [],
      featured: false,
      status: 'published'
    }
  });

  // Local state for the tech stack input to avoid infinite re-renders
  const [techStackInput, setTechStackInput] = useState('');

  useEffect(() => {
    if (isEditing) {
      const project = projects.find(p => p.id === id);
      if (project) {
        reset(project);
        setTechStackInput(project.techStack.join(', '));
      }
    }
  }, [id, isEditing]); // Removed projects/reset from deps to prevent loop

  const onSubmit = (data: Project) => {
    const parsedTechStack = techStackInput.split(',').map(s => s.trim()).filter(Boolean);
    const formattedData = {
      ...data,
      techStack: parsedTechStack,
      outcomes: data.outcomes ? data.outcomes.filter(Boolean) : []
    };

    if (isEditing && id) {
      updateProject(id, formattedData);
    } else {
      addProject(formattedData);
    }
    navigate('/dashboard/student/projects');
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <button
        onClick={() => navigate('/dashboard/student/projects')}
        className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Project' : 'Add New Project'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Project Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2.5"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Short Description</label>
              <input
                {...register("description", { required: "Description is required" })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2.5"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Detailed Overview</label>
              <textarea
                {...register("detailedDescription")}
                rows={5}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2.5"
                placeholder="Deep dive into the project..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                {...register("imageUrl", { required: "Image URL is required" })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2.5"
              />
            </div>

            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                {...register("featured")}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">Featured Project (Pin to top)</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Demo Link</label>
              <input
                {...register("demoLink")}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Repository Link</label>
              <input
                {...register("repoLink")}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tech Stack (Comma separated)</label>
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2.5"
              placeholder="React, TypeScript, Node.js"
            />
            <p className="mt-1 text-xs text-gray-500">Current: {techStackInput || 'None'}</p>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectEditor;
