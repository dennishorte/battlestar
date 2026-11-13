#!/usr/bin/env node
'use strict'

// Lists every shared field on every Agricola card definition, including nested
// keys inside objects and arrays of objects. A field that is only mentioned
// inside the card file that declares it is private to that card and is left
// out. Use this when writing or updating
// common/agricola/docs/specs/card-format.md so a rare shared field is not
// left out.
//
//   npm run list-card-fields -w common
//   npm run list-card-fields -w common -- --check

const fs = require('fs')
const path = require('path')

const major = require('../agricola/res/cards/major')
const res = require('../agricola/res')
const testCards = require('../agricola/res/cards/test')

const FORMAT_DOC = path.resolve(__dirname, '../agricola/docs/specs/card-format.md')
const CARDS_ROOT = path.resolve(__dirname, '../agricola/res/cards')
const GAME_ROOT = path.resolve(__dirname, '../agricola')
const APP_ROOT = path.resolve(__dirname, '../../app/src')
const MAX_DEPTH = 4
const EXAMPLE_LIMIT = 8
const IDENTIFIER = /\b[A-Za-z_][A-Za-z0-9_]*\b/g
const sourceFiles = new WeakMap()

function loadCards() {
  const seen = new Set()
  const cards = []
  const sources = [
    ...major.getAllCards(),
    ...res.getAllCards(),
    ...testCards.getAllCards(),
  ]
  for (const card of sources) {
    if (!card || seen.has(card.id)) {
      continue
    }
    seen.add(card.id)
    cards.push(card)
  }
  return cards
}

function valueKind(value) {
  if (value == null) {
    return 'empty'
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'array'
    }
    const inner = [...new Set(value.map(valueKind))].sort().join('|')
    return `array<${inner}>`
  }
  if (typeof value === 'function') {
    return 'function'
  }
  return typeof value
}

function remember(fields, fieldPath, card, value) {
  let entry = fields.get(fieldPath)
  if (!entry) {
    entry = { count: 0, kinds: new Set(), examples: [], files: new Set() }
    fields.set(fieldPath, entry)
  }
  entry.count += 1
  entry.kinds.add(valueKind(value))
  const sourceFile = sourceFiles.get(card)
  if (sourceFile) {
    entry.files.add(sourceFile)
  }
  if (entry.examples.length < EXAMPLE_LIMIT) {
    entry.examples.push(card.id)
  }
}

function isPlainObject(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}

function walk(fields, card, value, fieldPath, depth) {
  if (depth > MAX_DEPTH || value == null || typeof value === 'function') {
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      if (!isPlainObject(item)) {
        continue
      }
      for (const key of Object.keys(item)) {
        const childPath = `${fieldPath}[].${key}`
        remember(fields, childPath, card, item[key])
        walk(fields, card, item[key], childPath, depth + 1)
      }
    }
    return
  }
  if (!isPlainObject(value)) {
    return
  }
  for (const key of Object.keys(value)) {
    const childPath = fieldPath ? `${fieldPath}.${key}` : key
    remember(fields, childPath, card, value[key])
    walk(fields, card, value[key], childPath, depth + 1)
  }
}

function collectFields(cards) {
  const fields = new Map()
  for (const card of cards) {
    walk(fields, card, card, '', 0)
  }
  return fields
}

function walkSourceFiles(dir, files) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    if (fs.statSync(full).isDirectory()) {
      if (name === 'node_modules' || name === 'dist') {
        continue
      }
      walkSourceFiles(full, files)
      continue
    }
    if (name.endsWith('.test.js')) {
      continue
    }
    if (name.endsWith('.js') || name.endsWith('.vue')) {
      files.push(full)
    }
  }
  return files
}

function indexCardSources() {
  const idToFile = new Map()
  for (const file of walkSourceFiles(CARDS_ROOT, [])) {
    const exported = require(file)
    const cards = []
    if (exported && exported.id) {
      cards.push(exported)
    }
    if (exported && Array.isArray(exported.cardData)) {
      cards.push(...exported.cardData)
    }
    for (const card of cards) {
      if (card && card.id && !idToFile.has(card.id)) {
        idToFile.set(card.id, file)
      }
    }
  }
  return idToFile
}

function attachSourceFiles(cards) {
  const idToFile = indexCardSources()
  for (const card of cards) {
    const file = idToFile.get(card.id)
    if (file) {
      sourceFiles.set(card, file)
    }
  }
  return cards
}

function identifierSets() {
  const files = []
  const roots = [GAME_ROOT, APP_ROOT]
  for (const root of roots) {
    for (const file of walkSourceFiles(root, [])) {
      const text = fs.readFileSync(file, 'utf8')
      files.push({ file, names: new Set(text.match(IDENTIFIER) || []) })
    }
  }
  return files
}

