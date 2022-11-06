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
    else if (line === 'command' || line === 'commander') {
      zone = cards.command
    }
    else {
      zone.push(this.parseDeckListLine(line))
    }
  }

  return cards
}

DeckUtil.parseDeckListLine = function(line0) {
  const [line1, count] = this.parseDeckLineCount(line0)
  const data = this.parseDeckLineName(line1)
  data.count = count
  return data
}

DeckUtil.parseDeckLineCount = function(line) {
  // Card has a count in front of it
  if (util.isDigit(line.charAt(0))) {
    const firstSpaceIndex = line.indexOf(' ')
    const count = parseInt(line.slice(0, firstSpaceIndex))
    const name = line.slice(firstSpaceIndex + 1)
    return [name, count]
  }

  // Just a card name, with no count in front
  else {
    return [line, 1]
  }
}

DeckUtil.parseDeckLineName = function(line) {
  const tokens = line.split(' ')
  const output = {
    name: line,
    setCode: null,
    collectorNumber: null,
  }

  if (tokens.length < 3) {
    return output
  }

  const lastToken = tokens[tokens.length - 1]
  if (!util.isDigit(lastToken.charAt(0))) {
    return output
  }

  const penultimateToken = tokens[tokens.length - 2]
  if (penultimateToken.slice(0, 1) === '(' && penultimateToken.slice(-1) === ')') {
    output.name = tokens.slice(0, -2).join(' ')
    output.setCode = penultimateToken.slice(1, -1)
    output.collectorNumber = lastToken
  }

  return output
}

export default DeckUtil
