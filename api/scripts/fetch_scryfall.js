const axios = require('axios')
const fs = require('fs')


const unwantedScryfallFields = [
  "all_parts",
  "artist_ids",
  "arena_id",
  "booster",
  "border_color",
  "card_back_id",
  "cardmarket_id",
  "edhrec_rank",
  "finishes",
  "foil",
  "frame",
  "games",
  "highres_image",
  "illustration_id",
  "image_status",
  "mtgo_foil_id",
  "mtgo_id",
  "multiverse_ids",
  "nonfoil",
  "object",
  "oracle_id",
  "oversized",
  "penny_rank",
  "preview",
  "prices",
  "prints_search_uri",
  "promo",
  "related_uris",
  "released_at",
  "reprint",
  "reserved",
  "rulings_uri",
  "scryfall_set_uri",
  "scryfall_uri",
  "set_id",
  "set_name",
  "set_search_uri",
  "set_type",
  "set_uri",
  "story_spotlight",
  "tcgplayer_id",
  "uri",
  "variation",
  // "digital",
  // "full_art",
  // "lang",
  // "textless",
]

function cleanImageUris(card) {

  let faces
  if (card.image_uris) {
    faces = [card]
  }
  else {
    faces = card.card_faces
  }

  for (const face of faces) {
    if (!face.image_uris) {
      console.log(card)
    }
    face.image_uri = face.image_uris.art_crop
    delete face.image_uris
  }
}

function cleanLegalities(card) {
  card.legal = Object
    .keys(card.legalities)
    .filter(key => card.legalities[key] === 'legal')
  delete card.legalities
}

function cleanScryfallCards(cards) {
  for (const card of cards) {
    const faces = [card]
    if (card.card_faces) {
      for (const face of card.card_faces) {
        faces.push(face)
      }
    }

    for (const face of faces) {
      for (const fieldName of unwantedScryfallFields) {
        delete face[fieldName]
      }
    }

    cleanImageUris(card)
    cleanLegalities(card)
  }
}

function filterVersions(cards) {
  for (let i = cards.length - 1; i >= 0; i--) {
    const card = cards[i]

    if (card.layout === 'art_series') {
      cards.splice(i, 1)
      continue
    }

    if (card.lang !== 'en') {
      cards.splice(i, 1)
      continue
    }
    else {
      delete card.lang
    }

    if (card.digital || card.textless || card.full_art) {
      cards.splice(i, 1)
      continue
    }
    else {
      delete card.digital
      delete card.textless
      delete card.full_art
    }
  }
}

async function fetchScryfallDefaultCards(uri) {
  const result = await axios.get(uri, {
    maxBodyLength: Infinity,
    maxConentLength: Infinity,
    timeout: 0,
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

async function fetchFromScryfallAndClean() {
  console.log('Fetching latest scryfall data')

  const downloadUri = await fetchScryfallDefaultDataUri()

  console.log('...downloading card data from ' + downloadUri)
  const cards = await fetchScryfallDefaultCards(downloadUri)

  /* const downloadUri = 'default-cards-20221111100454.json'
   * const cardData = fs.readFileSync('local_scryfall.json')
   * const cards = JSON.parse(cardData) */

  console.log('...filtering')
  filterVersions(cards)

  console.log('...cleaning')
  cleanScryfallCards(cards)

  const outputFilename = 'card_data/' + downloadUri.split('/').slice(-1)[0]

  console.log('...writing data to ' + outputFilename)
  fs.writeFileSync(outputFilename, JSON.stringify(cards, null, 2))

  console.log('...done')
}


////////////////////////////////////////////////////////////////////////////////
// Main

fetchFromScryfallAndClean()
