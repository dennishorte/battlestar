/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
function validateEmail(email) {
  if (!email) return false
  
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates a password
 * @param {string} password - Password to validate
 * @returns {boolean} True if password meets requirements
 */
function validatePassword(password) {
  if (!password || password.length < 8) return false
  
  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) return false
  
  // Check for lowercase letter
  if (!/[a-z]/.test(password)) return false
  
  // Check for number
  if (!/[0-9]/.test(password)) return false
  
  return true
}

/**
 * Validates that all required fields are present and non-empty
 * @param {Object} data - Object containing fields to validate
 * @param {Array<string>} requiredFields - Array of required field names
 * @returns {boolean} True if all required fields are present and non-empty
 */
function validateRequiredFields(data, requiredFields) {
  if (!data || !requiredFields || !Array.isArray(requiredFields)) {
    return false
  }
  
  return requiredFields.every(field => {
    return data[field] !== undefined && 
           data[field] !== null && 
           data[field] !== ''
  })
}

module.exports = {
  validateEmail,
  validatePassword,
  validateRequiredFields
} 
