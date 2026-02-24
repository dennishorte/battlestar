const { Agricola } = require('./agricola')
const { AgricolaCard } = require('./AgricolaCard.js')
const res = require('./res/index.js')

Agricola.prototype.initializeRoundCards = function() {
  // Shuffle round cards within each stage
  this.state.roundCardDeck = []

  for (let stage = 1; stage <= 6; stage++) {
    const stageCards = res.getRoundCardsByStage(stage)
    const shuffled = this.shuffleArray([...stageCards])
    this.state.roundCardDeck.push(...shuffled)
  }

  this.log.add({
    template: 'Round cards shuffled',
  })
}

// Fisher-Yates shuffle using seeded random
Agricola.prototype.shuffleArray = function(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(this.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

Agricola.prototype.initializeMajorImprovements = function() {
  // Create AgricolaCard for each major improvement and place in common zone
  const playerCount = this.players.all().length
  const majorZone = this.zones.byId('common.majorImprovements')
  const majorCards = []
  for (const impDef of res.getAllMajorImprovements(playerCount)) {
    const card = new AgricolaCard(this, impDef)
    this.cards.register(card)
    majorCards.push(card)
  }
  majorZone.initializeCards(majorCards)

  if (playerCount >= 5) {
    this.log.add({
      template: 'Added 5-6 player expansion major improvements',
    })
  }
}

Agricola.prototype.initializePlayerCards = function() {
  const playerCount = this.players.all().length
  const cardsPerPlayer = 7
  const setIds = this.settings.cardSets || res.getCardSetIds()

  // Log which card sets are in use
  const setNames = setIds.map(id => res.cardSets[id]?.name || id).join(', ')
  this.log.add({
    template: `Card sets: ${setNames}`,
  })

  // Get cards appropriate for this player count from the selected sets
  // Version 4+: exclude cards marked as excluded
  // Older versions: include them as no-ops to preserve seeded shuffle order
  const excludeCards = (this.settings.version || 1) == 4
  const allCards = res.getCardsByPlayerCount(playerCount, setIds, { excludeCards })
  const occupations = allCards.filter(c => c.type === 'occupation')
  const minorImprovements = allCards.filter(c => c.type === 'minor')

  // Shuffle both decks
  const shuffledOccupations = this.shuffleArray([...occupations])
  const shuffledMinors = this.shuffleArray([...minorImprovements])

  // Create AgricolaCard instances for all cards and place in supply zone
  const supplyZone = this.zones.byId('common.supply')
  const createCards = (cardDefs) => {
    return cardDefs.map(def => {
      const card = new AgricolaCard(this, def)
      this.cards.register(card)
      supplyZone.push(card, supplyZone.nextIndex())
      return card
    })
  }

  const occCards = createCards(shuffledOccupations)
  const minorCards = createCards(shuffledMinors)

  if (this.settings.useDrafting) {
    // Set up draft pools - each player gets a starting hand to draft from
    this.state.draftPools = {
      occupations: [],
      minors: [],
    }

    for (let i = 0; i < playerCount; i++) {
      // Create pools of card IDs that will be passed around
      const occPool = occCards
        .splice(0, cardsPerPlayer)
        .map(c => c.id)
      const minorPool = minorCards
        .splice(0, cardsPerPlayer)
        .map(c => c.id)

      this.state.draftPools.occupations.push(occPool)
      this.state.draftPools.minors.push(minorPool)
    }

    this.log.add({
      template: 'Card drafting will begin',
    })
  }
  else {
    // Deal cards directly to each player (no drafting)
    for (let i = 0; i < playerCount; i++) {
      const player = this.players.all()[i]
      const handZone = this.zones.byPlayer(player, 'hand')

      // Deal 7 occupations
      const playerOccCards = occCards.splice(0, cardsPerPlayer)

      // Deal 7 minor improvements
      const playerMinorCards = minorCards.splice(0, cardsPerPlayer)

      // Move cards to player's hand zone
      for (const card of [...playerOccCards, ...playerMinorCards]) {
        card.moveTo(handZone)
      }

      this.log.add({
        template: '{player} receives {occ} occupations and {minor} minor improvements',
        args: { player, occ: playerOccCards.length, minor: playerMinorCards.length },
      })
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Card Hook System
// These methods call hooks on players' cards at appropriate times

/**
 * Get all active cards for a player (played occupations + minor improvements)
 */
Agricola.prototype.getPlayerActiveCards = function(player) {
  const cards = []
  const occZone = this.zones.byPlayer(player, 'occupations')
  if (occZone) {
    cards.push(...occZone.cardlist())
  }
  const minorZone = this.zones.byPlayer(player, 'minorImprovements')
  if (minorZone) {
    cards.push(...minorZone.cardlist())
  }
  return cards
}

/**
 * Call a hook on all of a player's active cards
 * Returns array of results from cards that returned something
 */
Agricola.prototype.callPlayerCardHook = function(player, hookName, ...args) {
  const results = []
  const cards = this.getPlayerActiveCards(player)
  for (const card of cards) {
    if (card.hasHook(hookName)) {
      const result = card.callHook(hookName, this, player, ...args)
      if (result !== undefined) {
        results.push({ card, result })
      }
    }
  }
  return results
}

Agricola.prototype.callCardHook = function(hookName, ...args) {
  for (const player of this.players.all()) {
    this.callPlayerCardHook(player, hookName, ...args)
  }
}

/**
 * Call checkTrigger on all cards for a player to see if any trigger conditions are met
 */
Agricola.prototype.checkCardTriggers = function(player) {
  const cards = this.getPlayerActiveCards(player)
  for (const card of cards) {
    if (card.hasHook('checkTrigger')) {
      card.callHook('checkTrigger', this, player)
    }
  }
}

/**
 * Call onRoundStart for all players
 */
Agricola.prototype.callRoundStartHooks = function() {
  for (const player of this.players.all()) {
    // Collect scheduled resources from cards
    this.collectScheduledResources(player)

    // Call onRoundStart hooks (hooks handle their own actions directly)
    this.callPlayerCardHook(player, 'onRoundStart', this.state.round)

    // Check triggers
    this.checkCardTriggers(player)
  }
}
