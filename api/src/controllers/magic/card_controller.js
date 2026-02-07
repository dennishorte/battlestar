import db from '../../models/db.js'

/**
 * Create a card
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const create = async (req, res) => {
  try {
    // Validate required inputs
    if (!req.body.cardData || !req.body.cubeId) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: cardData and cubeId are required'
      })
    }

    // Ensure the cube exists
    if (!req.cube) {
      return res.status(404).json({
        status: 'error',
        message: 'Cube not found'
      })
    }

    // Create the card
    const createdCard = await db.magic.card.create(
      req.body.cardData,
      req.cube,
      req.user,
      req.body.comment
    )

    await db.magic.cube.addCard(req.cube, createdCard)

    res.json({
      status: 'success',
      card: createdCard
    })
  }
  catch (error) {
    console.error('Error creating card:', error)
    res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

/**
 * Fetch all cards
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const fetchAll = async (req, res) => {
  const cardData = await db.magic.card.fetchAll(req.body.source)

  res.json({
    status: 'success',
    ...cardData
  })
}

/**
 * Update a card
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const update = async (req, res) => {
  try {
    // Validate required inputs
    if (!req.body.cardId || !req.body.cardData) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: cardId and cardData are required'
      })
    }

    let comment = req.body.comment

    // If the edit was from scarring, mark the scar as applied
    if (req.body.scar) {
      if (!req.body.cardData.cubeId) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot apply a scar to a card with no associated cube',
        })
      }

      const scar = req.body.scar
      const cube = await db.magic.cube.findById(req.body.cardData.cubeId)

      if (!cube) {
        return res.status(404).json({
          status: 'error',
          message: 'Cube not found',
        })
      }

      if (!cube.scarlist) {
        return res.status(400).json({
          status: 'error',
          message: 'Cube has no scarlist',
        })
      }

      const original = cube.scarlist.find(x => x.id === scar.id)

      if (!original) {
        return res.status(404).json({
          status: 'error',
          message: 'Scar not found in cube scarlist',
        })
      }

      original.appliedTo = req.body.cardId
      original.appliedBy = req.user._id
      original.appliedAt = new Date()
      await db.magic.cube.updateScarlist(cube)

      if (!comment) {
        comment = 'Applied scar:\n' + scar.text
      }
    }

    // Update the card
    const updateResult = await db.magic.card.update(
      req.body.cardId,
      req.body.cardData,
      req.user,
      comment
    )

    // Check for successful update
    if (updateResult) {
      res.json({
        status: 'success',
        card: updateResult
      })
    }
    else {
      res.status(404).json({
        status: 'error',
        message: 'Card not found or update failed'
      })
    }
  }
  catch (error) {
    console.error('Error updating card:', error)
    res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

/**
 * Get card versions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const versions = async (req, res) => {
  try {
    const versions = await db.magic.card.versions()
    res.json({
      status: 'success',
      versions,
    })
  }
  catch (error) {
    console.error('Error fetching card versions:', error)
    res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}
