import axios from 'axios'
import fs from 'fs'
import path from 'path'

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
  "digital",
  "produced_mana",
]

const faceFields = [
  "artist",
  "defense",
  "flavor_text",
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
]

const wantedFields = [].concat(rootFields, faceFields)


function adjustFaces(card) {
  if (!card.card_faces) {
    card.card_faces = [{}]
  }

  // For some reason, adventures put the power/toughness of the creatures in the root card
  // and in the main face. This prevents the power/toughness from being copied into the
  // adventure face.
  if (card.layout === 'adventure') {
    delete card['power']
    delete card['toughness']
  }

  // Move face fields into card_faces.
  for (const key of faceFields) {
    for (const face of card.card_faces) {
      if (card[key] && !face[key]) {
        face[key] = card[key]
      }
    }

    delete card[key]
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
}

function cleanImageUris(card) {
  for (const face of card.card_faces) {
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

function renameIdField(card) {
  card._id = card.id
  delete card.id
}

function addColorIndicators(card) {
  for (const face of card.card_faces) {
    if (!face.mana_cost && face.colors.length > 0) {
      face.color_indicator = [...face.colors]
    }
  }
}

function sortColors(card) {
  for (const face of card.card_faces) {
    face.colors.sort()
    face.color_indicator?.sort()
  }

  if (card.color_identity) {
    card.color_identity.sort()
  }

  if (card.produced_mana) {
    card.produced_mana?.sort()
  }
}

function fixColors(card) {
  // Adventure cards with the adventure part being a different color often have that face
  // marked as the wrong color.
  // Split cards often have both faces marked as both colors.
  if (card.layout === 'adventure' || card.layout === 'split') {
    for (const face of card.card_faces) {
      face.colors = ['W', 'U', 'B', 'R', 'G'].filter(c => face.mana_cost.includes(c))
    }
  }
}

function cleanScryfallCards(cards) {
  for (const card of cards) {
    adjustFaces(card)
    cleanImageUris(card)
    cleanLegalities(card)
    renameIdField(card)
    fixColors(card)
    addColorIndicators(card)
    sortColors(card)
  }
}

function prefilterVersions(cards) {
  const filteredCards = []

  for (let i = 0; i < cards.length; i++) {
    const card = { ...cards[i] } // Clone to avoid modifying original

    if (
      card.layout === 'art_series'
      || card.layout === 'vanguard'
      || card.layout === 'double_faced_token'
      || card.layout === 'scheme'
    ) {
      continue
    }

    if (card.lang !== 'en') {
      continue
    }
    else {
      delete card.lang
    }

    if (card.textless || card.full_art) {
      continue
    }
    else {
      delete card.textless
      delete card.full_art
    }

    filteredCards.push(card)
  }

  return filteredCards
}

function postfilterVersions(cards) {
  const filteredCards = []

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    let shouldInclude = true

    for (const face of card.card_faces) {
      if (!face.type_line) {
        shouldInclude = false
        break
      }

      if (face.type_line.includes('Card')) {
        shouldInclude = false
        break
      }
    }

    if (shouldInclude) {
      filteredCards.push(card)
    }
  }

  return filteredCards
}

// Function to process a single card
function processSingleCard(card) {
  // Make a deep copy to avoid modifying the original
  const cardCopy = JSON.parse(JSON.stringify(card))

  // Run through all our processing steps
  const prefiltered = prefilterVersions([cardCopy])
  if (prefiltered.length === 0) {
    return null // Card was filtered out
  }

  cleanScryfallCards(prefiltered)

  const postfiltered = postfilterVersions(prefiltered)
  if (postfiltered.length === 0) {
    return null // Card was filtered out
  }

  return {
    _id: postfiltered[0]._id,
    source: 'scryfall',
    data: postfiltered[0],
  }
}

// Function to process an array of cards
function processCards(cards) {
  // Pre-filter
  const prefilteredCards = prefilterVersions(cards)

  // Clean
  cleanScryfallCards(prefilteredCards)

  // Post-filter
  const postfilteredCards = postfilterVersions(prefilteredCards)

  // Format for database
  return postfilteredCards.map(data => ({
    _id: data._id,
    source: 'scryfall',
    data,
  }))
}

async function fetchScryfallDefaultCards(uri) {
  const result = await axios.get(uri, {
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
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

function getLatestCachedFile() {
  const cachedDir = 'cached'
  if (!fs.existsSync(cachedDir)) {
    return null
  }

  const files = fs.readdirSync(cachedDir)
  if (files.length === 0) {
    return null
  }

  // Sort files alphabetically and get the last one
  const latestFile = files.sort().pop()
  return path.join(cachedDir, latestFile)
}

async function downloadAndLoadScryfallData(useCache) {
  let cachedFilename
  let outputFilename

  if (useCache) {
    cachedFilename = getLatestCachedFile()
    if (!cachedFilename) {
      throw new Error('No cached files found. Will download from Scryfall.')
    }
    else {
      console.log(`...using latest cached file: ${cachedFilename}`)
      // Extract the base filename for the output file
      const baseFilename = path.basename(cachedFilename)
      outputFilename = path.join('card_data', baseFilename)
    }
  }

  if (!useCache) {
    const downloadUri = await fetchScryfallDefaultDataUri()
    cachedFilename = 'cached/' + downloadUri.split('/').slice(-1)[0]
    outputFilename = 'card_data/' + downloadUri.split('/').slice(-1)[0]
  }

  let cards

  if (fs.existsSync(cachedFilename)) {
    console.log('...loading card data from disk')
    const cardData = fs.readFileSync(cachedFilename)
    cards = JSON.parse(cardData)
  }
  else {
    console.log('...downloading card data from Scryfall')
    const downloadUri = await fetchScryfallDefaultDataUri()
    cards = await fetchScryfallDefaultCards(downloadUri)

    console.log('...writing raw data to disk: ' + cachedFilename)
    if (!fs.existsSync('cached')){
      fs.mkdirSync('cached')
    }
    fs.writeFileSync(cachedFilename, JSON.stringify(cards))
  }

  return { cards, outputFilename }
}

async function fetchFromScryfallAndClean(useCache) {
  console.log('Fetching scryfall data' + (useCache ? ' (using latest cached file)' : ''))
  const { cards, outputFilename } = await downloadAndLoadScryfallData(useCache)

  console.log('...processing cards')
  const formattedCards = processCards(cards)

  const count = formattedCards.length
  console.log(`...${count} cards after processing`)

  console.log('...writing data to ' + outputFilename)
  if (!fs.existsSync('card_data')){
    fs.mkdirSync('card_data')
  }
  fs.writeFileSync(outputFilename, JSON.stringify(formattedCards, null, 2))

  console.log('...done')
}


////////////////////////////////////////////////////////////////////////////////
// Main

// Only run the main function if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  const useCache = args.includes('--use-cache')

  fetchFromScryfallAndClean(useCache)
}

// Export the functions that are used by other files
export {
  processSingleCard,
  processCards,
  fetchFromScryfallAndClean,
  fetchScryfallDefaultDataUri,
  fetchScryfallDefaultCards,
  downloadAndLoadScryfallData,
}
