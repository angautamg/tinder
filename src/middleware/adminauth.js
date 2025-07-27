const adminAuth = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // User is admin, proceed to the next middleware or route handler
  } else {
    res.status(403).send('Access denied. Admins only.'); // Forbidden access
  }
}

module.exports = {adminAuth}; // Export the middleware for use in other files
