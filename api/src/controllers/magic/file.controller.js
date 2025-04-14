const db = require('../../models/db')
const logger = require('../../utils/logger')
const { BadRequestError } = require('../../utils/errors')

/**
 * Create a new file
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createFile = async (req, res, next) => {
  try {
    if (!req.body.kind) {
      return next(new BadRequestError('File kind is required'))
    }
    
    if (!['card', 'cube', 'deck'].includes(req.body.kind)) {
      return next(new BadRequestError(`Invalid file kind: ${req.body.kind}`))
    }
    
    const fileId = await db.magic[req.body.kind].create(req.body)
    
    res.json({
      status: 'success',
      fileId
    })
  }
  catch (err) {
    logger.error(`Error creating file: ${err.message}`)
    next(err)
  }
}

/**
 * Delete a file
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteFile = async (req, res, next) => {
  try {
    if (!req.body.kind) {
      return next(new BadRequestError('File kind is required'))
    }
    
    if (!req.body.fileId) {
      return next(new BadRequestError('File ID is required'))
    }
    
    if (!['card', 'cube', 'deck'].includes(req.body.kind)) {
      return next(new BadRequestError(`Invalid file kind: ${req.body.kind}`))
    }
    
    await db.magic[req.body.kind].delete(req.body.fileId)
    
    res.json({
      status: 'success'
    })
  }
  catch (err) {
    logger.error(`Error deleting file: ${err.message}`)
    next(err)
  }
}

/**
 * Duplicate a file
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.duplicateFile = async (req, res, next) => {
  try {
    if (!req.body.kind) {
      return next(new BadRequestError('File kind is required'))
    }
    
    if (!req.body.fileId) {
      return next(new BadRequestError('File ID is required'))
    }
    
    if (!['card', 'cube', 'deck'].includes(req.body.kind)) {
      return next(new BadRequestError(`Invalid file kind: ${req.body.kind}`))
    }
    
    await db.magic[req.body.kind].duplicate(req.body.fileId)
    
    res.json({
      status: 'success'
    })
  }
  catch (err) {
    logger.error(`Error duplicating file: ${err.message}`)
    next(err)
  }
}

/**
 * Save a file
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.saveFile = async (req, res, next) => {
  try {
    const file = req.body.file
    
    if (!file) {
      return next(new BadRequestError('File data is required'))
    }
    
    if (!file._id) {
      return next(new BadRequestError('Cannot update file with no _id field'))
    }
    
    if (!['card', 'cube', 'deck'].includes(file.kind)) {
      return next(new BadRequestError(`Invalid file kind: ${file.kind}`))
    }
    
    await db.magic[file.kind].save(file)
    
    res.json({
      status: 'success'
    })
  }
  catch (err) {
    logger.error(`Error saving file: ${err.message}`)
    next(err)
  }
} 
