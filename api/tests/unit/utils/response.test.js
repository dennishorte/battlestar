const { success, error } = require('../../../src/utils/response')

describe('Response Utils', () => {
  let res
  
  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
  })
  
  describe('success', () => {
    it('should send a 200 status with data', () => {
      const data = { name: 'Test User' }
      
      success(res, data)
      
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data
      })
    })
    
    it('should send a custom status code if provided', () => {
      const data = { name: 'Test User' }
      const statusCode = 201
      
      success(res, data, statusCode)
      
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data
      })
    })
    
    it('should handle empty data', () => {
      success(res)
      
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: null
      })
    })
  })
  
  describe('error', () => {
    it('should send a 500 status with error message by default', () => {
      const err = new Error('Internal Server Error')
      
      error(res, err)
      
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal Server Error'
      })
    })
    
    it('should use custom status code from error object if available', () => {
      const err = new Error('Not Found')
      err.status = 404
      
      error(res, err)
      
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Not Found'
      })
    })
    
    it('should handle string errors', () => {
      error(res, 'Something went wrong')
      
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Something went wrong'
      })
    })
    
    it('should include error stack in development mode', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      
      const err = new Error('Test Error')
      
      error(res, err)
      
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Test Error',
        stack: expect.any(String)
      })
      
      process.env.NODE_ENV = originalEnv
    })
  })
}) 