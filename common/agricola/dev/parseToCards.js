const fs = require('fs')
const csv = require('csv-parser')
const util = require('../../lib/util.js')

async function readCsv(filename) {
  return new Promise(function(resolve, reject) {
    const rows = []
    fs.createReadStream(filename)
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row)
      })
      .on('end', () => {
        resolve(rows)
      })
      .on('error', reject)
  })
}

function removeUnwantedKeys(card) {
  const keys = [
    'name',
    'type',
    'cost',
    'vps',
    'prereqs',
    'passLeft',
    'text',
  ]

  for (const key of Object.keys(card)) {
    if (!keys.includes(key)) {
      delete card[key]
    }
  }
}

function convertNumberKeys(card) {
  card.vps = parseInt(card.vps) || 0
  card.players = parseInt(card.players) || 1
}

function downcaseTypes(card) {
  card.type = card.type.toLowerCase()
}

function insertIds(card) {
  card.id = card.name.toLowerCase().replace(' ', '_')
}

function convertPassLeft(card) {
  card.passLeft = card.passLeft === 'X'
}

function convertCosts(card) {
  if (card.cost.trim() === '') {
    card.cost = []
  }
  else {
    const costs = card
      .cost
      .split(',')
      .map(c => c.toLowerCase())

    const convertedCost = {}

    for (const token of costs) {
      if (token === 'special') {
        convertedCost['special'] = 'TBD'
      }
      else {
        const [count, kind] = token.split(' ')
        convertedCost[kind] = count
      }
    }

    card.cost = convertedCost
  }
}

function convertPrereqs(card) {
  if (card.prereqs.trim().length === 0) {
    card.prereqs = []
  }
  else {
    card.prereqs = [card.prereqs]
  }
}

function convertText(card) {
  if (card.text.trim().length === 0) {
    card.text = []
  }
  else {
    card.text = [card.text]
  }
}

async function main(filename) {
  const cards = await readCsv(filename)

  for (const card of cards) {
    removeUnwantedKeys(card)
    convertNumberKeys(card)
    convertPassLeft(card)
    convertPrereqs(card)
    convertCosts(card)
    convertText(card)
    downcaseTypes(card)
    insertIds(card)
    console.log(card)
  }
}


main(process.argv[2])
