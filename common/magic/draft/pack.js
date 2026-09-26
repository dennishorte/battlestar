const util = require('../../lib/util.js')
const setPackFactories = require('./set_packs/index.js')

class Pack {
  constructor(game, cards) {
    this.game = game

    this.id = null
    this.owner = null
    this.waiting = null
    this.index = null  // Used for determining pass direction

    this.cards = cards.map(c => {
      if (typeof c === 'string') {
        return {
          id: c,
          name: c,
          picker: null,
        }
      }
      else {
        return Object.assign({
          id: c.id,
          name: c.name,
          picked: null,
        }, c)
      }
    })
    this.picked = []
    this.knownCards = {}
  }

  checkCardIsAvailable(card) {
    return !this.picked.includes(card)
  }

  checkIsEmpty() {
    return this.getRemainingCards().length === 0
  }

  checkIsWaitingFor(player) {
    return this.waiting === player.name
  }

  getCardById(id) {
    return this.getRemainingCards().find(c => c.id === id)
  }

  getRemainingCards() {
    return this
      .cards
      .filter(card => !this.picked.includes(card))
  }

  getKnownCards(player) {
    return this.knownCards[player.name]
  }

  getKnownPickedCards(player) {
    const known = this.getKnownCards(player)
    return this.picked.filter(c => known.includes(c))
  }

  getPlayerPicks(player) {
    return this.cards.filter(c => c.picker === player)
  }

  pickCardById(player, cardId) {
    const card = this.cards.find(c => c.id === cardId)

    util.assert(Boolean(card), `Card with id=${cardId} not in this pack`)
    util.assert(!card.picker, `Card with id=${cardId} is already picked`)

    card.picker = player
    this.picked.push(card)
  }

  // If this player has not viewed this pack before, take note of all unpicked cards.
  // This is the set of cards that the player knows are in this pack.
  viewPack(player) {
    if (player.name in this.knownCards === false) {
      this.knownCards[player.name] = this.getRemainingCards()
    }
  }
}

function _convertCardToPackCard(card, index) {
  return {
    id: card.name() + `(${index})`,
    name: card.name(),
    _id: card._id,
  }
}

/**
 * Creates packs from a cube's card list
 * @param {Array} cards - Array of card objects
 * @param {Object} options - Options for pack creation
 * @param {number} options.packSize - Number of cards per pack
 * @param {number} options.numPacks - Total number of packs to create
 * @param {number} options.numPlayers - Number of players in the draft
 * @returns {Array} Array of packs (each pack is an array of card objects)
 */
function makeCubePacks(cards, options) {
  const { packSize, numPacks, numPlayers } = options

  // Prepare cards with unique IDs
  const preparedCards = cards.map((card, index) => _convertCardToPackCard(card, index))

  // Shuffle the cards
  util.array.shuffle(preparedCards)

  // Create packs by chunking the cards
  const packs = util.array.chunk(preparedCards, packSize)
  const totalPacks = numPlayers * numPacks

  return packs.slice(0, totalPacks)
}

/**
 * Creates packs based on card rarities from a set
 * @param {Array} cards - Array of card objects with rarity information
 * @param {Object} options - Options for pack creation
 * @param {number} options.numPacks - Total number of packs to create
 * @param {number} options.numPlayers - Number of players in the draft
 * @param {string} options.setCode - Scryfall set code; selects a set-specific
 *   pack generator when one is registered in set_packs/
 * @param {Function} options.rng - Optional random source (default Math.random)
 * @returns {Array} Array of packs (each pack is an array of card objects)
 */
function makeSetPacks(cards, options) {
  if (!cards || cards.length === 0) {
    throw new Error('No cards provided')
  }

  const { numPacks, numPlayers } = options
  const totalPacks = numPlayers * numPacks
  const openPack = _setPackGenerator(cards, options)

  let index = 0
  const packs = []

  while (packs.length < totalPacks) {
    // Prepare cards with unique IDs and extract relevant properties
    const preparedPack = openPack().map(card => {
      index += 1
      return _convertCardToPackCard(card, index)
    })

    packs.push(preparedPack)
  }

  return packs
}

// Look up a set-specific pack generator by set code, falling back to the
// default rarity-based generator. Factories take (cards, options) and return
// an openPack() function producing one pack as an array of MagicCard objects.
function _setPackGenerator(cards, options) {
  const factory = (options.setCode && setPackFactories[options.setCode])
    || _defaultSetPackGenerator
  return factory(cards, options)
}

// Default generator: one rare-or-mythic, three uncommons, ten commons.
function _defaultSetPackGenerator(cards, options) {
  const rng = options.rng || Math.random

  // Filter out basic lands and special layouts
  const filteredCards = cards
    .filter(c => !c.supertypes().includes('basic'))
    .filter(c => c.layout() !== 'meld')

  // Include only one copy of each card, by name
  const uniqueCards = util.array.distinct(filteredCards, c => c.name())

  // Group cards by rarity
  const rarityPools = util.array.collect(uniqueCards, c => c.rarity())

  // Helper function to get random cards of a specific rarity
  const getCards = (rarity, count) => util.array.selectMany(rarityPools[rarity] || [], count, rng)

  return function() {
    const pack = []

    // One rare or mythic card (about 1 in 7.4 packs has a mythic)
    if (rarityPools['mythic'] && rng() < .135) {
      pack.push(...getCards('mythic', 1))
    }
    else {
      pack.push(...getCards('rare', 1))
    }

    // Add uncommons and commons
    pack.push(...getCards('uncommon', 3))
    pack.push(...getCards('common', 10))

    return pack
  }
}

module.exports = {
  Pack,
  makeCubePacks,
  makeSetPacks,
}
