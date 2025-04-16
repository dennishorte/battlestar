const AsyncLock = require('async-lock')

const databaseClient = require('../../utils/mongo.js').client
const database = databaseClient.db('magic')

const customCollection = database.collection('custom_cards')
const scryfallCollection = database.collection('scryfall')
const versionCollection = database.collection('versions')


const Card = {}
module.exports = Card


const lock = new AsyncLock()


Card.create = async function(data, cube, user, comment=null) {
  // Use a lock to ensure that multiple card creation operations don't conflict
  return await lock.acquire('card:create', async () => {
    delete data.set
    delete data.collector_number
    delete data.legal

    const card = {
      data,
      cubeId: cube._id,
      edits: [{
        userId: user._id,
        comment,
        date: new Date(),
        oldData: null,
      }],
    }
    
    const result = await customCollection.insertOne(card)
    await _incrementCustomCardDatabaseVersion()
    return await customCollection.findOne({ _id: result.insertedId })
  })
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
