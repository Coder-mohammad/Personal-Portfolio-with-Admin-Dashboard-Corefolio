import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import {
  User, UserRole, StudentProfile, Project, Skill, Experience, Education,
  Certification, Achievement, Internship, Message, Evaluation, RubricScore,
  Branch, Course, FacultyAllocation, ExpertiseTrack, StudentExpertise,
  Endorsement, PlacementReadiness, CorefolioData, ALL_EXPERTISE_TRACKS
} from '../types';
import { toast } from 'sonner';

// ─── API Helper ───
const API_BASE = '/api';

const getToken = () => localStorage.getItem('corefolio_token');

const api = async (path: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
};

// ─── Context Type ───
interface DataContextType {
  loading: boolean;
  currentUser: User | null;
  students: StudentProfile[];
  projects: Project[];
  skills: Skill[];
  evaluations: Evaluation[];
  branches: Branch[];
  courses: Course[];
  users: User[];
  allocations: FacultyAllocation[];
  studentExpertise: StudentExpertise[];
  certifications: Certification[];
  achievements: Achievement[];
  internships: Internship[];

  login: (email: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  getVisibleStudents: () => StudentProfile[];
  getAssignedStudents: (facultyId: string) => StudentProfile[];
  canEvaluate: (facultyId: string, studentId: string) => boolean;
  isStudentAllocatedTo: (studentId: string, facultyId: string) => boolean;

  updateProfile: (updated: Partial<StudentProfile>) => Promise<void>;
  togglePublish: (isPublished: boolean) => Promise<void>;
  updateExpertiseTracks: (tracks: ExpertiseTrack[]) => Promise<void>;

  addProject: (project: Omit<Project, 'id' | 'studentId' | 'verified'>) => Promise<void>;
  updateProject: (id: string, updated: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  verifyProject: (projectId: string) => Promise<void>;

  addSkill: (skill: Omit<Skill, 'id' | 'studentId' | 'endorsed'>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  endorseSkill: (skillId: string) => Promise<void>;

  addExperience: (exp: Omit<Experience, 'id' | 'studentId'>) => void;
  deleteExperience: (id: string) => void;
  addEducation: (edu: Omit<Education, 'id' | 'studentId'>) => void;
  deleteEducation: (id: string) => void;

  addAchievement: (a: Omit<Achievement, 'id' | 'studentId'>) => Promise<void>;
  deleteAchievement: (id: string) => Promise<void>;

  addInternship: (i: Omit<Internship, 'id' | 'studentId' | 'verified'>) => Promise<void>;
  deleteInternship: (id: string) => Promise<void>;
  verifyInternship: (id: string) => Promise<void>;

  addEvaluation: (e: Omit<Evaluation, 'id' | 'facultyId' | 'createdAt'>) => Promise<void>;

  addBranch: (b: Omit<Branch, 'id'>) => Promise<void>;
  updateBranch: (id: string, b: Partial<Branch>) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;

  addCourse: (c: Omit<Course, 'id'>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;

  addUser: (u: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, u: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  allocateStudent: (facultyId: string, studentId: string) => Promise<void>;
  deallocateStudent: (allocationId: string) => Promise<void>;

  computeRankings: () => Promise<void>;
  getRankings: (track?: ExpertiseTrack, branchId?: string) => StudentExpertise[];
  getPlacementReadiness: (studentId: string) => PlacementReadiness;

  getStudentData: (studentId: string) => {
    profile: StudentProfile | undefined;
    projects: Project[];
    skills: Skill[];
    experience: Experience[];
    education: Education[];
    achievements: Achievement[];
    internships: Internship[];
    evaluations: Evaluation[];
    endorsements: Endorsement[];
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper: map MongoDB _id to id for frontend
const mapId = (obj: any) => {
  if (!obj) return obj;
  const { _id, __v, ...rest } = obj;
  return { id: _id || obj.id, ...rest };
};
const mapIds = (arr: any[]) => arr.map(mapId);

// ═══════════════════════════════════════════
//  DataProvider Component
// ═══════════════════════════════════════════

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [allocations, setAllocations] = useState<FacultyAllocation[]>([]);
  const [studentExpertise, setStudentExpertise] = useState<StudentExpertise[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  // Local-only state (not persisted)
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);

  const uid = () => Math.random().toString(36).slice(2, 10);

  // ─── Bootstrap: try to restore session from token ───
  useEffect(() => {
    const tryRestore = async () => {
      const token = getToken();
      if (!token) {
        await loadPublicData();
        setLoading(false);
        return;
      }
      try {
        const { user } = await api('/auth/me');
        const mappedUser = mapId(user);
        setCurrentUser(mappedUser);
        await loadData(mappedUser);
      } catch {
        localStorage.removeItem('corefolio_token');
        await loadPublicData();
      }
      setLoading(false);
    };
    tryRestore();
  }, []);

  const loadPublicData = useCallback(async () => {
    try {
      const [studentData, projectData, skillData, achieveData, internData] = await Promise.all([
        api('/students/public/all'),
        api('/projects/public/featured'),
        api('/projects/public/skills'),
        api('/projects/public/achievements'),
        api('/projects/public/internships')
      ]);
      setStudents(mapIds(studentData));
      setProjects(mapIds(projectData));
      setSkills(mapIds(skillData));
      setAchievements(mapIds(achieveData));
      setInternships(mapIds(internData));
    } catch (err: any) {
      console.warn('Load public data error:', err.message);
    }
  }, []);

  const loadData = useCallback(async (user: User) => {
    try {
      const [branchData, allocationData] = await Promise.all([
        api('/branches'), api('/allocations'),
      ]);
      setBranches(mapIds(branchData));
      setAllocations(mapIds(allocationData));

      if (user.role === 'admin') {
        const [userData] = await Promise.all([api('/users')]);
        setUsers(mapIds(userData));
      }

      // Load students
      const studentData = await api('/students');
      setStudents(mapIds(studentData));

      // Load all projects, skills, achievements, internships, evaluations
      const [projData, skillData, achieveData, internData, evalData] = await Promise.all([
        api('/projects'), api('/projects/skills'),
        api('/projects/achievements'), api('/projects/internships'),
        api('/evaluations'),
      ]);
      setProjects(mapIds(projData));
      setSkills(mapIds(skillData));
      setAchievements(mapIds(achieveData));
      setInternships(mapIds(internData));
      setEvaluations(mapIds(evalData));
    } catch (err: any) {
      console.warn('Load data error:', err.message);
    }
  }, []);

  // ─── Real-time Sync (Polling) ───
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      if (currentUser) {
        loadData(currentUser);
      } else {
        loadPublicData();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentUser, loading, loadData, loadPublicData]);


  // ─── Auth ───
  const login = useCallback(async (email: string, role: UserRole): Promise<boolean> => {
    try {
      const { token, user } = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: 'password', role }),
      });
      localStorage.setItem('corefolio_token', token);
      const mappedUser = mapId(user);
      setCurrentUser(mappedUser);
      toast.success(`Welcome, ${mappedUser.name}!`);
      await loadData(mappedUser);
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
      return false;
    }
  }, [loadData]);

  const logout = useCallback(() => {
    localStorage.removeItem('corefolio_token');
    setCurrentUser(null);
    setStudents([]); setProjects([]); setSkills([]);
    setEvaluations([]); setAllocations([]); setUsers([]);
    setAchievements([]); setInternships([]);
    toast.success('Logged out');
  }, []);

  // ─── RBAC Visibility ───
  const getVisibleStudents = useCallback(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return students;
    if (currentUser.role === 'faculty') {
      const ids = allocations.filter(a => a.facultyId === currentUser.id && a.active).map(a => a.studentId);
      return students.filter(s => ids.includes(s.userId || s.id));
    }
    return students.filter(s => s.userId === currentUser.id || s.id === currentUser.id);
  }, [currentUser, students, allocations]);

