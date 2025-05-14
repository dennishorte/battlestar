#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { processSingleCard } from './fetch_scryfall_cards.js'

/**
 * A utility to process custom card JSON files using the same formatting logic as Scryfall cards.
 * This ensures custom cards are formatted consistently with Scryfall cards.
 *
 * The script handles:
 * 1. Adding missing required fields (id, set, collector_number, etc.)
 * 2. Ensuring cards have the correct structure (card_faces, image_uris, etc.)
 * 3. Processing cards through the same pipeline as Scryfall cards
 * 4. Setting the source to 'custom' instead of 'scryfall'
 *
 * This allows custom cards to be used alongside Scryfall cards in the application.
 *
 * Usage:
 *   node process_custom_cards.js [input_file] [output_file]
 *
 * Arguments:
 *   input_file  - (Optional) Path to JSON file containing custom cards
 *                 Default is './cards.json'
 *   output_file - (Optional) Path to write the processed cards JSON.
 *                 Default is './processed_cards.json'
 */

// Get command line arguments
const args = process.argv.slice(2)
const inputFile = args[0] || './cards.json'
const outputFile = args[1] || './processed_cards.json'

// Function to add missing required fields if they don't exist
function prepareCardsForProcessing(cards) {
  return cards.map((card, index) => {
    const preparedCard = { ...card }

    // Add required fields that might be missing from custom cards
    if (!preparedCard.collector_number) {
      preparedCard.collector_number = `custom-${index + 1}`
    }

    if (!preparedCard.set) {
      preparedCard.set = 'custom'
    }

    if (!preparedCard.digital) {
      preparedCard.digital = false
    }

    // Ensure language is set (required by prefilterVersions)
    if (!preparedCard.lang) {
      preparedCard.lang = 'en'
    }

    // Needed for prefiltering
    if (preparedCard.textless === undefined) {
      preparedCard.textless = false
    }

    if (preparedCard.full_art === undefined) {
      preparedCard.full_art = false
    }

    // Ensure each card face has an image_uri field
    if (preparedCard.card_faces && Array.isArray(preparedCard.card_faces)) {
      preparedCard.card_faces.forEach(face => {
        if (!face.image_uris) {
          face.image_uris = { art_crop: 'https://example.com/placeholder.jpg' }
        }
      })
    }

    // Add legalities if missing
    if (!preparedCard.legalities) {
      preparedCard.legalities = { custom: 'legal' }
    }

    return preparedCard
  })
}

// Process cards one by one using processSingleCard
function processCustomCards(cards) {
  const results = []

  for (let i = 0; i < cards.length; i++) {
    try {
      const processedCard = processSingleCard(cards[i])
      if (processedCard) {
        // Override the source to be 'custom' instead of 'scryfall'
        processedCard.source = 'custom'
        results.push(processedCard)
      }
    }
    catch (error) {
      console.log(`Error processing card ${i} (${cards[i].name || 'unnamed'}): ${error.message}`)
    }
  }

  return results
}

try {
  // Check if input file exists
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file '${inputFile}' not found`)
    process.exit(1)
  }

  // Read and parse the input file
  console.log(`Reading cards from ${inputFile}...`)
  const inputData = fs.readFileSync(inputFile, 'utf8')
  const cards = JSON.parse(inputData)

  console.log(`Found ${cards.length} cards to process`)

  // Prepare cards by adding any missing required fields
  const preparedCards = prepareCardsForProcessing(cards)

  // Process each card individually
  console.log('Processing cards...')
  const processedCards = processCustomCards(preparedCards)

  console.log(`Successfully processed ${processedCards.length} cards`)

  // Write to output file
  console.log(`Writing processed cards to ${outputFile}...`)
  const outputDir = path.dirname(outputFile)
  if (!fs.existsSync(outputDir) && outputDir !== '.') {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  fs.writeFileSync(outputFile, JSON.stringify(processedCards, null, 2))
  console.log('Done!')
}
catch (error) {
  console.error(`Error: ${error.message}`)
  console.error(`Stack trace: ${error.stack}`)
  process.exit(1)
}
