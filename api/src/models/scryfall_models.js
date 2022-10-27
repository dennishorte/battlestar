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


Scryfall.cleanScryfallData = function (data) {
  for (const fieldName of unwantedScryfallFields) {
    delete data[fieldName]
  }
  return data
}


Scryfall.cleanScryfallCards = async function(cards) {
  for (const card of cards) {
    this.cleanScryfallData(card)
  }
}

Scryfall.fetchScryfallDefaultCards = async function(uri) {
  console.log(uri) // to prevent annoying unused errors

  // Load card data from the disk for now.
  const fs = require('fs')
  const path = require('path')

  const filename = '/Users/dennis/tmp/scryfall/test.json'
  const data = fs.readFileSync(filename).toString()

  console.log(data)

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

Scryfall.fetchScryfallDefaultDataUri = async function() {
  this.status = 'waiting'
  this.message = 'Downloading latest data'

  // Get the list of bulk data.
  const result = await axios.get('https://api.scryfall.com/bulk-data')

  if (result.status !== 200) {
    return {
      status: 'error',
      message: result.statusText,
    }
  }

  const targetData = result.data.data.find(d => d.type === 'default_cards')

  if (!targetData) {
    return {
      status: 'error',
      message: 'Unable to find the default_cards data in the bulk data list',
    }
  }

  if (!targetData.download_uri) {
    return {
      status: 'error',
      message: 'Unable to find the download URI for default_cards',
    }
  }

  return targetData.download_uri
}

Scryfall.updateAll = async function() {
  console.log('################################################################################')
  const downloadUri = await this.fetchScryfallDefaultDataUri()

  const cards = await this.fetchScryfallDefaultCards(downloadUri)
  this.cleanScryfallCards(cards)

  console.log(cards.slice(0, 10))
}

module.exports = Scryfall
