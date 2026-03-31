const { DuneCard } = require('../DuneCard.js')
const constants = require('../res/constants.js')
const util = require('../../lib/util.js')

/**
 * Draw cards from a player's deck into their hand.
 * When the deck is empty, reshuffles the discard pile to form a new deck.
 */
function drawCards(game, player, count) {
  const deckZone = game.zones.byId(`${player.name}.deck`)
  const handZone = game.zones.byId(`${player.name}.hand`)
  const discardZone = game.zones.byId(`${player.name}.discard`)

  let drawn = 0
  for (let i = 0; i < count; i++) {
    if (deckZone.cardlist().length === 0) {
      // Reshuffle discard into deck
      if (discardZone.cardlist().length === 0) {
        break // Nothing left to draw
      }
      const discardCards = discardZone.cardlist()
      for (const card of discardCards) {
        card.moveTo(deckZone)
      }
      deckZone.shuffle(game.random)
    }

    const cards = deckZone.cardlist()
    if (cards.length > 0) {
      cards[0].moveTo(handZone)
      drawn++
    }
  }

  if (drawn > 0) {
    game.log.add({
      template: '{player} draws {count} cards',
      args: { player, count: drawn },
    })
  }

  return drawn
}

/**
 * Move a card from the player's hand to their played area (for agent turns).
 */
function playCard(game, player, card) {
  const playedZone = game.zones.byId(`${player.name}.played`)
  card.moveTo(playedZone)
  game.log.add({
    template: '{player} plays {card}',
    args: { player, card },
  })
}

/**
 * Reveal all remaining cards in the player's hand (for reveal turns).
 */
function revealHand(game, player) {
  const handZone = game.zones.byId(`${player.name}.hand`)
  const revealedZone = game.zones.byId(`${player.name}.revealed`)
  const cards = handZone.cardlist()

  for (const card of cards) {
    card.moveTo(revealedZone)
  }

  if (cards.length > 0) {
    game.log.add({
      template: '{player} reveals {count} cards',
      args: { player, count: cards.length },
    })
  }

  return cards
}

/**
 * Discard a card from the player's hand to their discard pile.
 */
function discardCard(game, player, card) {
  const discardZone = game.zones.byId(`${player.name}.discard`)
  card.moveTo(discardZone)
}

/**
 * Trash a card (remove it from the game).
 */
function trashCard(game, card) {
  const trashZone = game.zones.byId('common.trash')
  card.moveTo(trashZone)
  game.log.add({
    template: '{card} is trashed',
    args: { card },
  })
}

/**
 * Acquire a card from the Imperium Row or Reserve into the player's discard pile.
 */
function acquireCard(game, player, card) {
  const discardZone = game.zones.byId(`${player.name}.discard`)
  card.moveTo(discardZone)
  game.log.add({
    template: '{player} acquires {card}',
    args: { player, card },
  })

  // Refill Imperium Row if the card came from there
  refillImperiumRow(game)
}

/**
 * Refill the Imperium Row to 5 cards from the Imperium Deck.
 */
function refillImperiumRow(game) {
  const rowZone = game.zones.byId('common.imperiumRow')
  const deckZone = game.zones.byId('common.imperiumDeck')

  while (rowZone.cardlist().length < constants.IMPERIUM_ROW_SIZE) {
    const deckCards = deckZone.cardlist()
    if (deckCards.length === 0) {
      break
    }
    deckCards[0].moveTo(rowZone)
  }
}

/**
 * Clean up a player's played and revealed cards at end of reveal turn.
 * All go to discard pile.
 */
function cleanUp(game, player) {
  const playedZone = game.zones.byId(`${player.name}.played`)
  const revealedZone = game.zones.byId(`${player.name}.revealed`)
  const discardZone = game.zones.byId(`${player.name}.discard`)

  for (const card of playedZone.cardlist()) {
    card.moveTo(discardZone)
  }
  for (const card of revealedZone.cardlist()) {
    card.moveTo(discardZone)
  }
}

/**
 * Draw an intrigue card for a player.
 */
function drawIntrigueCard(game, player, count = 1) {
  const intrigueDeck = game.zones.byId('common.intrigueDeck')
  const playerIntrigue = game.zones.byId(`${player.name}.intrigue`)

  let drawn = 0
  for (let i = 0; i < count; i++) {
    const cards = intrigueDeck.cardlist()
    if (cards.length === 0) {
      break
    }
    cards[0].moveTo(playerIntrigue)
    drawn++
  }

  if (drawn > 0) {
    game.log.add({
      template: '{player} draws {count} Intrigue cards',
      args: { player, count: drawn },
    })
  }

  return drawn
}

