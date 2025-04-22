const AsyncLock = require('async-lock')
const databaseClient = require('@utils/mongo.js').client
const database = databaseClient.db('magic')

const customCollection = database.collection('custom_cards')
const scryfallCollection = database.collection('scryfall')
const versionCollection = database.collection('versions')


const Card = {}
module.exports = Card


const lock = new AsyncLock()


/**
 * Creates a new custom card and adds it to the database
 * @param {Object} data - The card data to create
 * @param {Object} cube - The cube to associate the card with
 * @param {Object} user - The user creating the card
 * @param {string|null} comment - Optional comment for the creation action
 * @returns {Promise<Object>} The created card document
 */
Card.create = async function(data, cube, user, comment=null) {
  return await lock.acquire('cube:' + cube._id.toString(), async () => {
    // Clean up data by removing certain fields
    delete data.set
    delete data.collector_number
    delete data.legal

    const card = {
      data,
      source: 'custom',
      cubeId: cube._id,
      edits: [{
        action: 'create',
        userId: user._id,
        comment,
        date: new Date(),
        oldData: null,
      }],
    }

    const result = await customCollection.insertOne(card)
    await _incrementCustomCardDatabaseVersion()

    const createdCard = await customCollection.findOne({ _id: result.insertedId })

    return createdCard
  })
}

/**
 * Deactivates a card in a cube
 * @param {Object} card - The card to deactivate
 * @param {Object} cube - The cube the card belongs to
 * @param {Object} user - The user performing the deactivation
 * @param {string|null} comment - Optional comment for the deactivation action
 * @returns {Promise<boolean>} True if the deactivation was successful
 * @throws {Error} If the card does not belong to the specified cube
 */
Card.deactivate = async function(card, cube, user, comment=null) {
  if (!card || !cube) {
    throw new Error('Card or cube is undefined')
  }

  if (!card._id) {
    throw new Error('Card is missing _id field')
  }

  if (cube._id.toString() !== card.cubeId.toString()) {
    throw new Error('Card is not from the specified cube')
  }

  try {
    await customCollection.updateOne(
      { _id: card._id },
      {
        $set: { deactivated: true },
        $push: {
          edits: {
            action: 'deactivate',
            userId: user._id,
            comment: 'deactivated: ' + (comment || ''),
            date: new Date(),
            oldData: null,
          }
        },
      },
    )
    return true
  }
  catch (err) {
    console.error(`Error deactivating card: ${err.message}`)
    throw err
  }
}

Card.fetchAll = async function(source) {
  const result = {}

  const versions = await Card.versions()

  // Set up promises for concurrent execution
  const promises = []

  if (!source || source === 'all' || source === 'custom') {
    const customPromise = customCollection.find({}).toArray()
      .then(customCards => {
        result.custom = {
          cards: customCards,
          version: versions.custom,
        }
      })
    promises.push(customPromise)
  }

  if (!source || source === 'all' || source === 'scryfall') {
    const scryfallPromise = scryfallCollection.find({}).toArray()
      .then(scryfallCards => {
        result.scryfall = {
          cards: scryfallCards,
          version: versions.scryfall,
        }
      })
    promises.push(scryfallPromise)
  }

  // Wait for all database operations to complete in parallel
  await Promise.all(promises)

  return result
}

Card.findById = async function(id) {
  // Query both collections in parallel
  const [scryfallCard, customCard] = await Promise.all([
    scryfallCollection.findOne({ _id: id }),
    customCollection.findOne({ _id: id })
  ])

  // Return the first non-null result
  return scryfallCard || customCard || null
}

/**
 * Finds multiple cards by their IDs
 * @param {Array<string|ObjectId>} ids - Array of card IDs to find
 * @returns {Promise<Array<Object>>} Array of card documents found
 */
Card.findByIds = async function(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return []
  }

  // Query both collections in parallel
  const [scryfallCards, customCards] = await Promise.all([
    scryfallCollection.find({ _id: { $in: ids } }).toArray(),
    customCollection.find({ _id: { $in: ids } }).toArray()
  ])

  // Combine results from both collections
  return [...scryfallCards, ...customCards]
}

/**
 * Updates an existing card in the database
 * @param {string|ObjectId} cardId - The ID of the card to update
 * @param {Object} cardData - The new card data
 * @param {Object} user - The user performing the update
 * @param {string|null} comment - Optional comment for the update action
 * @returns {Promise<Object|null>} The updated card document or null if not found
 */
Card.update = async function(cardId, cardData, user, comment=null) {
  return await lock.acquire('card:' + cardId.toString(), async () => {
    const updateResult = await customCollection.findOneAndUpdate(
      { _id: cardId },
      [
        {
          $set: {
            edits: {
              $concatArrays: [
                "$edits",
                [{
                  action: 'update',
                  userId: user._id,
                  comment,
                  date: new Date(),
                  oldData: "$data"  // References the current data value
                }]
              ]
            },
            data: cardData  // Set the new data
          }
        }
      ],
      {
        returnDocument: 'after',
        upsert: false
      }
    )

    // If update was successful, increment the version
    if (updateResult) {
      await _incrementCustomCardDatabaseVersion()
      return updateResult
    }
    return null
  })
}

Card.versions = async function() {
  const versionCursor = await versionCollection.find({})
  const versionArray = await versionCursor.toArray()

  const versions = {}

  for (const entry of versionArray) {
    versions[entry.name] = entry.value
  }

  return versions
}


async function _incrementCustomCardDatabaseVersion() {
  const customVersion = await versionCollection.findOne({ name: 'custom' })

  if (customVersion) {
    await versionCollection.updateOne(
      { name: 'custom' },
      { $inc: { value: 1 } }
    )
  }
  else {
    await versionCollection.insertOne(
      {
        name: 'custom',
        value: 1,
      }
    )
  }
}
