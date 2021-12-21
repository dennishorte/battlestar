const fs = require('fs')
const path = require('path')
const readlines = require('n-readlines')
const format = require('string-format')

const util = require('../../lib/util.js')


function inputfile() {
  return process.argv[2]
}

function cardFileName(card) {
  return util.toCapsCase(card.name) + '.js'
}

function outputPrefix() {
  return process.argv[3]
}

function cardTemplate() {
  return fs.readFileSync('dev/card_template.js', 'utf8')
}

function setTemplate() {
  return fs.readFileSync('dev/set_template.js', 'utf8')
}

function newCard() {
  return {
    name: '',
    color: '',
    age: '',
    icons: '',
    dogmaIcon: '',
    dogma: [],
  }
}

function processFile(filename) {
  const cards = []
  let card = newCard()

  const lineReader = new readlines(filename)
  let line;

  while (line = lineReader.next()) {
    line = line.toString('utf-8').trim()
    if (line.length === 0) {
      cards.push(card)
      card = newCard()
    }
    else if (!card.name) {
      card.name = line
    }
    else if (!card.color) {
      card.color = line
    }
    else if (!card.age) {
      card.age = parseInt(line)
    }
    else if (!card.icons) {
      card.icons = line
    }
    else {
      card.dogmaIcon = line[0]
      card.dogma.push(line.slice(3))
    }

  }

  if (card.name) {
    cards.push(card)
  }

  return cards
}

function generateCardFiles(cards, pathPrefix) {
  for (const card of cards) {
    const filename = path.join(pathPrefix, cardFileName(card))
    fs.writeFileSync(filename, generateCardFile(card))
  }
}

function generateCardFile(card) {
  const template = cardTemplate()
  card.dogma = card.dogma.map(d => `"${d}"`).join(',\n    ')
  return format(template, card)
}

function generateSetFile(cards, pathPrefix) {
  const template = setTemplate()
  const cardsLines = []
  for (const card of cards) {
    cardsLines.push(`require('./${cardFileName(card)}')`)
  }
  const cardsData = cardsLines.join(',\n  ')
  const fileData = format(template, cardsData)
  const filename = path.join(pathPrefix, 'index.js')
  fs.writeFileSync(filename, fileData)
}

const cards = processFile(inputfile())
generateCardFiles(cards, outputPrefix())
generateSetFile(cards, outputPrefix())
