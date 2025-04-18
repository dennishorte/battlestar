const util = require('../lib/util.js')

function create(cards) {
  return {
    array: cards,
    byId: util.array.toDict(cards, '_id'),
    byName: util.array.collect(cards, _allCardNames),
  }
}

module.exports = {
  create,
}


////////////////////////////////////////////////////////////////////////////////
// Helper functions

function _allCardNames(card) {
  if (!card.data || !card.data.name) {
    console.log('card has no name: ', card)
  }

  const names = [card.data.name]

  if (card.card_faces) {
    for (const face of card.card_faces) {
      names.push(face.name)
    }
  }

  // Add version with accents removed, so the lookup works either way
  for (const name of names) {
    const normalized = name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    if (names.indexOf(normalized) === -1) {
      names.push(normalized)
    }
  }

  // Add version with smart quotes removed, so the lookup works either way
  for (const name of names) {
    const normalized = name
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
    if (names.indexOf(normalized) === -1) {
      names.push(normalized)
    }
  }

  return names.map(name => name.toLowerCase())
}
