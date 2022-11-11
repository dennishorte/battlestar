const axios = require('axios')
const fs = require('fs')


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
  "games",
  "reserved",
  "foil",
  "nonfoil",
  "finishes",
  "oversized",
  // "promo",
  "reprint",
  // "variation",
  "set_id",
  "set_type",
  "set_uri",
  "set_search_uri",
  "scryfall_set_uri",
  "rulings_uri",
  "prints_search_uri",
  // "digital",
  "card_back_id",
  "artist_ids",
  "illustration_id",
  "border_color",
  "frame",
  // "full_art",
  // "textless",
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
  const result = await axios.get(uri, {
    maxBodyLength: Infinity,
    maxConentLength: Infinity,
  })

  if (result.status !== 200) {
    return {
      status: 'error',
      message: result.statusText,
    }
  }

  return result.data
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
  console.log('Fetching latest scryfall data')

  const downloadUri = await fetchScryfallDefaultDataUri()

  console.log('...downloading card data from ' + downloadUri)
  const cards = await fetchScryfallDefaultCards(downloadUri)

  console.log('...cleaning')
  cleanScryfallCards(cards)
  findDuplicateNames(cards)

  const outputFilename = downloadUri.split('/').slice(-1)[0]

  console.log('...writing data to ' + outputFilename)
  fs.writeFileSync(outputFilename, JSON.stringify(cards, null, 2))

  console.log('...done')
}


////////////////////////////////////////////////////////////////////////////////
// Main

fetchFromScryfallAndClean()