  const getAssignedStudents = useCallback((facultyId: string) => {
    const ids = allocations.filter(a => a.facultyId === facultyId && a.active).map(a => a.studentId);
    return students.filter(s => ids.includes(s.userId || s.id));
  }, [allocations, students]);

  const canEvaluate = useCallback((facultyId: string, studentId: string) => {
    return allocations.some(a => a.facultyId === facultyId && a.studentId === studentId && a.active);
  }, [allocations]);

  const isStudentAllocatedTo = useCallback((studentId: string, facultyId: string) => {
    return allocations.some(a => a.studentId === studentId && a.facultyId === facultyId && a.active);
  }, [allocations]);

  // ─── Student Actions ───
  const updateProfile = useCallback(async (updated: Partial<StudentProfile>) => {
    if (!currentUser) return;
    const res = await api(`/students/${currentUser.id}`, { method: 'PUT', body: JSON.stringify(updated) });
    setStudents(prev => prev.map(s => (s.userId || s.id) === currentUser.id ? mapId(res) : s));
    toast.success('Profile updated');
  }, [currentUser]);

  const togglePublish = useCallback(async (isPublished: boolean) => {
    await updateProfile({ isPublished });
  }, [updateProfile]);

  const updateExpertiseTracks = useCallback(async (tracks: ExpertiseTrack[]) => {
    await updateProfile({ expertiseTracks: tracks });
  }, [updateProfile]);

