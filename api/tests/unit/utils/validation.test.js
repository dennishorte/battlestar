const {
  validateEmail,
  validatePassword,
  validateRequiredFields
} = require('../../../src/utils/validation.js')

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true)
      expect(validateEmail('user.name@example.co.uk')).toBe(true)
      expect(validateEmail('user+tag@example.com')).toBe(true)
      expect(validateEmail('user-name@example.org')).toBe(true)
    })

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('user@example')).toBe(false)
      expect(validateEmail('user@.com')).toBe(false)
      expect(validateEmail('user name@example.com')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should return true for valid passwords', () => {
      expect(validatePassword('Password123!')).toBe(true)
      expect(validatePassword('Complex_Pass1')).toBe(true)
      expect(validatePassword('A1b2C3d4!')).toBe(true)
    })

    it('should return false for passwords that are too short', () => {
      expect(validatePassword('Pass1!')).toBe(false)
      expect(validatePassword('Abc123')).toBe(false)
    })

    it('should return false for passwords missing required characters', () => {
      expect(validatePassword('password123')).toBe(false) // No uppercase
      expect(validatePassword('PASSWORD123')).toBe(false) // No lowercase
      expect(validatePassword('Passwordabc')).toBe(false) // No number
      expect(validatePassword('Password')).toBe(false)    // No number or special char
    })
  })

  describe('validateRequiredFields', () => {
    it('should return true when all required fields are present', () => {
      const data = { name: 'John', email: 'john@example.com', password: 'Pass123!' }
      const requiredFields = ['name', 'email', 'password']

      expect(validateRequiredFields(data, requiredFields)).toBe(true)
    })

    it('should return false when a required field is missing', () => {
      const data = { name: 'John', password: 'Pass123!' }
      const requiredFields = ['name', 'email', 'password']

      expect(validateRequiredFields(data, requiredFields)).toBe(false)
    })

    it('should return false when a required field is empty', () => {
      const data = { name: 'John', email: '', password: 'Pass123!' }
      const requiredFields = ['name', 'email', 'password']

      expect(validateRequiredFields(data, requiredFields)).toBe(false)
    })

    it('should return false when a required field is null or undefined', () => {
      const data = { name: 'John', email: null, password: 'Pass123!' }
      const requiredFields = ['name', 'email', 'password']

      expect(validateRequiredFields(data, requiredFields)).toBe(false)

      data.email = undefined
      expect(validateRequiredFields(data, requiredFields)).toBe(false)
    })
  })
})