/**
 * Create and register card instances from card definitions,
 * and place them in the appropriate zone.
 */
function initializeCards(game) {
  const settings = game.settings

  // Create Imperium deck cards
  const imperiumDeckZone = game.zones.byId('common.imperiumDeck')
  const imperiumCards = require('../res/index.js').getImperiumCards(settings)
  for (const cardDef of imperiumCards) {
    for (let i = 0; i < (cardDef.count || 1); i++) {
      const id = `imperium-${cardDef.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`
      const card = new DuneCard(game, { ...cardDef, id, type: 'imperium' })
      game.cards.register(card)
      card.setHome(imperiumDeckZone)
      imperiumDeckZone.push(card)
    }
  }
  imperiumDeckZone.shuffle(game.random)

  // Create Intrigue deck cards
  const intrigueDeckZone = game.zones.byId('common.intrigueDeck')
  const intrigueCards = require('../res/index.js').getIntrigueCards(settings)
  for (const cardDef of intrigueCards) {
    for (let i = 0; i < (cardDef.count || 1); i++) {
      const id = `intrigue-${cardDef.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`
      const card = new DuneCard(game, { ...cardDef, id, type: 'intrigue' })
      game.cards.register(card)
      card.setHome(intrigueDeckZone)
      intrigueDeckZone.push(card)
    }
  }
  intrigueDeckZone.shuffle(game.random)

  // Create Reserve cards (Prepare the Way and The Spice Must Flow)
  const reserveCards = require('../res/index.js').getReserveCards(settings)
  for (const cardDef of reserveCards) {
    const zoneName = cardDef.name.includes('Prepare')
      ? 'common.reserve.prepareTheWay'
      : cardDef.name.includes('Spice Must Flow')
        ? 'common.reserve.spiceMustFlow'
        : null

    if (!zoneName) {
      continue
    }

    const zone = game.zones.byId(zoneName)
    for (let i = 0; i < (cardDef.count || 1); i++) {
      const id = `reserve-${cardDef.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`
      const card = new DuneCard(game, { ...cardDef, id, type: 'reserve' })
      game.cards.register(card)
      card.setHome(zone)
      zone.push(card)
    }
  }

  // Build Conflict deck: shuffle tier III (all 4), deal 5 tier II on top, deal 1 tier I on top
  const conflictDeckZone = game.zones.byId('common.conflictDeck')
  const conflictCards = require('../res/index.js').getConflictCards(settings)
  const tierI = [], tierII = [], tierIII = []
  for (const cardDef of conflictCards) {
    const card = new DuneCard(game, { ...cardDef, type: 'conflict' })
    game.cards.register(card)
    card.setHome(conflictDeckZone)
    if (cardDef.tier === 1) {
      tierI.push(card)
    }
    else if (cardDef.tier === 2) {
      tierII.push(card)
    }
    else if (cardDef.tier === 3) {
      tierIII.push(card)
    }
  }
  // Shuffle each tier
  util.array.shuffle(tierIII, game.random)
  util.array.shuffle(tierII, game.random)
  util.array.shuffle(tierI, game.random)
  // Stack the deck: tier I on top (index 0), tier II middle, tier III bottom.
  // push(card, 0) inserts at the top.
  for (const card of tierIII) {
    conflictDeckZone.push(card)
  }
  for (const card of tierII.slice(0, constants.CONFLICT_II_COUNT)) {
    conflictDeckZone.push(card, 0)
  }
  for (const card of tierI.slice(0, constants.CONFLICT_I_COUNT)) {
    conflictDeckZone.push(card, 0)
  }

  // Create starting deck for each player
  const starterCards = require('../res/index.js').getStarterCards(settings)
  for (const player of game.players.all()) {
    const deckZone = game.zones.byId(`${player.name}.deck`)
    for (const cardDef of starterCards) {
      const count = cardDef.countPerPlayer || 1
      for (let i = 0; i < count; i++) {
        const id = `starter-${player.name}-${cardDef.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`
        const card = new DuneCard(game, { ...cardDef, id, type: 'starter' })
        game.cards.register(card)
        card.setHome(deckZone)
        deckZone.push(card)
      }
    }
    deckZone.shuffle(game.random)
  }

  // Fill the Imperium Row
  refillImperiumRow(game)
}

module.exports = {
  drawCards,
  playCard,
  revealHand,
  discardCard,
  trashCard,
  acquireCard,
  refillImperiumRow,
  cleanUp,
  drawIntrigueCard,
  initializeCards,
}
