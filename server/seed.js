import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Branch from './models/Branch.js';
import StudentProfile from './models/StudentProfile.js';
import Project from './models/Project.js';
import Skill from './models/Skill.js';
import Achievement from './models/Achievement.js';
import Internship from './models/Internship.js';
import Allocation from './models/Allocation.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/corefolio');
    console.log('✅ Connected to MongoDB');

    // Clear all collections
    await Promise.all([
      User.deleteMany({}), Branch.deleteMany({}), StudentProfile.deleteMany({}),
      Project.deleteMany({}), Skill.deleteMany({}), Achievement.deleteMany({}),
      Internship.deleteMany({}), Allocation.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // ── Branches ──
    const branches = await Branch.insertMany([
      { name: 'Computer Science', code: 'CSE', department: 'Engineering' },
      { name: 'Electrical Engineering', code: 'EEE', department: 'Engineering' },
      { name: 'Mechanical Engineering', code: 'ME', department: 'Engineering' },
      { name: 'Information Technology', code: 'IT', department: 'Engineering' },
    ]);
    console.log(`📁 Created ${branches.length} branches`);

    // ── Users ──
    const admin = await User.create({
      name: 'System Admin', email: 'admin@corefolio.com',
      password: 'password', role: 'admin', branchId: branches[0]._id,
    });

    const faculty = await User.create({
      name: 'Prof. Singh', email: 'faculty@corefolio.com',
      password: 'password', role: 'faculty', branchId: branches[0]._id,
    });

    const faculty2 = await User.create({
      name: 'Dr. Sharma', email: 'faculty2@corefolio.com',
      password: 'password', role: 'faculty', branchId: branches[1]._id,
    });

    const student1 = await User.create({ name: 'Mohammad Daulah', email: 'mohammad@corefolio.com', password: 'password', role: 'student', branchId: branches[0]._id });
    const student2 = await User.create({ name: 'Priya Patel', email: 'priya@corefolio.com', password: 'password', role: 'student', branchId: branches[0]._id });
    const student3 = await User.create({ name: 'Rahul Verma', email: 'rahul@corefolio.com', password: 'password', role: 'student', branchId: branches[1]._id });
    const student4 = await User.create({ name: 'Ananya Iyer', email: 'ananya@corefolio.com', password: 'password', role: 'student', branchId: branches[0]._id });
    const student5 = await User.create({ name: 'Vikram Malhotra', email: 'vikram@corefolio.com', password: 'password', role: 'student', branchId: branches[3]._id });
    const student6 = await User.create({ name: 'Sanya Gupta', email: 'sanya@corefolio.com', password: 'password', role: 'student', branchId: branches[0]._id });
    const student7 = await User.create({ name: 'Arjun Reddy', email: 'arjun@corefolio.com', password: 'password', role: 'student', branchId: branches[2]._id });
    const student8 = await User.create({ name: 'Ishita Kapoor', email: 'ishita@corefolio.com', password: 'password', role: 'student', branchId: branches[1]._id });
    const student9 = await User.create({ name: 'Ravi Kiran', email: 'ravi@corefolio.com', password: 'password', role: 'student', branchId: branches[0]._id });
    const student10 = await User.create({ name: 'Meera Nair', email: 'meera@corefolio.com', password: 'password', role: 'student', branchId: branches[3]._id });
    const student11 = await User.create({ name: 'Aditya Joshi', email: 'aditya@corefolio.com', password: 'password', role: 'student', branchId: branches[0]._id });
    const student12 = await User.create({ name: 'Kavya Singh', email: 'kavya@corefolio.com', password: 'password', role: 'student', branchId: branches[2]._id });
    const student13 = await User.create({ name: 'Siddharth Rao', email: 'sid@corefolio.com', password: 'password', role: 'student', branchId: branches[0]._id });
    const student14 = await User.create({ name: 'Neha Deshmukh', email: 'neha@corefolio.com', password: 'password', role: 'student', branchId: branches[1]._id });
    const student15 = await User.create({ name: 'Abhinav Saxena', email: 'abhinav@corefolio.com', password: 'password', role: 'student', branchId: branches[3]._id });

    console.log('👤 Created 18 users (admin, 2 faculty, 15 students)');

    // ── Student Profiles ──
    const profilesData = [
      { userId: student1._id, name: 'Mohammad Daulah', email: 'mohammad@corefolio.com', headline: 'Full-Stack Developer & ML Enthusiast', summary: 'B.Tech CSE student passionate about building impactful web applications and exploring machine learning.', branch: 'Computer Science', branchId: branches[0]._id, batch: '2022', section: 'A', gpa: 8.5, isPublished: true, avatarUrl: '/images/profiles/male1.png', expertiseTracks: ['Software Development', 'Data / AI / Analytics'], socials: { github: 'github.com/mohammad', linkedin: 'linkedin.com/in/mohammad' } },
      { userId: student2._id, name: 'Priya Patel', email: 'priya@corefolio.com', headline: 'UI/UX Designer & Frontend Developer', summary: 'Creative CSE student focused on design systems and user experience.', branch: 'Computer Science', branchId: branches[0]._id, batch: '2022', section: 'B', gpa: 9.0, isPublished: true, avatarUrl: '/images/profiles/female1.png', expertiseTracks: ['Software Development'], socials: { linkedin: 'linkedin.com/in/priya' } },
      { userId: student3._id, name: 'Rahul Verma', email: 'rahul@corefolio.com', headline: 'Embedded Systems & IoT Developer', summary: 'EEE student interested in automation and low-level programming.', branch: 'Electrical Engineering', branchId: branches[1]._id, batch: '2022', section: 'A', gpa: 7.8, isPublished: true, avatarUrl: '/images/profiles/male2.png', expertiseTracks: ['Core Engineering'], socials: {} },
      { userId: student4._id, name: 'Ananya Iyer', email: 'ananya@corefolio.com', headline: 'Cloud Architect & DevOps Engineer', summary: 'CSE student specializing in AWS, Docker, and Kubernetes.', branch: 'Computer Science', branchId: branches[0]._id, batch: '2023', section: 'C', gpa: 9.2, isPublished: true, avatarUrl: '/images/profiles/female2.png', expertiseTracks: ['Software Development', 'Management / Consulting'], socials: { github: 'github.com/ananya' } },
      { userId: student5._id, name: 'Vikram Malhotra', email: 'vikram@corefolio.com', headline: 'Data Scientist & AI Researcher', summary: 'IT student with a deep interest in natural language processing and computer vision.', branch: 'Information Technology', branchId: branches[3]._id, batch: '2022', section: 'B', gpa: 8.8, isPublished: true, avatarUrl: '/images/profiles/male3.png', expertiseTracks: ['Data / AI / Analytics', 'Research & Higher Studies'], socials: { github: 'github.com/vikram' } },
      { userId: student6._id, name: 'Sanya Gupta', email: 'sanya@corefolio.com', headline: 'Cybersecurity Analyst', summary: 'Focusing on ethical hacking, network security, and cryptography.', branch: 'Computer Science', branchId: branches[0]._id, batch: '2022', section: 'A', gpa: 8.4, isPublished: true, avatarUrl: '/images/profiles/female3.png', expertiseTracks: ['Software Development'], socials: { linkedin: 'linkedin.com/in/sanya' } },
      { userId: student7._id, name: 'Arjun Reddy', email: 'arjun@corefolio.com', headline: 'Mechanical Designer & Robotics Enthusiast', summary: 'ME student specializing in CAD design and robotic arm kinematics.', branch: 'Mechanical Engineering', branchId: branches[2]._id, batch: '2024', section: 'A', gpa: 7.5, isPublished: true, avatarUrl: '/images/profiles/male1.png', expertiseTracks: ['Core Engineering'], socials: {} },
      { userId: student8._id, name: 'Ishita Kapoor', email: 'ishita@corefolio.com', headline: 'Power Systems Engineer', summary: 'Electrical engineering student focused on renewable energy integration.', branch: 'Electrical Engineering', branchId: branches[1]._id, batch: '2023', section: 'B', gpa: 8.1, isPublished: true, avatarUrl: '/images/profiles/female1.png', expertiseTracks: ['Core Engineering', 'Research & Higher Studies'] },
      { userId: student9._id, name: 'Ravi Kiran', email: 'ravi@corefolio.com', headline: 'Mobile App Developer', summary: 'CSE student building cross-platform apps using Flutter.', branch: 'Computer Science', branchId: branches[0]._id, batch: '2022', section: 'C', gpa: 8.0, isPublished: true, avatarUrl: '/images/profiles/male2.png', expertiseTracks: ['Software Development'] },
      { userId: student10._id, name: 'Meera Nair', email: 'meera@corefolio.com', headline: 'Product Manager Aspirant', summary: 'IT student with a focus on product strategy and data-driven decisions.', branch: 'Information Technology', branchId: branches[3]._id, batch: '2023', section: 'A', gpa: 8.7, isPublished: true, avatarUrl: '/images/profiles/female2.png', expertiseTracks: ['Management / Consulting'] },
      { userId: student11._id, name: 'Aditya Joshi', email: 'aditya@corefolio.com', headline: 'Backend Engineer', summary: 'Specializing in high-performance distributed systems.', branch: 'Computer Science', branchId: branches[0]._id, batch: '2022', section: 'B', gpa: 8.9, isPublished: true, avatarUrl: '/images/profiles/male3.png', expertiseTracks: ['Software Development'] },
      { userId: student12._id, name: 'Kavya Singh', email: 'kavya@corefolio.com', headline: 'Automotive Engineer', summary: 'ME student with a passion for electric vehicle technology.', branch: 'Mechanical Engineering', branchId: branches[2]._id, batch: '2023', section: 'C', gpa: 8.3, isPublished: true, avatarUrl: '/images/profiles/female3.png', expertiseTracks: ['Core Engineering'] },
      { userId: student13._id, name: 'Siddharth Rao', email: 'sid@corefolio.com', headline: 'Game Developer', summary: 'CSE student crafting immersive experiences in Unity.', branch: 'Computer Science', branchId: branches[0]._id, batch: '2024', section: 'B', gpa: 7.9, isPublished: true, avatarUrl: '/images/profiles/male1.png', expertiseTracks: ['Software Development'] },
      { userId: student14._id, name: 'Neha Deshmukh', email: 'neha@corefolio.com', headline: 'Control Systems Researcher', summary: 'Electrical Engineering student working on smart grid optimization.', branch: 'Electrical Engineering', branchId: branches[1]._id, batch: '2022', section: 'A', gpa: 9.1, isPublished: true, avatarUrl: '/images/profiles/female1.png', expertiseTracks: ['Research & Higher Studies'] },
      { userId: student15._id, name: 'Abhinav Saxena', email: 'abhinav@corefolio.com', headline: 'Blockchain Developer', summary: 'Exploring decentralized applications and smart contract security.', branch: 'Information Technology', branchId: branches[3]._id, batch: '2023', section: 'B', gpa: 8.6, isPublished: true, avatarUrl: '/images/profiles/male2.png', expertiseTracks: ['Software Development'] },
    ];
    const profiles = await StudentProfile.insertMany(profilesData);
    console.log(`📋 Created ${profiles.length} student profiles`);

    // ── Projects ──
    const projectsData = [
      { studentId: student1._id, title: 'Corefolio Platform', description: 'A full-stack portfolio platform with RBAC.', techStack: ['React', 'Express', 'MongoDB'], status: 'published', verified: true, verifiedBy: faculty._id, expertiseTrack: 'Software Development', featured: true, imageUrl: '/images/projects/saas.png' },
      { studentId: student1._id, title: 'ML Image Classifier', description: 'Deep learning model for image classification.', techStack: ['Python', 'TensorFlow'], status: 'published', verified: false, expertiseTrack: 'Data / AI / Analytics', featured: true, imageUrl: '/images/projects/ai.png' },
      { studentId: student2._id, title: 'Design System Library', description: 'Reusable component library for massive scale.', techStack: ['React', 'Storybook'], status: 'published', verified: true, verifiedBy: faculty._id, expertiseTrack: 'Software Development', featured: true, imageUrl: '/images/projects/saas.png' },
      { studentId: student3._id, title: 'IoT Smart Home', description: 'Integrated automation system using MQTT and ESP32.', techStack: ['C++', 'MQTT'], status: 'published', featured: true, imageUrl: '/images/projects/robotics.png' },
      { studentId: student4._id, title: 'Serverless E-commerce', description: 'Scalable shop on AWS Lambda and DynamoDB.', techStack: ['Node.js', 'AWS'], status: 'published', verified: true, verifiedBy: faculty._id, expertiseTrack: 'Software Development', featured: true, imageUrl: '/images/projects/saas.png' },
      { studentId: student5._id, title: 'Sentiment Analysis API', description: 'Real-time NLP API with transformer models.', techStack: ['Python', 'FastAPI'], status: 'published', verified: true, verifiedBy: faculty2._id, expertiseTrack: 'Data / AI / Analytics', featured: true, imageUrl: '/images/projects/ai.png' },
      { studentId: student6._id, title: 'Intrusion Detection System', description: 'Network monitor for identifying cyber threats.', techStack: ['Python', 'Scapy'], status: 'published', verified: true, verifiedBy: faculty._id, expertiseTrack: 'Software Development', featured: true, imageUrl: '/images/projects/ai.png' },
      { studentId: student7._id, title: 'Self-Balancing Robot', description: 'Two-wheeled robot using PID control logic.', techStack: ['Arduino', 'C++'], status: 'published', verified: true, verifiedBy: faculty2._id, expertiseTrack: 'Core Engineering', featured: true, imageUrl: '/images/projects/robotics.png' },
      { studentId: student8._id, title: 'Solar Array Optimizer', description: 'AI-driven system for maximizing solar output.', techStack: ['Python', 'IoT'], status: 'published', featured: true, imageUrl: '/images/projects/saas.png' },
      { studentId: student9._id, title: 'Expense Tracker Pro', description: 'Flutter app for sleek personal finance tracking.', techStack: ['Flutter', 'Firebase'], status: 'published', featured: true, imageUrl: '/images/projects/mobile.png' },
      { studentId: student10._id, title: 'Product Analytics Tool', description: 'Dashboard for tracking user engagement metrics.', techStack: ['React', 'D3.js'], status: 'published', featured: true, imageUrl: '/images/projects/saas.png' },
      { studentId: student11._id, title: 'High-Throughput Chat', description: 'Distributed chat system with Go and Redis.', techStack: ['Go', 'Redis'], status: 'published', featured: true, imageUrl: '/images/projects/ai.png' },
      { studentId: student12._id, title: 'EV Battery Management', description: 'Thermal monitoring for high-capacity EV batteries.', techStack: ['MATLAB', 'Simulink'], status: 'published', featured: true, imageUrl: '/images/projects/robotics.png' },
      { studentId: student13._id, title: 'Mars Odyssey', description: '3D exploration game built with Unity.', techStack: ['Unity', 'C#'], status: 'published', featured: true, imageUrl: '/images/projects/robotics.png' },
      { studentId: student14._id, title: 'Grid Stability Predictor', description: 'ML model for electrical grid resilience.', techStack: ['Python', 'Pandas'], status: 'published', featured: true, imageUrl: '/images/projects/ai.png' },
      { studentId: student15._id, title: 'Voting DApp', description: 'Secure voting system on Ethereum blockchain.', techStack: ['Solidity', 'Truffle'], status: 'published', featured: true, imageUrl: '/images/projects/saas.png' },
    ];
    const projects = await Project.insertMany(projectsData);
    console.log(`💼 Created ${projects.length} projects`);

    // ── Skills ──
    const skillsToCreate = [];
    [student1, student2, student3, student4, student5, student6, student7, student8, student9, student10, student11, student12, student13, student14, student15].forEach(s => {
      skillsToCreate.push({ studentId: s._id, name: 'Problem Solving', category: 'Other', level: 85 });
      skillsToCreate.push({ studentId: s._id, name: 'Communication', category: 'Other', level: 80 });
    });
    skillsToCreate.push({ studentId: student1._id, name: 'React', category: 'Frontend', level: 90 });
    skillsToCreate.push({ studentId: student1._id, name: 'Node.js', category: 'Backend', level: 85 });
    skillsToCreate.push({ studentId: student4._id, name: 'AWS', category: 'Tools', level: 85 });
    skillsToCreate.push({ studentId: student5._id, name: 'PyTorch', category: 'Backend', level: 85 });
    skillsToCreate.push({ studentId: student6._id, name: 'Cybersecurity', category: 'Other', level: 80 });
    skillsToCreate.push({ studentId: student7._id, name: 'SolidWorks', category: 'Design', level: 85 });
    skillsToCreate.push({ studentId: student9._id, name: 'Flutter', category: 'Frontend', level: 88 });
    skillsToCreate.push({ studentId: student11._id, name: 'GoLang', category: 'Backend', level: 82 });
    skillsToCreate.push({ studentId: student13._id, name: 'Unity', category: 'Tools', level: 90 });
    skillsToCreate.push({ studentId: student15._id, name: 'Solidity', category: 'Backend', level: 78 });

    await Skill.insertMany(skillsToCreate);
    console.log(`🛠️  Created ${skillsToCreate.length} skills`);

    // ── Achievements & Internships ──
    await Achievement.insertMany([
      { studentId: student1._id, category: 'Hackathon', title: 'Smart India Hackathon Finalist', date: '2023-08-15' },
      { studentId: student4._id, category: 'Certification', title: 'AWS Architect', date: '2024-01-10' },
      { studentId: student5._id, category: 'Workshop', title: 'NVIDIA AI Days', date: '2023-11-20' },
      { studentId: student10._id, category: 'Certification', title: 'Google PM Certificate', date: '2023-09-05' },
    ]);

    await Internship.insertMany([
      { studentId: student1._id, company: 'Google', role: 'SWE Intern', startDate: '2023-05-01', endDate: '2023-07-31', verified: true, verifiedBy: faculty._id },
      { studentId: student5._id, company: 'Microsoft', role: 'Research Intern', startDate: '2024-06-01' },
      { studentId: student11._id, company: 'Amazon', role: 'SDE Intern', startDate: '2023-01-01', endDate: '2023-06-01' },
    ]);
    console.log('🏆 Created achievements and internships');

    // ── Allocations ──
    const allocationsToCreate = [];
    const students = [student1, student2, student4, student6, student9, student11, student13];
    const students2 = [student3, student5, student7, student8, student10, student12, student14, student15];

    students.forEach(s => allocationsToCreate.push({ facultyId: faculty._id, studentId: s._id, assignedBy: admin._id, active: true }));
    students2.forEach(s => allocationsToCreate.push({ facultyId: faculty2._id, studentId: s._id, assignedBy: admin._id, active: true }));

    await Allocation.insertMany(allocationsToCreate);
    console.log(`🔗 Created ${allocationsToCreate.length} allocations`);

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
