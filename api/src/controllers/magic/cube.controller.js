const db = require('#/models/db')
const logger = require('#/utils/logger')
const { BadRequestError, NotFoundError } = require('#/utils/errors')

/**
 * Get all cubes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.all = async (req, res, next) => {
  try {
    const cubes = await db.magic.cube.all()

    res.json({
      status: 'success',
      cubes
    })
  }
  catch (err) {
    logger.error(`Error fetching cubes: ${err.message}`)
    next(err)
  }
}

/**
 * Add and remove multiple cards from a cube in a single operation
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {Array<string>} req.body.addIds - Array of card IDs to add
 * @param {Array<string>} req.body.removeIds - Array of card IDs to remove
 * @param {string} req.body.comment - Optional comment for the operations
 * @param {Object} req.cube - Cube object loaded by middleware
 * @param {Object} req.user - User object from authentication
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.addRemoveCards = async (req, res, next) => {
  try {
    // Validate required parameters
    if (!req.cube) {
      return res.status(404).json({
        status: 'error',
        message: 'Cube not found'
      })
    }

    if (!req.body.addIds && !req.body.removeIds) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: addIds or removeIds are required'
      })
    }

    // Process cards to add
    const addResults = []
    if (req.body.addIds && req.body.addIds.length > 0) {
      const toAdd = await db.magic.card.findByIds(req.body.addIds)
      for (const card of toAdd) {
        try {
          const createdCard = await db.magic.card.create(
            card.data,
            req.cube,
            req.user,
            req.body.comment
          )
          await db.magic.cube.addCard(req.cube, createdCard)
          addResults.push({
            id: createdCard._id,
            status: 'success'
          })
        }
        catch (err) {
          logger.error(`Error adding card ${card._id}: ${err.message}`)
          addResults.push({
            id: card._id,
            status: 'error',
            message: err.message
          })
        }
      }
    }

    // Process cards to remove
    const removeResults = []
    if (req.body.removeIds && req.body.removeIds.length > 0) {
      const toRemove = await db.magic.card.findByIds(req.body.removeIds)
      for (const card of toRemove) {
        try {
          await db.magic.card.deactivate(
            card,
            req.cube,
            req.user,
            req.body.comment
          )
          await db.magic.cube.removeCard(req.cube, card)
          removeResults.push({
            id: card._id,
            status: 'success'
          })
        }
        catch (err) {
          logger.error(`Error removing card ${card._id}: ${err.message}`)
          removeResults.push({
            id: card._id,
            status: 'error',
            message: err.message
          })
        }
      }
    }

    // Return the results
    res.json({
      status: 'success',
      addResults,
      removeResults
    })
  }
  catch (err) {
    logger.error(`Error adding/removing cards: ${err.message}`)
    next(err)
  }
}

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
 * Update cube settings
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.cubeId - ID of the cube to update
 * @param {Object} req.body.settings - Settings to update
 * @param {string} req.body.settings.name - Cube name
 * @param {boolean} req.body.settings.legacy - Legacy mode flag
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateSettings = async (req, res, next) => {
  try {
    if (!req.body.cubeId) {
      return next(new BadRequestError('cubeId is required'))
    }

    if (!req.body.settings) {
      return next(new BadRequestError('settings object is required'))
    }

    if (!req.cube) {
      return next(new NotFoundError(`Cube with ID ${req.body.cubeId} not found`))
    }

    const cube = req.cube

    // Update the settings
    if (req.body.settings.name !== undefined) {
      cube.name = req.body.settings.name
    }

    // Update legacy flag
    if (req.body.settings.legacy !== undefined) {
      if (!cube.flags) {
        cube.flags = {}
      }
      cube.flags.legacy = req.body.settings.legacy
    }

    // Save the updated cube
    await db.magic.cube.save(cube)

    res.json({
      status: 'success',
      cube
    })
  }
  catch (err) {
    logger.error(`Error updating cube settings: ${err.message}`)
    next(err)
  }
}
