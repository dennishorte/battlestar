const axios = require('axios')

/* {
 *   all_parts: 9012,
 *   arena_id: 9403,
 *   artist: 74655,
 *   attraction_lights: 134,
 *   card_faces: 2387,
 *   cmc: 74650,
 *   collector_number: 74655,
 *   color_identity: 74655,
 *   color_indicator: 92,
 *   colors: 72689,
 *   content_warning: 28,
 *   flavor_name: 78,
 *   flavor_text: 36190,
 *   frame_effects: 7126,
 *   hand_modifier: 118,
 *   id: 74655,
 *   image_uris: 72689,
 *   keywords: 74655,
 *   layout: 74655,
 *   life_modifier: 118,
 *   loyalty: 1102,
 *   mana_cost: 72689,
 *   name: 74655,
 *   oracle_text: 72267,
 *   power: 34849,
 *   preview: 9125,
 *   printed_name: 2088,
 *   printed_text: 212,
 *   printed_type_line: 219,
 *   produced_mana: 10942,
 *   promo_types: 11792,
 *   rarity: 74655,
 *   security_stamp: 19257,
 *   set: 74655,
 *   set_name: 74655,
 *   tcgplayer_etched_id: 745,
 *   toughness: 34849,
 *   type_line: 74650,
 *   variation_of: 69,
 *   watermark: 5169,
 * } */

const unwantedScryfallFields = [
  "object",
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
  // "legalities",
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


function cleanScryfallCards(cards) {
  for (const card of cards) {
    for (const fieldName of unwantedScryfallFields) {
      delete card[fieldName]
    }
  }
}

async function fetchScryfallDefaultCards(uri) {
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

async function findDuplicateNames(cards) {

  const cardConfusion = {}
  const confused = []

  const multifaced = []

  const fields = {}

  for (const card of cards) {
    ////////////////////
    const key = `${card.name} ${card.set}`
    if (
      key in cardConfusion
      && cardConfusion[key] !== card.oracle_text
      && !card.type_line.includes('Token')
    ) {
      confused.push(card.name)
    }
    else {
      cardConfusion[key] = card.oracle_text
    }


    ////////////////////
    if (card.name.includes('//')) {
      multifaced.push(card)
    }

    ////////////////////
    for (const key of Object.keys(card)) {
      if (key in fields) {
        fields[key] += 1
      }
      else {
        fields[key] = 0
      }
    }
  }

}

async function fetchFromScryfallAndClean() {
  const downloadUri = await fetchScryfallDefaultDataUri()
  const cards = await fetchScryfallDefaultCards(downloadUri)

  cleanScryfallCards(cards)
  findDuplicateNames(cards)

  return cards
}

module.exports = {
  fetchFromScryfallAndClean
}

// fetchFromScryfallAndClean()
