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

function expansionCode() {
  return process.argv[3]
}

function cardTemplate() {
  return fs.readFileSync('card_template.js', 'utf8')
}

function setTemplate() {
  return fs.readFileSync('set_template.js', 'utf8')
}

function newCard() {
  return {
    expansion: expansionCode(),
    name: '',
    color: '',
    age: '',
    biscuits: '',
    dogmaBiscuit: '',
    echo: '',
    inspire: '',
    dogma: [],
    karma: [],
  }
}

function processFile(filename) {
  const cards = []
  let card = newCard()

  const lineReader = new readlines(filename)
  let line
  let linenum = 0

  while ((line = lineReader.next()) !== false) {
    line = line.toString('utf-8').trim()
    if (line.length === 0) {
      if (!card.name) {
        throw new Error(`Card without name in ${filename} at line ${linenum}`)
      }
      if (!card.age) {
        throw new Error(`Card without age in ${filename} at line ${linenum}`)
      }
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
    else if (!card.biscuits) {
      card.biscuits = line
    }
    else if (line.startsWith('&')) {
      card.echo = line.slice(2)
    }
    else if (line.startsWith('*')) {
      card.inspire = line.slice(2)
    }
    else if (line.startsWith('-')) {
      card.karma.push(line.slice(2))
    }
    else {
      card.dogmaBiscuit = line[0]
      card.dogma.push(line.slice(3))
    }

    linenum += 1
  }

  if (card.name) {
    cards.push(card)
  }

  ensureDogmaBiscuits(cards)

  return cards
}

// For cards that don't have dogma effects, they won't have an established dogma biscuit.
// Those cards always have only a single biscuit type, so just find that and set the type.
function ensureDogmaBiscuits(cards) {
  for (const card of cards) {
    if (!card.dogmaBiscuit) {
      // City cards require actual counting
      if (card.biscuits.length === 6) {
        card.dogmaBiscuit = ['l', 's', 'i', 'k', 'c', 'f']
          .map(biscuit => ({ biscuit, count: card.biscuits.split(biscuit).length - 1 }))
          .sort((l, r) => r.count - l.count)[0].biscuit
      }

      // Figures cards always have a single kind of biscuit.
      else {
        for (const biscuit of ['l', 's', 'i', 'k', 'c', 'f']) {
          if (card.biscuits.includes(biscuit)) {
            card.dogmaBiscuit = biscuit
            break
          }
        }
      }
    }
  }
}

function generateCardFiles(cards, pathPrefix) {
  for (const card of cards) {
    const filename = path.join(pathPrefix, cardFileName(card))
    fs.writeFileSync(filename, generateCardFile(card))
  }
}

function generateCardFile(card) {
  const template = cardTemplate()
  card.dogma = formatArray(card.dogma)
  card.karma = formatArray(card.karma)
  return format(template, card)
}

function formatArray(arr) {
  if (arr.length === 0) {
    return ''
  }
  else {
    const lines = arr.map(d => '`' + d + '`').join(',\n    ')
    return '\n    ' + lines + '\n  '
  }
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
generateCardFiles(cards, expansionCode())
generateSetFile(cards, expansionCode())