  // ─── Project CRUD ───
  const addProject = useCallback(async (project: Omit<Project, 'id' | 'studentId' | 'verified'>) => {
    const res = await api('/projects', { method: 'POST', body: JSON.stringify(project) });
    setProjects(prev => [...prev, mapId(res)]);
    toast.success('Project added');
  }, []);

  const updateProject = useCallback(async (id: string, updated: Partial<Project>) => {
    const res = await api(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(updated) });
    setProjects(prev => prev.map(p => p.id === id ? mapId(res) : p));
    toast.success('Project updated');
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    await api(`/projects/${id}`, { method: 'DELETE' });
    setProjects(prev => prev.filter(p => p.id !== id));
    toast.success('Project deleted');
  }, []);

  const verifyProject = useCallback(async (projectId: string) => {
    const res = await api(`/projects/${projectId}/verify`, { method: 'POST' });
    setProjects(prev => prev.map(p => p.id === projectId ? mapId(res) : p));
    toast.success('Project verified');
  }, []);

  // ─── Skill CRUD ───
  const addSkill = useCallback(async (skill: Omit<Skill, 'id' | 'studentId' | 'endorsed'>) => {
    const res = await api('/projects/skills', { method: 'POST', body: JSON.stringify(skill) });
    setSkills(prev => [...prev, mapId(res)]);
    toast.success('Skill added');
  }, []);

  const deleteSkill = useCallback(async (id: string) => {
    await api(`/projects/skills/${id}`, { method: 'DELETE' });
    setSkills(prev => prev.filter(s => s.id !== id));
  }, []);

  const endorseSkill = useCallback(async (skillId: string) => {
    const res = await api(`/projects/skills/${skillId}/endorse`, { method: 'POST' });
    setSkills(prev => prev.map(s => s.id === skillId ? mapId(res) : s));
    toast.success('Skill endorsed');
  }, []);

  // ─── Experience (local only — no model in backend) ───
  const addExperience = useCallback((exp: Omit<Experience, 'id' | 'studentId'>) => {
    if (!currentUser) return;
    setExperience(prev => [...prev, { ...exp, id: uid(), studentId: currentUser.id } as Experience]);
    toast.success('Experience added');
  }, [currentUser]);

  const deleteExperience = useCallback((id: string) => {
    setExperience(prev => prev.filter(e => e.id !== id));
  }, []);

  // ─── Education (local only — no model in backend) ───
  const addEducation = useCallback((edu: Omit<Education, 'id' | 'studentId'>) => {
    if (!currentUser) return;
    setEducation(prev => [...prev, { ...edu, id: uid(), studentId: currentUser.id } as Education]);
    toast.success('Education added');
  }, [currentUser]);

  const deleteEducation = useCallback((id: string) => {
    setEducation(prev => prev.filter(e => e.id !== id));
  }, []);

  // ─── Achievement CRUD ───
  const addAchievement = useCallback(async (a: Omit<Achievement, 'id' | 'studentId'>) => {
    const res = await api('/projects/achievements', { method: 'POST', body: JSON.stringify(a) });
    setAchievements(prev => [...prev, mapId(res)]);
    toast.success('Achievement added');
  }, []);

  const deleteAchievement = useCallback(async (id: string) => {
    await api(`/projects/achievements/${id}`, { method: 'DELETE' });
    setAchievements(prev => prev.filter(a => a.id !== id));
  }, []);

  // ─── Internship CRUD ───
  const addInternship = useCallback(async (i: Omit<Internship, 'id' | 'studentId' | 'verified'>) => {
    const res = await api('/projects/internships', { method: 'POST', body: JSON.stringify(i) });
    setInternships(prev => [...prev, mapId(res)]);
    toast.success('Internship added');
  }, []);

  const deleteInternship = useCallback(async (id: string) => {
    await api(`/projects/internships/${id}`, { method: 'DELETE' });
    setInternships(prev => prev.filter(i => i.id !== id));
  }, []);

  const verifyInternship = useCallback(async (id: string) => {
    const res = await api(`/projects/internships/${id}/verify`, { method: 'POST' });
    setInternships(prev => prev.map(i => i.id === id ? mapId(res) : i));
    toast.success('Internship verified');
  }, []);

  // ─── Evaluation ───
  const addEvaluation = useCallback(async (e: Omit<Evaluation, 'id' | 'facultyId' | 'createdAt'>) => {
    const res = await api('/evaluations', { method: 'POST', body: JSON.stringify(e) });
    setEvaluations(prev => [...prev, mapId(res)]);
    toast.success('Evaluation submitted');
  }, []);

  // ─── Admin: Branch CRUD ───
  const addBranch = useCallback(async (b: Omit<Branch, 'id'>) => {
    const res = await api('/branches', { method: 'POST', body: JSON.stringify(b) });
    setBranches(prev => [...prev, mapId(res)]);
    toast.success('Branch created');
  }, []);

  const updateBranch = useCallback(async (id: string, b: Partial<Branch>) => {
    const res = await api(`/branches/${id}`, { method: 'PUT', body: JSON.stringify(b) });
    setBranches(prev => prev.map(br => br.id === id ? mapId(res) : br));
    toast.success('Branch updated');
  }, []);

  const deleteBranch = useCallback(async (id: string) => {
    await api(`/branches/${id}`, { method: 'DELETE' });
    setBranches(prev => prev.filter(b => b.id !== id));
    toast.success('Branch deleted');
  }, []);

  // ─── Admin: Course CRUD ───
  const addCourse = useCallback(async (c: Omit<Course, 'id'>) => {
    const res = await api(`/branches/${c.branchId}/courses`, { method: 'POST', body: JSON.stringify(c) });
    setCourses(prev => [...prev, mapId(res)]);
    toast.success('Course added');
  }, []);

  const deleteCourse = useCallback(async (id: string) => {
    await api(`/branches/courses/${id}`, { method: 'DELETE' });
    setCourses(prev => prev.filter(c => c.id !== id));
  }, []);

  // ─── Admin: User CRUD ───
  const addUser = useCallback(async (u: Omit<User, 'id'>) => {
    const res = await api('/users', { method: 'POST', body: JSON.stringify(u) });
    setUsers(prev => [...prev, mapId(res)]);
    toast.success('User created');
  }, []);

  const updateUser = useCallback(async (id: string, u: Partial<User>) => {
    const res = await api(`/users/${id}`, { method: 'PUT', body: JSON.stringify(u) });
    setUsers(prev => prev.map(usr => usr.id === id ? mapId(res) : usr));
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    await api(`/users/${id}`, { method: 'DELETE' });
    setUsers(prev => prev.filter(u => u.id !== id));
    setStudents(prev => prev.filter(s => (s.userId || s.id) !== id));
    toast.success('User deleted');
  }, []);

  // ─── Admin: Allocation ───
  const allocateStudent = useCallback(async (facultyId: string, studentId: string) => {
    const res = await api('/allocations', { method: 'POST', body: JSON.stringify({ facultyId, studentId }) });
    setAllocations(prev => [...prev, mapId(res)]);
    toast.success('Student allocated');
  }, []);

  const deallocateStudent = useCallback(async (allocationId: string) => {
    const res = await api(`/allocations/${allocationId}/deactivate`, { method: 'PUT' });
    setAllocations(prev => prev.map(a => a.id === allocationId ? mapId(res) : a));
    toast.success('Student deallocated');
  }, []);

  // ─── Rankings ───
  const computeRankings = useCallback(async () => {
    try {
      const data = await api('/rankings/compute');
      setStudentExpertise(data.map((r: any, i: number) => ({ ...r, id: `se_${i}` })));
    } catch (err) {
      console.warn('Rankings compute error:', err);
    }
  }, []);

  const getRankings = useCallback((track?: ExpertiseTrack, branchId?: string) => {
    return studentExpertise
      .filter(e => (!track || e.track === track) && (!branchId || (e as any).branchId === branchId))
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [studentExpertise]);

  // ─── Placement Readiness ───
  const getPlacementReadiness = useCallback((studentId: string): PlacementReadiness => {
    const profile = students.find(s => (s.userId || s.id) === studentId);
    const sProjects = projects.filter(p => p.studentId === studentId);
    const sInternships = internships.filter(i => i.studentId === studentId);
    const sAchievements = achievements.filter(a => a.studentId === studentId);
    const sCerts = sAchievements.filter(a => a.category === 'Certification');
    const sEvals = evaluations.filter(e => e.studentId === studentId);

    const portfolioScore = profile?.isPublished ? 100 : (profile?.headline ? 50 : 0);
    const projectScore = Math.min(sProjects.length * 20, 100);
    const internshipScore = Math.min(sInternships.length * 50, 100);
    const certificationScore = Math.min(sCerts.length * 50, 100);
    const facultyScore = sEvals.length > 0 ? Math.min(sEvals.reduce((a, e) => a + e.totalScore, 0) / sEvals.length * (100 / 80), 100) : 0;
    const resumeScore = (profile?.summary && sProjects.length > 0) ? 30 : 0;

    const overallIndex = Math.round((portfolioScore + projectScore + internshipScore + certificationScore + facultyScore + resumeScore) / 6);

    return { portfolioScore, projectScore, internshipScore, certificationScore, facultyScore, resumeScore, overallIndex } as PlacementReadiness;
  }, [students, projects, internships, achievements, evaluations]);

  // ─── Helper ───
  const getStudentData = useCallback((studentId: string) => {
    return {
      profile: students.find(s => (s.userId || s.id) === studentId),
      projects: projects.filter(p => p.studentId === studentId),
      skills: skills.filter(s => s.studentId === studentId),
      experience: experience.filter(e => (e as any).studentId === studentId),
      education: education.filter(e => (e as any).studentId === studentId),
      achievements: achievements.filter(a => a.studentId === studentId),
      internships: internships.filter(i => i.studentId === studentId),
      evaluations: evaluations.filter(e => e.studentId === studentId),
      endorsements: [] as Endorsement[],
    };
  }, [students, projects, skills, experience, education, achievements, internships, evaluations]);

  const value: DataContextType = useMemo(() => ({
    loading, currentUser, students, projects, skills, evaluations, branches,
    courses, users, allocations, studentExpertise, certifications: [],
    achievements, internships,
    login, logout, getVisibleStudents, getAssignedStudents, canEvaluate,
    isStudentAllocatedTo, updateProfile, togglePublish, updateExpertiseTracks,
    addProject, updateProject, deleteProject, verifyProject,
    addSkill, deleteSkill, endorseSkill,
    addExperience, deleteExperience, addEducation, deleteEducation,
    addAchievement, deleteAchievement,
    addInternship, deleteInternship, verifyInternship,
    addEvaluation, addBranch, updateBranch, deleteBranch,
    addCourse, deleteCourse, addUser, updateUser, deleteUser,
    allocateStudent, deallocateStudent,
    computeRankings, getRankings, getPlacementReadiness, getStudentData,
  }), [loading, currentUser, students, projects, skills, evaluations, branches,
    courses, users, allocations, studentExpertise, achievements, internships,
    login, logout, getVisibleStudents, getAssignedStudents, canEvaluate,
    isStudentAllocatedTo, updateProfile, togglePublish, updateExpertiseTracks,
    addProject, updateProject, deleteProject, verifyProject,
    addSkill, deleteSkill, endorseSkill,
    addExperience, deleteExperience, addEducation, deleteEducation,
    addAchievement, deleteAchievement,
    addInternship, deleteInternship, verifyInternship,
    addEvaluation, addBranch, updateBranch, deleteBranch,
    addCourse, deleteCourse, addUser, updateUser, deleteUser,
    allocateStudent, deallocateStudent,
    computeRankings, getRankings, getPlacementReadiness, getStudentData,
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
