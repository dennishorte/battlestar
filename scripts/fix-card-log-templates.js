#!/usr/bin/env node
/**
 * Fix hardcoded card names in game.log.add templates.
 * Replaces the card's own name with {card} and adds card: this to args.
 */
const fs = require('fs')
const path = require('path')

const CARDS_DIR = path.join(__dirname, '..', 'common', 'agricola', 'res', 'cards')

let totalFiles = 0
let modifiedFiles = 0
let totalReplacements = 0

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')

  // Extract card name from the definition
  const nameMatch = content.match(/^\s*name:\s*["'](.+?)["']/m)
  if (!nameMatch) return

  const cardName = nameMatch[1]
  totalFiles++

  // Build a regex-safe version of the card name that also matches escaped apostrophes
  // e.g. "Gypsy's Crock" should match both `Gypsy's Crock` and `Gypsy\'s Crock`
  const escapedName = cardName
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/'/g, `(?:'|\\\\'?)`)

  // Match game.log.add({ template: '...CardName...', args: { ... } })
  // We need to find template strings that contain the card name literally,
  // where the args don't already include 'card:'
  const logAddRegex = new RegExp(
    // Match: template: 'something CardName something',
    // followed by args: { ... } without card:
    `(template:\\s*['"\`])([^'"\`]*?)(${escapedName})([^'"\`]*?)(['"\`],\\s*\\n\\s*args:\\s*\\{)([^}]*?)(\\})`,
    'g'
  )

  let newContent = content
  let fileReplacements = 0

  newContent = content.replace(logAddRegex, (match, prefix, before, name, after, argsStart, argsBody, argsEnd) => {
    // Skip if args already has card:
    if (/\bcard[:\s]/.test(argsBody)) {
      return match
    }

    fileReplacements++
    totalReplacements++

    // Replace the card name with {card} in template
    const newTemplate = `${prefix}${before}{card}${after}${argsStart}${argsBody}, card: this${argsEnd}`
    return newTemplate
  })

  if (fileReplacements > 0) {
    fs.writeFileSync(filePath, newContent)
    modifiedFiles++
    console.log(`  ${path.relative(CARDS_DIR, filePath)}: ${fileReplacements} replacement(s)`)
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDir(fullPath)
    } else if (entry.name.endsWith('.js')) {
      processFile(fullPath)
    }
  }
}

console.log('Scanning card files...\n')
walkDir(CARDS_DIR)
console.log(`\nDone: ${totalReplacements} replacements across ${modifiedFiles}/${totalFiles} files`)
