import Allocation from '../models/Allocation.js';

// Require specific role(s)
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access denied. Required: ${roles.join(', ')}` });
    }
    next();
  };
};

// Ensure user has branch access (Faculty/Admin)
export const requireBranchAccess = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (req.user.role === 'admin') return next(); // admin can access all
  if (req.user.role === 'faculty') {
    return next();
  }
  return res.status(403).json({ error: 'Branch access denied' });
};

// Ensure faculty can only access assigned students
export const requireAllocationAccess = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (req.user.role === 'admin') return next();
  if (req.user.role === 'faculty') {
    const allocations = await Allocation.find({ facultyId: req.user._id, active: true });
    req.allocatedStudentIds = allocations.map(a => a.studentId.toString());
    return next();
  }
  if (req.user.role === 'student') {
    req.studentFilter = req.user._id;
    return next();
  }
  return res.status(403).json({ error: 'Access denied' });
};
