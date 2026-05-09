import {
  fetchScryfallDefaultDataUri,
  fetchScryfallDefaultCards,
  processCards,
} from '../../../scripts/fetch_scryfall_cards.js'

import { client as databaseClient } from '../../utils/mongo.js'
import Sets from './sets_models.js'

const database = databaseClient.db('magic')
const scryfallCollection = database.collection('scryfall')
const versionCollection = database.collection('versions')


const Scryfall = {}

async function insertCardsIntoDatabase(cards, version) {
  for (const card of cards) {
    if (!card._id || typeof card._id !== 'string') {
      console.log(card)
      throw new Error('Card missing _id or _id is not a string')
    }

    const md5Pattern = /^scryfall-md5-[0-9a-f]{32}$/
    if (!md5Pattern.test(card._id)) {
      throw new Error(`Invalid MD5 format for card ${card.name}: ${card._id}`)
    }
  }

  await scryfallCollection.deleteMany({})
  await scryfallCollection.insertMany(cards, { ordered: true })

  const versionRecord = await versionCollection.findOne({ name: 'scryfall' })

  if (versionRecord) {
    await versionCollection.updateOne(
      { _id: versionRecord._id },
      { $set: { value: version } }
    )
  }
  else {
    await versionCollection.insertOne({ name: 'scryfall', value: version })
  }
}

Scryfall.fetchAll = async function() {
  const cursor = scryfallCollection.find({})
  return await cursor.toArray()
}

/**
 * Insert pre-processed cards (replacing all existing) and bump the version.
 * Exposed so the update worker can call it directly.
 */
Scryfall.insertCards = async function(cards, version) {
  await insertCardsIntoDatabase(cards, version)
}

/**
 * Run the full update: refresh sets, then fetch + process + insert cards.
 * Designed to be called from the background job runner.
 */
Scryfall.runFullUpdate = async function(progress) {
  progress.setPhase('sets')
  progress.log('Fetching set list from Scryfall...')
  const setsResult = await Sets.update()
  progress.log(`Updated ${setsResult.count} sets`)

  progress.setPhase('locate-bulk')
  progress.log('Looking up bulk card download URI...')
  const downloadUri = await fetchScryfallDefaultDataUri()
  const version = downloadUri.split('/').slice(-1)[0]
  progress.log(`Bulk file: ${version}`)

  progress.setPhase('download')
  progress.log('Downloading bulk card data (this is the slow step, several minutes)...')
  const rawCards = await fetchScryfallDefaultCards(downloadUri)
  progress.log(`Downloaded ${rawCards.length} raw card entries`)

  progress.setPhase('process')
  progress.log('Processing cards...')
  const formatted = processCards(rawCards)
  progress.log(`${formatted.length} cards after processing`)

  progress.setPhase('insert')
  progress.log('Inserting cards into database...')
  await insertCardsIntoDatabase(formatted, version)
  progress.log('Database insert complete')

  return {
    sets: setsResult.count,
    cards: formatted.length,
    version,
  }
}

export default Scryfall
