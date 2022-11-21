const axios = require('axios')
const fs = require('fs')
const util = require('../../common/lib/util.js')


const rootFields = [
  "id",
  "card_faces",
  "collector_number",
  "color_identity",
  "legalities",
  "layout",
  "rarity",
  "set",
  "cmc",
]

const faceFields = [
  "artist",
  "flavor_text",
  "id",
  "image_uris",
  "loyalty",
  "mana_cost",
  "name",
  "oracle_text",
  "power",
  "toughness",
  "type_line",

  "color_indicator",
  "colors",
  "produced_mana",
]

const combinedFields = [
  "name",
  "colors",
  "produced_mana",
  "type_line",
]

const wantedFields = [].concat(rootFields, faceFields)


function adjustFaces(card) {
  if (!card.card_faces) {
    card.card_faces = [{}]
  }

  // Move face fields into card_faces.
  for (const face of card.card_faces) {
    for (const key of faceFields) {
      if (card[key] && !face[key]) {
        face[key] = card[key]
      }

      if (card[key]) {
        delete card[key]
      }
    }
  }

  // Remove all other fields
  const toRemove = [...card.card_faces]
  toRemove.push(card)
  for (const face of toRemove) {
    for (const key of Object.keys(face)) {
      if (!wantedFields.includes(key)) {
        delete face[key]
      }
    }
  }

  // Remove face fields from root
  for (const key of Object.keys(card)) {
    if (!rootFields.includes(key)) {
      delete card[key]
    }
  }

  // Duplicate face fields across all faces, if needed
  const firstFace = card.card_faces[0]
  const otherFaces = card.card_faces.slice(1)
  for (const face of otherFaces) {
    for (const [key, value] of Object.entries(firstFace)) {
      if (!(key in face)) {
        face[key] = value
      }
    }
  }

  // Put combined fields into the root
  for (const field of combinedFields) {
    if (Array.isArray(card.card_faces[0][field])) {
      const combined = card.card_faces.map(face => face[field]).flat()
      card[field] = util.array.distinct(combined)
    }
    else {
      card[field] = card.card_faces.map(face => face[field]).join(' // ')
    }
  }

  if (!card.name) {
    console.log(card)
  }
}

function cleanImageUris(card) {
  for (const face of card.card_faces) {
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
    adjustFaces(card)
    cleanImageUris(card)
    cleanLegalities(card)
  }
}

function prefilterVersions(cards) {
  for (let i = cards.length - 1; i >= 0; i--) {
    const card = cards[i]

    if (
      card.layout === 'art_series'
      || card.layout === 'vanguard'
      || card.layout === 'double_faced_token'
      || card.layout === 'scheme'
    ) {
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

function postfilterVersions(cards) {
  for (let i = cards.length - 1; i >= 0; i--) {
    const card = cards[i]

    for (const face of card.card_faces) {
      if (!face.type_line) {
        cards.splice(i, 1)
        break
      }

      if (face.type_line.includes('Card')) {
        cards.splice(i, 1)
        break
      }
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
  const cachedFilename = 'cached/' + downloadUri.split('/').slice(-1)[0]
  const outputFilename = 'card_data/' + downloadUri.split('/').slice(-1)[0]

  let cards

  if (fs.existsSync(cachedFilename)) {
    console.log('...loading card data from disk')
    const cardData = fs.readFileSync(cachedFilename)
    cards = JSON.parse(cardData)
  }
  else {
    console.log('...downloading card data from ' + downloadUri)
    cards = await fetchScryfallDefaultCards(downloadUri)

    console.log('...writing raw data to disk: ' + cachedFilename)
    if (!fs.existsSync('cached')){
      fs.mkdirSync('cached')
    }
    fs.writeFileSync(cachedFilename, JSON.stringify(cards))
  }

  console.log('...pre-filtering')
  prefilterVersions(cards)

  console.log('...cleaning')
  cleanScryfallCards(cards)

  console.log('...post-filtering')
  postfilterVersions(cards)

  const count = Object.keys(cards).length
  console.log(`...${count} cards after cleaning`)

  console.log('...writing data to ' + outputFilename)
  fs.writeFileSync(outputFilename, JSON.stringify(cards, null, 2))

  console.log('...done')
}


////////////////////////////////////////////////////////////////////////////////
// Main

fetchFromScryfallAndClean()
