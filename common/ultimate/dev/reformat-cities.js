const fs = require('fs')

// Read input file
function readInputFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  }
  catch (error) {
    console.error(`Error reading file: ${error.message}`)
    process.exit(1)
  }
}

// Parse the input data
function parseInput(data) {
  const entries = []
  const blocks = data.trim().split('\n\n')

  for (const block of blocks) {
    const lines = block.trim().split('\n')
    if (lines.length >= 4) {
      entries.push({
        name: lines[0],
        color: lines[1],
        age: parseInt(lines[2], 10),
        biscuits: lines[3]
      })
    }
  }

  return entries
}

// Define color order for sorting
const colorOrder = {
  'red': 1,
  'yellow': 2,
  'green': 3,
  'blue': 4,
  'purple': 5
}

// Sort the data
function sortData(data) {
  return data.sort((a, b) => {
    // First sort by age
    if (a.age !== b.age) {
      return a.age - b.age
    }

    // Then by color according to specified order
    const colorA = colorOrder[a.color] || 999
    const colorB = colorOrder[b.color] || 999
    if (colorA !== colorB) {
      return colorA - colorB
    }

    // Finally alphabetically by name
    return a.name.localeCompare(b.name)
  })
}

// Format with fixed-width columns
function formatAsFixedWidth(data) {
  // Calculate column widths based on data and headers
  const nameWidth = Math.max(4, ...data.map(entry => entry.name.length))
  const ageWidth = Math.max(3, ...data.map(entry => String(entry.age).length))
  const colorWidth = Math.max(5, ...data.map(entry => entry.color.length))

  // Format header
  const header = [
    'name'.padEnd(nameWidth),
    'age'.padEnd(ageWidth),
    'color'.padEnd(colorWidth),
    'biscuits'
  ].join('  ')

  // Format rows
  const rows = data.map(entry => [
    entry.name.padEnd(nameWidth),
    String(entry.age).padEnd(ageWidth),
    entry.color.padEnd(colorWidth),
    entry.biscuits
  ].join('  '))

  return [header, ...rows].join('\n')
}

// Write output to file
function writeOutputFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, data, 'utf8')
    console.log(`Output written to ${filePath}`)
  }
  catch (error) {
    console.error(`Error writing file: ${error.message}`)
    process.exit(1)
  }
}

// Main function
function main() {
  if (process.argv.length < 4) {
    console.error('Usage: node script.js <input_file> <output_file>')
    process.exit(1)
  }

  const inputFilePath = process.argv[2]
  const outputFilePath = process.argv[3]

  const inputData = readInputFile(inputFilePath)
  const parsedData = parseInput(inputData)
  const sortedData = sortData(parsedData)
  const formattedOutput = formatAsFixedWidth(sortedData)

  writeOutputFile(outputFilePath, formattedOutput)
}

main()
