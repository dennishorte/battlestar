#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { processSingleCard } = require('./fetch_scryfall_cards.js')

/**
 * A CLI utility to process single card JSON files using the card formatting logic.
 *
 * Usage:
 *   node process_card.js <input_file> [output_file]
 *
 * Arguments:
 *   input_file  - Path to JSON file containing a single card object
 *   output_file - (Optional) Path to write the processed card JSON.
 *                 If not provided, output is written to stdout.
 */

// Get command line arguments
const args = process.argv.slice(2)

if (args.length < 1) {
  console.error('Usage: node process_card.js <input_file> [output_file]')
  process.exit(1)
}

const inputFile = args[0]
const outputFile = args[1]

// Read and parse the input file
try {
  // Check if input file exists
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file '${inputFile}' not found`)
    process.exit(1)
  }

  const inputData = fs.readFileSync(inputFile, 'utf8')
  const card = JSON.parse(inputData)

  // Process the card
  const processedCard = processSingleCard(card)

  if (processedCard === null) {
    console.error('Card was filtered out during processing')
    process.exit(0)
  }

  // Format the output
  const outputData = JSON.stringify(processedCard, null, 2)

  // Write to output file or stdout
  if (outputFile) {
    // Create directories if they don't exist
    const outputDir = path.dirname(outputFile)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(outputFile, outputData)
    console.log(`Processed card written to ${outputFile}`)
  }
  else {
    console.log(outputData)
  }

}
catch (error) {
  console.error(`Error: ${error.message}`)
  process.exit(1)
}
