// middleware/adminAuth.js
const adminAuth = (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      return next(); // ✅ User is admin, move to next handler
    }
    return res.status(403).json({ 
      success: false, 
      message: "Access denied. Admins only." 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Something went wrong", 
      error: error.message 
    });
  }
};

module.exports = { adminAuth };
