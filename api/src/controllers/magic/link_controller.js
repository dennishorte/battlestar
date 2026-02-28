import db from '../../models/db.js'

/**
 * Create a new link
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const create = async (req, res) => {
  try {
    // Validate required inputs
    if (!req.body.linkData) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required field: linkData'
      })
    }

    // Create the link
    const link = await db.magic.link.create(req.body.linkData, req.user)

    res.json({
      status: 'success',
      link
    })
  }
  catch (error) {
    console.error('Error creating link:', error)
    res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

/**
 * Find all links for a card
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const findAll = async (req, res) => {
  try {
    // Validate required inputs
    if (!req.body.cardId) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required field: cardId'
      })
    }

    // Find links
    const links = await db.magic.link.findAll(req.body.cardId)

    res.json({
      status: 'success',
      links
    })
  }
  catch (error) {
    console.error('Error finding links:', error)
    res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

/**
 * Delete a link
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteLink = async (req, res) => {
  try {
    // Validate required inputs
    if (!req.body.linkId) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required field: linkId'
      })
    }

    // Delete the link
    await db.magic.link.delete(req.body.linkId, req.user)

    res.json({
      status: 'success'
    })
  }
  catch (error) {
    console.error('Error deleting link:', error)
    res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

/**
 * Fetch drafts associated with a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const fetchDrafts = async (req, res) => {
  const cursor = await db.game.collection.find({
    'settings.game': { $in: ['Cube Draft', 'Set Draft'] },
    'settings.players': { $elemMatch: { _id: req.body.userId } },
    killed: { $ne: true },
  }).sort({
    lastUpdated: -1,
  })
  const array = await cursor.toArray()

  res.json({
    status: 'success',
    drafts: array,
  })
}

/**
 * Fetch drafts associated with a cube
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const fetchDraftsByCube = async (req, res) => {
  const cursor = await db.game.collection.find({
    'settings.game': { $in: ['Cube Draft', 'Set Draft'] },
    'settings.cubeId': req.body.cubeId,
    killed: { $ne: true },
  }).sort({
    lastUpdated: -1,
  }).project({
    responses: 0,
    state: 0,
  })
  const array = await cursor.toArray()

  res.json({
    status: 'success',
    drafts: array,
  })
}

/**
 * Fetch games linked to a draft
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const fetchByDraft = async (req, res) => {
  const draft = req.draft
  delete draft.responses  // Removing responses from the draft object

  const games = await db
    .game
    .collection
    .find({ 'settings.linkedDraftId': draft._id })
    .project({ responses: 0 })
    .toArray()

  console.log(draft)

  res.json({
    status: 'success',
    games,
    draft: draft.serialize(),
  })
}
