const axios = require('axios')

const databaseClient = require('../util/mongo.js').client
const database = databaseClient.db('games')
const scryfallCollection = database.collection('scryfall')


const Scryfall = {}  // This will be the exported module

const unwantedScryfallFields = [
  "object",
  "id",
  "oracle_id",
  "multiverse_ids",
  "mtgo_id",
  "mtgo_foil_id",
  "tcgplayer_id",
  "cardmarket_id",
  "lang",
  "released_at",
  "uri",
  "scryfall_uri",
  "highres_image",
  "image_status",
  "legalities",
  "games",
  "reserved",
  "foil",
  "nonfoil",
  "finishes",
  "oversized",
  "promo",
  "reprint",
  "variation",
  "set_id",
  "set_type",
  "set_uri",
  "set_search_uri",
  "scryfall_set_uri",
  "rulings_uri",
  "prints_search_uri",
  "digital",
  "card_back_id",
  "artist_ids",
  "illustration_id",
  "border_color",
  "frame",
  "full_art",
  "textless",
  "booster",
  "story_spotlight",
  "edhrec_rank",
  "penny_rank",
  "prices",
  "related_uris",
]


async function cleanScryfallData(data) {
  for (const fieldName of unwantedScryfallFields) {
    delete data[fieldName]
  }
  return data
}


async function cleanScryfallCards(cards) {
  for (const card of cards) {
    cleanScryfallData(card)
  }
}

async function fetchScryfallDefaultCards(uri) {
  console.log(uri) // to prevent annoying unused errors

  // Load card data from the disk for now.
  const fs = require('fs')
  const path = require('path')

  const filename = '/Users/dennis/tmp/scryfall/default-cards-20221025090507.json'
  const data = fs.readFileSync(filename).toString()

  return JSON.parse(data)


  /* const result = await axios.get(uri)

   * if (result.status !== 200) {
   *   return {
   *     status: 'error',
   *     message: result.statusText,
   *   }
   * }

   * return result.data */
}

async function fetchScryfallDefaultDataUri() {
  // Get the list of bulk data.
  const result = await axios.get('https://api.scryfall.com/bulk-data')

  if (result.status !== 200) {
    throw new Error('Unable to fetch bulk data list')
  }

  const targetData = result.data.data.find(d => d.type === 'default_cards')

  if (!targetData) {
    throw new Error('Unable to parse default_cards from the bulk data last')
  }

  if (!targetData.download_uri) {
    throw new Error('Unable to parse the download URI for default cards')
  }

  return targetData.download_uri
}

async function insertCardsIntoDatabase(cards) {
  await scryfallCollection.deleteMany({})  // Remove old data
  await scryfallCollection.insertMany(cards, { ordered: true })
}

Scryfall.updateAll = async function() {
  const downloadUri = await fetchScryfallDefaultDataUri()

  const cards = await fetchScryfallDefaultCards(downloadUri)
  cleanScryfallCards(cards)
  insertCardsIntoDatabase(cards)
}

module.exports = Scryfall
