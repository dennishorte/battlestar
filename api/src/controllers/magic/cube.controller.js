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
    const cube = await db.magic.cube.create(req.user)

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
 * Set the a flag for a cube
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.setFlag = async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.value) {
      return next(new BadRequestError('name and value are required'))
    }

    if (!['legacy'].includes(req.body.name)) {
      return next(new BadRequestError('Invalid flag name: ' + req.body.name))
    }

    if (typeof req.body.value !== 'boolean') {
      return next(new BadRequestError('Invalid flag value: ' + req.body.value))
    }

    await db.magic.cube.setFlag(req.cube._id, req.body.name, req.body.value)

    res.json({
      status: 'success',
    })
  }
  catch (err) {
    logger.error(`Error setting legacy flag: ${err.message}`)
    next(err)
  }
}
