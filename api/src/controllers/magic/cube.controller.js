const db = require('../../models/db')
const logger = require('../../utils/logger')
const { BadRequestError, NotFoundError } = require('../../utils/errors')

/**
 * Create a new cube
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createCube = async (req, res, next) => {
  try {
    const cubeId = await db.magic.cube.create(req.body)
    const cube = await db.magic.cube.findById(cubeId)

    res.json({
      status: 'success',
      cube
    })
  }
  catch (err) {
    logger.error(`Error creating cube: ${err.message}`)
    next(err)
  }
}

/**
 * Fetch a cube by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getCube = async (req, res, next) => {
  try {
    if (!req.body.cubeId) {
      return next(new BadRequestError('Cube ID is required'))
    }

    const cube = req.cube

    if (!cube) {
      return next(new NotFoundError(`Cube with ID ${req.body.cubeId} not found`))
    }

    res.json({
      status: 'success',
      cube
    })
  }
  catch (err) {
    logger.error(`Error fetching cube: ${err.message}`)
    next(err)
  }
}

/**
 * Get all public cubes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getPublicCubes = async (req, res, next) => {
  try {
    const cubesCursor = await db.magic.cube.collection.find({ public: true })
    const cubes = await cubesCursor.toArray()

    res.json({
      status: 'success',
      cubes
    })
  }
  catch (err) {
    logger.error(`Error fetching public cubes: ${err.message}`)
    next(err)
  }
}

/**
 * Save changes to a cube
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.saveCube = async (req, res, next) => {
  try {
    if (!req.body.cube) {
      return next(new BadRequestError('Cube data is required'))
    }

    if (!req.body.cube._id) {
      return next(new BadRequestError('Cannot update cube with no _id field'))
    }

    await db.magic.cube.save(req.body.cube)

    res.json({
      status: 'success'
    })
  }
  catch (err) {
    logger.error(`Error saving cube: ${err.message}`)
    next(err)
  }
}

/**
 * Set the edit flag for a cube
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.setEditFlag = async (req, res, next) => {
  try {
    if (!req.body.editFlag) {
      return next(new BadRequestError('Edit flag is required'))
    }

    await db.magic.cube.setEditFlag(req.cube._id, req.body.editFlag)

    res.json({
      status: 'success'
    })
  }
  catch (err) {
    logger.error(`Error setting edit flag: ${err.message}`)
    next(err)
  }
}

/**
 * Set the public flag for a cube
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.setPublicFlag = async (req, res, next) => {
  try {
    if (req.body.publicFlag === undefined) {
      return next(new BadRequestError('Public flag is required'))
    }

    await db.magic.cube.setPublicFlag(req.cube._id,req.body.publicFlag)

    res.json({
      status: 'success'
    })
  }
  catch (err) {
    logger.error(`Error setting public flag: ${err.message}`)
    next(err)
  }
}
