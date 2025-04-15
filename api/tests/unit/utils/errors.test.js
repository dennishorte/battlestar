const {
  AppError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InternalServerError
} = require('../../../src/utils/errors')

describe('Error Utils', () => {
  describe('AppError', () => {
    it('should create an error with the provided message and status code', () => {
      const error = new AppError('Test error message', 418)
      
      expect(error.message).toBe('Test error message')
      expect(error.status).toBe(418)
      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(AppError)
    })
    
    it('should have a default status code of 500', () => {
      const error = new AppError('Default status code')
      
      expect(error.message).toBe('Default status code')
      expect(error.status).toBe(500)
    })
  })
  
  describe('BadRequestError', () => {
    it('should create an error with the provided message and status code 400', () => {
      const error = new BadRequestError('Invalid input')
      
      expect(error.message).toBe('Invalid input')
      expect(error.status).toBe(400)
      expect(error).toBeInstanceOf(AppError)
      expect(error).toBeInstanceOf(BadRequestError)
    })
    
    it('should use default message if none provided', () => {
      const error = new BadRequestError()
      
      expect(error.message).toBe('Bad Request')
      expect(error.status).toBe(400)
    })
  })
  
  describe('NotFoundError', () => {
    it('should create an error with the provided message and status code 404', () => {
      const error = new NotFoundError('Resource not found')
      
      expect(error.message).toBe('Resource not found')
      expect(error.status).toBe(404)
      expect(error).toBeInstanceOf(AppError)
      expect(error).toBeInstanceOf(NotFoundError)
    })
    
    it('should use default message if none provided', () => {
      const error = new NotFoundError()
      
      expect(error.message).toBe('Not Found')
      expect(error.status).toBe(404)
    })
  })
  
  describe('UnauthorizedError', () => {
    it('should create an error with the provided message and status code 401', () => {
      const error = new UnauthorizedError('Authentication required')
      
      expect(error.message).toBe('Authentication required')
      expect(error.status).toBe(401)
      expect(error).toBeInstanceOf(AppError)
      expect(error).toBeInstanceOf(UnauthorizedError)
    })
    
    it('should use default message if none provided', () => {
      const error = new UnauthorizedError()
      
      expect(error.message).toBe('Unauthorized')
      expect(error.status).toBe(401)
    })
  })
  
  describe('ForbiddenError', () => {
    it('should create an error with the provided message and status code 403', () => {
      const error = new ForbiddenError('Access denied')
      
      expect(error.message).toBe('Access denied')
      expect(error.status).toBe(403)
      expect(error).toBeInstanceOf(AppError)
      expect(error).toBeInstanceOf(ForbiddenError)
    })
    
    it('should use default message if none provided', () => {
      const error = new ForbiddenError()
      
      expect(error.message).toBe('Forbidden')
      expect(error.status).toBe(403)
    })
  })
  
  describe('ConflictError', () => {
    it('should create an error with the provided message and status code 409', () => {
      const error = new ConflictError('Resource already exists')
      
      expect(error.message).toBe('Resource already exists')
      expect(error.status).toBe(409)
      expect(error).toBeInstanceOf(AppError)
      expect(error).toBeInstanceOf(ConflictError)
    })
    
    it('should use default message if none provided', () => {
      const error = new ConflictError()
      
      expect(error.message).toBe('Conflict')
      expect(error.status).toBe(409)
    })
  })
  
  describe('InternalServerError', () => {
    it('should create an error with the provided message and status code 500', () => {
      const error = new InternalServerError('Something went wrong')
      
      expect(error.message).toBe('Something went wrong')
      expect(error.status).toBe(500)
      expect(error).toBeInstanceOf(AppError)
      expect(error).toBeInstanceOf(InternalServerError)
    })
    
    it('should use default message if none provided', () => {
      const error = new InternalServerError()
      
      expect(error.message).toBe('Internal Server Error')
      expect(error.status).toBe(500)
    })
  })
}) 
