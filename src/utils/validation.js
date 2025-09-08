const validateSignupData = (req) => {
  const errors = [];
  const { firstName, email, password } = req.body;

  if (!firstName || typeof firstName !== 'string' || firstName.trim().length < 3) {
    errors.push('firstName must be at least 3 characters long.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Invalid email format.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateEditProfileData = (req) => {
  const allowedFields = ['firstName', 'lastName', 'email', 'age', 'gender','about','interests','location'];
  const updates = Object.keys(req.body);  
  const isEditAllow = updates.every((update) => allowedFields.includes(update));
return isEditAllow;
};


module.exports = { validateSignupData,validateEditProfileData };