function topLevelName(fieldPath) {
  const dot = fieldPath.indexOf('.')
  const bracket = fieldPath.indexOf('[')
  let end = fieldPath.length
  if (dot !== -1 && dot < end) {
    end = dot
  }
  if (bracket !== -1 && bracket < end) {
    end = bracket
  }
  return fieldPath.slice(0, end)
}

// A field is private when no game code outside the card files that declare it
// mentions the name. Nested keys stay when their parent field is shared,
// because the engine reads that object. They drop when the parent is private.
function omitPrivateFields(fields, sources) {
  const privateNames = new Set()
  for (const [fieldPath, entry] of fields) {
    if (fieldPath !== topLevelName(fieldPath)) {
      continue
    }
    const usedOutside = sources.some(source =>
      !entry.files.has(source.file) && source.names.has(fieldPath)
    )
    if (!usedOutside) {
      privateNames.add(fieldPath)
    }
  }
  // The engine calls matches_<hook> by building the name from the hook it is
  // already calling, so that gate is shared whenever the hook is.
  for (const name of privateNames) {
    if (!name.startsWith('matches_')) {
      continue
    }
    const hook = name.slice('matches_'.length)
    if (!privateNames.has(hook)) {
      privateNames.delete(name)
    }
  }
  if (privateNames.size === 0) {
    return fields
  }
  const shared = new Map()
  for (const [fieldPath, entry] of fields) {
    if (!privateNames.has(topLevelName(fieldPath))) {
      shared.set(fieldPath, entry)
    }
  }
  return shared
}

function sortedEntries(fields) {
  return [...fields.entries()].sort((a, b) => {
    if (a[1].count !== b[1].count) {
      return a[1].count - b[1].count
    }
    return a[0] < b[0] ? -1 : 1
  })
}

function formatEntry(fieldPath, entry) {
  const kinds = [...entry.kinds].sort().join(', ')
  const examples = entry.examples.join(', ')
  const more = entry.count > entry.examples.length ? `, … ${entry.count} cards` : ''
  return `${fieldPath}  (${entry.count}; ${kinds})  ${examples}${more}`
}

function printReport(cards, fields, omittedCount) {
  const entries = sortedEntries(fields)
  const top = entries.filter(([fieldPath]) => !fieldPath.includes('.') && !fieldPath.includes('['))
  const nested = entries.filter(([fieldPath]) => fieldPath.includes('.') || fieldPath.includes('['))
  console.log(`${cards.length} cards, ${entries.length} shared fields`)
  if (omittedCount > 0) {
    console.log(`${omittedCount} private fields omitted (only mentioned in the card that declares them)`)
  }
  console.log('\nTop-level fields, rarest first:\n')
  for (const [fieldPath, entry] of top) {
    console.log(formatEntry(fieldPath, entry))
  }
  console.log('\nNested fields, rarest first:\n')
  for (const [fieldPath, entry] of nested) {
    console.log(formatEntry(fieldPath, entry))
  }
}

function undocumentedFields(fields, docText) {
  const missing = []
  for (const fieldPath of fields.keys()) {
    if (!docText.includes(`\`${fieldPath}\``)) {
      missing.push(fieldPath)
    }
  }
  return missing.sort()
}

function sharedFieldsFromCards(cards) {
  attachSourceFiles(cards)
  const all = collectFields(cards)
  const shared = omitPrivateFields(all, identifierSets())
  return { all, shared, omitted: all.size - shared.size }
}

function fieldsMissingFromFormatDoc() {
  const docText = fs.readFileSync(FORMAT_DOC, 'utf8')
  const { shared } = sharedFieldsFromCards(loadCards())
  return undocumentedFields(shared, docText)
}

function main() {
  const cards = loadCards()
  const { shared, omitted } = sharedFieldsFromCards(cards)
  const check = process.argv.includes('--check')
  if (!check) {
    printReport(cards, shared, omitted)
    return
  }
  const missing = fieldsMissingFromFormatDoc()
  if (missing.length > 0) {
    console.error(`Card format doc is missing ${missing.length} field(s):`)
    for (const fieldPath of missing) {
      console.error(`  ${fieldPath}`)
    }
    console.error(`\nAdd them to ${path.relative(process.cwd(), FORMAT_DOC)}`)
    process.exit(1)
  }
  console.log(`${shared.size} fields are named in ${path.relative(process.cwd(), FORMAT_DOC)}`)
}

module.exports = {
  FORMAT_DOC,
  loadCards,
  collectFields,
  sharedFieldsFromCards,
  undocumentedFields,
  fieldsMissingFromFormatDoc,
}

if (require.main === module) {
  main()
}
