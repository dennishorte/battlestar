const DeckUtil = {}

import { util } from 'battlestar-common'

DeckUtil.deckListToCardNames = function(decklist) {
  const cards = {
    main: [],
    side: [],
    command: [],
  }

  let zone = null

  for (let line of decklist.toLowerCase().split('\n')) {
    line = line.trim()

    if (line.endsWith(':')) {
      line = line.slice(0, line.length - 1)
    }

    if (line.length === 0) {
      continue
    }
    else if (line === 'deck' || line === 'main' || line === 'maindeck') {
      zone = cards.main
    }
    else if (line === 'side' || line === 'sideboard') {
      zone = cards.side
    }
    else if (line === 'command') {
      zone = cards.command
    }
    else {
      // Card has a count in front of it
      if (util.isDigit(line.charAt(0))) {
        const firstSpaceIndex = line.indexOf(' ')
        const count = parseInt(line.slice(0, firstSpaceIndex))
        const name = line.slice(firstSpaceIndex + 1)

        zone.push({
          name,
          count,
        })
      }

      // Just a card name, with no count in front
      else {
        zone.push({
          name: line,
          count: 1,
        })
      }
    }
  }

  console.log(cards)
  return cards
}

export default DeckUtil
