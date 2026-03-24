import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../../contexts/DataProvider';
import { StudentProfile } from '../../types';
import { Save } from 'lucide-react';

const ProfileEditor = () => {
  const { currentUser, students, updateProfile, togglePublish } = useData();

  const currentProfile = students.find(s => (s.userId || s.id) === currentUser?.id);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<StudentProfile>({
    defaultValues: currentProfile
  });

  useEffect(() => {
    if (currentProfile) {
      reset(currentProfile);
    }
  }, [currentProfile, reset]);

  const onSubmit = (data: StudentProfile) => {
    updateProfile(data);
  };

  if (!currentProfile) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your personal information and portfolio visibility.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
          <span className={`text-sm font-semibold ${currentProfile.isPublished ? 'text-green-600' : 'text-gray-500'}`}>
            {currentProfile.isPublished ? '🟢 Portfolio is Live' : '⬤ Portfolio is Hidden'}
          </span>
          <button
            onClick={() => togglePublish(!currentProfile.isPublished)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${currentProfile.isPublished ? 'bg-indigo-600' : 'bg-gray-200'}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${currentProfile.isPublished ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-sm rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input
                {...register("name")}
                className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Headline</label>
              <input
                {...register("headline")}
                placeholder="e.g. Full Stack Developer"
                className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Branch / Major</label>
              <input
                {...register("branch")}
                className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Batch Year</label>
                <input
                  {...register("batch")}
                  className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section</label>
                <input
                  {...register("section")}
                  className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                {...register("email")}
                className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
              <input
                {...register("location")}
                className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Professional Summary</label>
            <textarea
              {...register("summary")}
              rows={4}
              className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all resize-none"
              placeholder="Briefly describe your skills and career goals..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Avatar URL</label>
            <input
              {...register("avatarUrl")}
              className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
            />
            <p className="mt-1 text-xs text-gray-500">Use a direct image link (e.g., Unsplash or GitHub avatar).</p>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">GitHub URL</label>
                <input {...register("socials.github")} className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">LinkedIn URL</label>
                <input {...register("socials.linkedin")} className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all" />
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none transition-all active:scale-[0.98]"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;
