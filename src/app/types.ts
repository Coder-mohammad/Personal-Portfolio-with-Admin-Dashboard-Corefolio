// ═══════════════════════════════════════════
//  COREFOLIO — Complete Type Definitions
// ═══════════════════════════════════════════

// ── Roles ──
export type UserRole = 'student' | 'faculty' | 'admin';
export const ALL_USER_ROLES: UserRole[] = ['student', 'faculty', 'admin'];

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  branchId?: string; // Links faculty to a branch
}

// ── Organization ──
export interface Branch {
  id: string;
  name: string;        // "Computer Science"
  code: string;        // "CSE"
  department: string;  // "Engineering"
}

export interface Course {
  id: string;
  branchId: string;
  name: string;
  code: string;
  semester: number;
}

// ── Faculty–Student Allocation ──
export interface FacultyAllocation {
  id: string;
  facultyId: string;
  studentId: string;
  assignedBy: string;   // admin user id
  assignedAt: string;
  active: boolean;
}

// ── Expertise Tracks ──
export type ExpertiseTrack =
  | 'Software Development'
  | 'Core Engineering'
  | 'Data / AI / Analytics'
  | 'Research & Higher Studies'
  | 'Management / Consulting';

export const ALL_EXPERTISE_TRACKS: ExpertiseTrack[] = [
  'Software Development',
  'Core Engineering',
  'Data / AI / Analytics',
  'Research & Higher Studies',
  'Management / Consulting',
];

export interface StudentExpertise {
  id: string;
  studentId: string;
  track: ExpertiseTrack;
  autoScore: number;
  facultyBoost: number;
  totalScore: number;
  rank?: number;
}

// ── Student Profile ──
export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  headline: string;
  summary: string;
  email: string;
  phone?: string;
  location?: string;
  avatarUrl: string;
  resumeUrl?: string;
  branch: string;       // e.g., "Computer Science"
  branchId: string;     // → Branch.id
  batch: string;
  section?: string;
  gpa?: number;         // Academic GPA (0-10)
  isPublished: boolean;
  expertiseTracks: ExpertiseTrack[];
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

// ── Projects ──
export interface Project {
  id: string;
  studentId: string;
  title: string;
  description: string;
  detailedDescription?: string;
  techStack: string[];
  imageUrl: string;
  demoLink?: string;
  repoLink?: string;
  featured: boolean;
  outcomes?: string[];
  status: 'draft' | 'published';
  verified: boolean;
  verifiedBy?: string; // faculty id
  expertiseTrack?: ExpertiseTrack;
}

// ── Skills ──
export interface Skill {
  id: string;
  studentId: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Tools' | 'Design' | 'Other';
  level?: number;
  endorsed: boolean;
  endorsedBy?: string;
}

// ── Experience ──
export interface Experience {
  id: string;
  studentId: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements: string[];
}

// ── Internship ──
export interface Internship {
  id: string;
  studentId: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  expertiseTrack?: ExpertiseTrack;
  verified: boolean;
  verifiedBy?: string;
}

// ── Education ──
export interface Education {
  id: string;
  studentId: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  grade?: string;
  description?: string;
}

// ── Certifications ──
export interface Certification {
  id: string;
  studentId: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
  expertiseTrack?: ExpertiseTrack;
}

// ── Achievements ──
export interface Achievement {
  id: string;
  studentId: string;
  category: 'Certification' | 'Hackathon' | 'Workshop';
  title: string;
  date: string;
  description?: string;
  proofUrl?: string;
}

// ── Faculty Endorsements ──
export interface Endorsement {
  id: string;
  facultyId: string;
  studentId: string;
  targetType: 'project' | 'skill' | 'portfolio';
  targetId: string;
  comment: string;
  rating: number; // 1-5
  createdAt: string;
}

// ── Messages ──
export interface Message {
  id: string;
  studentId: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  date: string;
  read: boolean;
}

// ── Faculty Evaluations ──
export interface RubricScore {
  innovation: number;
  complexity: number;
  uiux: number;
  backend: number;
  database: number;
  deployment: number;
  documentation: number;
  codeQuality: number;
}

export interface Evaluation {
  id: string;
  facultyId: string;
  studentId: string;
  projectId?: string;
  scores: RubricScore;
  totalScore: number;
  comments: string;
  status: 'Approved' | 'Needs Improvement';
  createdAt: string;
}

// ── Placement Readiness ──
export interface PlacementReadiness {
  studentId: string;
  portfolioScore: number;
  resumeScore: number;
  projectScore: number;
  certificationScore: number;
  internshipScore: number;
  facultyScore: number;
  overallIndex: number;
}

// ── Context State Interface ──
export interface CorefolioData {
  currentUser: User | null;
  students: StudentProfile[];
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
  internships: Internship[];
  messages: Message[];
  evaluations: Evaluation[];
  branches: Branch[];
  courses: Course[];
  allocations: FacultyAllocation[];
  users: User[];
  endorsements: Endorsement[];
  studentExpertise: StudentExpertise[];
}
