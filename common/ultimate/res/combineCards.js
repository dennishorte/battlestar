const fs = require('fs');
const path = require('path');

// Get card names from arguments
const args = process.argv.slice(2);
const cardNames = args.length > 0 ? args : [];

// Configure this to your directory containing the card files
const sourceDir = './base';
const outputFile = 'combinedCards.js';

// Process the files based on provided card names
function processFiles() {
  if (cardNames.length === 0) {
    console.error('No card names provided');
    console.log('Usage: node combineCards.js CardName1 CardName2 ...');
    return;
  }

  // Format card names to match file naming convention
  const cardFiles = cardNames.map(name =>
    name.replace(/\s+/g, '') + '.js'
  );

  console.log(`Looking for ${cardFiles.length} card files`);

  // Create the combined content
  const combinedContent = cardFiles.map(file => {
    const filePath = path.join(sourceDir, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: File ${filePath} not found`);
      return `// ---- ${file} ---- (NOT FOUND)\n\n`;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return `// ---- ${file} ----\n${content}\n\n`;
  }).join('');

  // Write to the output file
  fs.writeFileSync(outputFile, combinedContent);
  console.log(`Combined content written to ${outputFile}`);
}

processFiles();
