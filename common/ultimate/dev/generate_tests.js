const fs = require('fs')
const path = require('path')

// Function to normalize a card name for a file name
function normalizeFileName(cardName) {
  // Remove all non-alphanumeric characters
  return cardName.replace(/[^a-zA-Z0-9]/g, '')
}

// Function to generate test file content
function generateTestContent(cardColor, cardName) {
  return `Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('${cardName}', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        ${cardColor}: ['${cardName}'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.${cardName}')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        ${cardColor}: ['${cardName}'],
      },
    })
  })

})`
}

// Function to process the input file and generate test files
function processCardFile(inputFilePath, outputDir) {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Read the input file
  const fileContent = fs.readFileSync(inputFilePath, 'utf8')
  const lines = fileContent.split('\n')

  // Process each line
  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine) {
      continue
    }

    // Split the line into color and name
    const parts = trimmedLine.split('|')
    if (parts.length !== 2) {
      console.warn(`Warning: Invalid line format: ${trimmedLine}`)
      continue
    }

    const cardColor = parts[0].trim()
    const cardName = parts[1].trim()

    // Generate the filename
    const filename = normalizeFileName(cardName) + '.test.js'

    // Generate the test content
    const content = generateTestContent(cardColor, cardName)

    // Write the test file
    const outputPath = path.join(outputDir, filename)
    fs.writeFileSync(outputPath, content)

    console.log(`Generated test file: ${outputPath}`)
  }
}

// Check if this script is being run directly
if (require.main === module) {
  // Get command line arguments
  const args = process.argv.slice(2)

  if (args.length !== 2) {
    console.log("Usage: node generate_tests.js <input_file> <output_directory>")
    process.exit(1)
  }

  const inputFile = args[0]
  const outputDir = args[1]

  processCardFile(inputFile, outputDir)
  console.log(`Done! Generated test files in ${outputDir}`)
}

// Export functions for testing or importing
module.exports = {
  normalizeFileName,
  generateTestContent,
  processCardFile
}
