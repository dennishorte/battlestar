const util = require('../lib/util.js')


const CardLookup = {}
module.exports = CardLookup


CardLookup.getByIdDict = function(dict, lookupMap, opts={}) {
  const versions = lookupMap[dict.name.toLowerCase()]

  if (!versions) {
    return null
  }
  else if (opts.allVersions) {
    return versions
  }
  else if (dict.custom_id) {
    return versions.find(card => card.custom_id === dict.custom_id)
  }
  else if (dict.set && dict.collector_number) {
    // Added this weird hack to handle a case where a version number seems to have changed
    // in the scryfall data.

    // Don't choose a custom card if no custom card id is present.
    const remainder = versions.filter(card => !card.custom_id)

    let maybe

    maybe = remainder.find(card => card.set === dict.set && card.collector_number === dict.collector_number)

    if (maybe) {
      return maybe
    }
    else {
      maybe = remainder.find(card => card.set === dict.set)
    }

    if (maybe) {
      return maybe
    }
    else {
      return remainder[0]
    }
  }
  else {
    // Custom cards tend to end up in the first position, so choose a non-custom card if possible.
    return versions.slice(-1)[0]
  }
}

CardLookup.insertCardData = function(cardlist, lookupFunc) {
  for (const card of cardlist) {
    if (!card.data) {
      const data = lookupFunc(card)
      if (data) {
        card.data = data
      }
    }
  }
}

CardLookup.dictFactory = function(cards) {
  return util.array.collect(cards, _allCardNames)
}

CardLookup.factory = function(cards) {
  const lookupMap = CardLookup.dictFactory(cards)
  return (cardId, opts) => CardLookup.getByIdDict(cardId, lookupMap, opts)
}

function _allCardNames(card) {
  if (!card.name) {
    console.log(card)
  }

  const names = [card.name]

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
