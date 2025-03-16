const fs = require('fs');

// Read input file
function readInputFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    process.exit(1);
  }
}

// Parse fixed-width formatted data
function parseFixedWidth(data) {
  const lines = data.trim().split('\n');
  
  // Skip the header line
  const dataLines = lines.slice(1);
  
  // Extract data from each line
  return dataLines.map(line => {
    // Split by multiple spaces (2 or more)
    const parts = line.split(/\s{2,}/);
    
    // Trim any remaining spaces
    const trimmedParts = parts.map(part => part.trim());
    
    if (trimmedParts.length >= 4) {
      return {
        name: trimmedParts[0],
        age: trimmedParts[1],
        color: trimmedParts[2],
        biscuits: trimmedParts[3]
      };
    }
    return null;
  }).filter(entry => entry !== null);
}

// Format as original style
function formatAsOriginal(data) {
  return data.map(entry => {
    return [
      entry.name,
      entry.color,
      entry.age,
      entry.biscuits
    ].join('\n');
  }).join('\n\n');
}

// Write output to file
function writeOutputFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, data, 'utf8');
    console.log(`Output written to ${filePath}`);
  } catch (error) {
    console.error(`Error writing file: ${error.message}`);
    process.exit(1);
  }
}

// Main function
function main() {
  if (process.argv.length < 4) {
    console.error('Usage: node reverse-script.js <input_file> <output_file>');
    process.exit(1);
  }
  
  const inputFilePath = process.argv[2];
  const outputFilePath = process.argv[3];
  
  const inputData = readInputFile(inputFilePath);
  const parsedData = parseFixedWidth(inputData);
  const originalFormat = formatAsOriginal(parsedData);
  
  writeOutputFile(outputFilePath, originalFormat);
}

main();
