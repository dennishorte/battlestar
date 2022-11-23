const fs = require('fs')

const cardNames = [
  'advance scout',
  'agility',
  'akki ember-keeper',
  'benalish hero',
  'goblin balloon brigade',
  'holy strength',
  'lightning bolt',
  'mountain',
  'plains',
  'shock',
  'tithe',
  'white knight',
]

function loadCards() {
  const scryfallFolder = 'card_data'
  const files = fs
    .readdirSync(scryfallFolder)
    .filter(filename => filename.startsWith('default-cards-'))
    .sort()
  const latest = files[files.length - 1]

  console.log('loading card data from ' + latest)

  const data = fs.readFileSync(scryfallFolder + '/' + latest).toString()
  const cards = JSON.parse(data)

  return cards
}

function selectData(cards, names) {
  const output = []
  for (const name of names) {
    output.push(cards.find(card => card.name.toLowerCase() === name))
  }
  return output
}

function writeData(data) {
  console.log(JSON.stringify(data, null, 2))
}

function main() {
  const cards = loadCards()
  const data = selectData(cards, cardNames)
  writeData(data)
}

main()
