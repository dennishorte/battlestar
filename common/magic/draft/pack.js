const util = require('../../lib/util.js')

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
    util.assert(!Boolean(card.picker), `Card with id=${cardId} is already picked`)

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
 * @returns {Array} Array of packs (each pack is an array of card objects)
 */
function makeSetPacks(cards, options) {
  if (!cards || cards.length === 0) {
    throw new Error('No cards provided')
  }

  const { numPacks, numPlayers } = options

  // Filter out basic lands and special layouts
  const filteredCards = cards
    .filter(c => !c.supertypes().includes('basic'))
    .filter(c => c.layout() !== 'meld')

  // Include only one copy of each card, by name
  const uniqueCards = util.array.distinct(filteredCards, c => c.name())

  // Group cards by rarity
  const rarityPools = util.array.collect(uniqueCards, c => c.rarity())

  // Helper function to get random cards of a specific rarity
  const getCards = (rarity, count) => util.array.selectMany(rarityPools[rarity] || [], count)

  const totalPacks = numPlayers * numPacks
  let index = 0
  const packs = []


  while (packs.length < totalPacks) {
    const pack = []

    // One rare or mythic card (about 1 in 7.4 packs has a mythic)
    if (rarityPools['mythic'] && Math.random() < .135) {
      getCards('mythic', 1).forEach(card => pack.push(card))
    }
    else {
      getCards('rare', 1).forEach(card => pack.push(card))
    }

    // Add uncommons and commons
    getCards('uncommon', 3).forEach(card => pack.push(card))
    getCards('common', 10).forEach(card => pack.push(card))

    // Prepare cards with unique IDs and extract relevant properties
    const preparedPack = pack.map(card => {
      index += 1
      return _convertCardToPackCard(card, index)
    })

    packs.push(preparedPack)
  }

  return packs
}

module.exports = {
  Pack,
  makeCubePacks,
  makeSetPacks,
}
