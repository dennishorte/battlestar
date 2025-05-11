const readlines = require('n-readlines')


function inputFileName() {
  return process.argv[2]
}

function blankCard() {
  return {
    name: '',
    aspect: '',
    race: '',
    expansion: '',
    cost: 0,
    points: 0,
    innerPoints: 0,
    count: 0,
    text: []
  }
}

function parseFile(filename) {
  let exp
  let card = blankCard()
  const cards = []

  function __completeCard() {
    if (card.name) {
      card.expansion = exp
      cards.push(card)
      card = blankCard()
    }
  }

  const lineReader = new readlines(filename)
  let line

  while ((line = lineReader.next()) !== false) {
    line = line.toString('utf-8').trim()

    if (line.length === 0) {
      __completeCard()
    }

    else if (line.startsWith('# Set=')) {
      exp = line.slice(6)
    }

    else if (!card.name) {
      card.name = line
    }

    else if (!card.aspect) {
      card.aspect = line
    }

    else if (!card.race) {
      card.race = line
    }

    else if (!card.cost) {
      const [cost, points, inner] = line.split('').map(ch => {
        if (ch === '-') {
          return -1
        }
        else {
          return parseInt(ch)
        }
      })

      card.cost = cost
      card.points = points
      card.innerPoints = inner
    }

    else if (!card.count) {
      card.count = parseInt(line)
    }

    else {
      card.text.push(line)
    }

  }

  __completeCard()
  return cards
}

const cards = parseFile(inputFileName())
console.log(JSON.stringify(cards, null, 2))
