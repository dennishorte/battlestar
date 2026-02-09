const { AgricolaFactory } = require('./agricola.js')
const { AgricolaCard } = require('./AgricolaCard.js')
const TestCommon = require('../lib/test_common.js')
const res = require('./res/index.js')


const TestUtil = { ...TestCommon }
module.exports = TestUtil


TestUtil.fixture = function(options) {
  options = Object.assign({
    name: 'test_game',
    seed: 'test_seed',
    numPlayers: options?.numPlayers || 2,
    useDrafting: false,
    players: [
      {
        _id: 'dennis_id',
        name: 'dennis',
      },
      {
        _id: 'micah_id',
        name: 'micah',
      },
      {
        _id: 'scott_id',
        name: 'scott',
      },
      {
        _id: 'eliya_id',
        name: 'eliya',
      },
      {
        _id: 'tom_id',
        name: 'tom',
      },
      {
        _id: 'alex_id',
        name: 'alex',
      },
    ],
    playerOptions: {
      shuffleSeats: false,
    },
    cardSets: options.cardSets || ['minorImprovementA', 'occupationA'],
  }, options)

  options.players = options.players.slice(0, options.numPlayers)

  const game = AgricolaFactory(options, 'dennis')

  game.testSetBreakpoint('initialization-complete', () => {

  })

  return game
}

// ---------------------------------------------------------------------------
// setBoard / testBoard pattern for comprehensive testing
// ---------------------------------------------------------------------------

/**
 * Set up game state in a declarative way. All fields are optional and
 * default to sensible starting values (round 1, 2 wood rooms, 2 family
 * members, 0 resources, etc.).
 *
 * Game-level fields:
 *   round            - Number. Sets the current round (and stage auto-derives).
 *                      Defaults to 1. If both actionSpaces and round are specified,
 *                      throws an error.
 *   actionSpaces     - Array of action space display names (the names used by
 *                      t.choose()). Adds round-card action spaces to the board.
 *                      For each stage, if any cards a specified, first place those
 *                      cards in the specified order. Then, if any cards for a later
 *                      stage are specified, place any remaining cards for the current
 *                      stage in an arbitrary order. Repeat until all specified cards
 *                      are placed. The round will be set based on the number of
 *                      placed cards.
 *
 * Per-player fields (keyed by player name, e.g. `dennis`, `micah`):
 *   food, wood, clay, stone, reed, grain, vegetables
 *                    - Number. Resource counts. Default to 0.
 *   familyMembers    - Number. Also sets availableWorkers. Defaults to 2.
 *   roomType         - 'wood' | 'clay' | 'stone'. Updates existing rooms.
 *                      Defaults to 'wood'.
 *   beggingCards     - Number. Defaults to 0.
 *   bonusPoints      - Number. Defaults to 0.
 *   hand             - Array of card IDs in the player's hand. Default, none.
 *   occupations      - Array of card IDs of played occupations. Default, none.
 *   minorImprovements - Array of card IDs of played minor improvements. Default, none.
 *   majorImprovements - Array of card IDs of played major improvements. Default, none.
 *                       Cards are created and moved to the correct zones.
 *   pet              - Animal type string for the house pet.
 *   farmyard         - Object with layout options:
 *       rooms        - Location of additional rooms beyond the default rooms.
 *       roomType     - One of 'wood', 'clay', 'stone'. Default: 'wood'
 *       fields       - Array of { row, col, crop?, cropCount? }.
 *       stables      - Array of { row, col }.
 *       pastures     - Array of { spaces: [{row, col}], sheep?, boar?, cows? }.
 *
 * After the board is set up, the player tableau is tested for validity, including
 * but not limited to, rooms are all adjacent, fields are all adjacent, pastures can
 * hold the specified number of animals, etc.
 *
 * Example:
 *   t.setBoard(game, {
 *     dennis: {
 *       food: 5,
 *       wood: 3,
 *       hand: ['shifting-cultivation', 'clay-embankment'],
 *       occupations: ['wood-cutter'],
 *       minorImprovements: ['corn-scoop'],
 *       majorImprovements: ['fireplace-2'],
 *       farmyard: {
 *         rooms: [{ row: 1, col: 0 }],
 *         roomType: 'wood',
 *         fields: [{ row: 1, col: 0, crop: 'grain', cropCount: 3 }],
 *         pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 2 }],
 *         stables: [{ row: 1, col: 1 }],
 *       },
 *       animals: { sheep: 2, boar: 1 },
 *     },
 *     round: 5,
 *     actionSpaces: ['Major Improvement'],
 *   })
 */
/**
 * Resolve a card reference (ID or name) to a card ID.
 * Tries ID lookup first, then name. Throws on ambiguous names.
 */
TestUtil.resolveCardRef = function(ref) {
  // Try by ID first
  const byId = res.getCardById(ref) || res.getMajorImprovementById(ref)
  if (byId) {
    return byId.id
  }

  // Try by name across all cards and major improvements
  const allCards = res.getAllCards()
  const allMajors = res.getAllMajorImprovements()
  const matches = [...allCards, ...allMajors].filter(c => c.name === ref)

  if (matches.length === 0) {
    throw new Error(`Card not found by ID or name: "${ref}"`)
  }
  if (matches.length > 1) {
    const ids = matches.map(c => c.id).join(', ')
    throw new Error(`Ambiguous card name "${ref}" matches multiple cards: ${ids}. Use a card ID instead.`)
  }
  return matches[0].id
}

/**
 * Resolve an action space reference (ID or name) to an action object.
 * Tries ID lookup first, then name. Throws on ambiguous names.
 */
TestUtil.resolveActionSpaceRef = function(ref) {
  const allActions = res.getAllActionSpaces()

  // Try by ID first
  const byId = allActions.find(a => a.id === ref)
  if (byId) {
    return byId
  }

  // Try by name
  const matches = allActions.filter(a => a.name === ref)

  if (matches.length === 0) {
    throw new Error(`Action space not found by ID or name: "${ref}"`)
  }
  if (matches.length > 1) {
    const ids = matches.map(a => a.id).join(', ')
    throw new Error(`Ambiguous action space name "${ref}" matches multiple actions: ${ids}. Use an action ID instead.`)
  }
  return matches[0]
}

/**
 * Resolve an array of card refs to IDs and check for duplicates within the array.
 */
TestUtil.resolveCardRefs = function(refs, label) {
  const ids = refs.map(ref => TestUtil.resolveCardRef(ref))
  const seen = new Set()
  for (const id of ids) {
    if (seen.has(id)) {
      throw new Error(`Duplicate card "${id}" in ${label}`)
    }
    seen.add(id)
  }
  return ids
}

TestUtil.setBoard = function(game, state) {
  game.testSetBreakpoint('initialization-complete', (game) => {
    if (state.round && state.actionSpaces) {
      throw new Error('Cannot specify both actionSpaces and round')
    }

    if (state.actionSpaces) {
      // Resolve and validate action space references
      const requested = state.actionSpaces.map(ref => TestUtil.resolveActionSpaceRef(ref))
      const seenActionIds = new Set()
      for (const action of requested) {
        if (seenActionIds.has(action.id)) {
          throw new Error(`Duplicate action space "${action.id}" in actionSpaces`)
        }
        seenActionIds.add(action.id)
      }

      const allRoundCards = res.getRoundCards()
      const placedIds = new Set()
      const orderedCards = []

      for (let stage = 1; stage <= 6; stage++) {
        // Place specified cards for this stage, in the order given
        for (const card of requested) {
          if (card.stage === stage && !placedIds.has(card.id)) {
            orderedCards.push(card)
            placedIds.add(card.id)
          }
        }

        // If there are specified cards in later stages, fill remaining cards for this stage
        const hasLaterCards = requested.some(a => a.stage > stage && !placedIds.has(a.id))
        if (hasLaterCards) {
          for (const card of allRoundCards) {
            if (card.stage === stage && !placedIds.has(card.id)) {
              orderedCards.push(card)
              placedIds.add(card.id)
            }
          }
        }

        // Stop once all specified cards have been placed
        if (requested.every(a => placedIds.has(a.id))) {
          break
        }
      }

      for (const action of orderedCards) {
        if (!game.state.activeActions.includes(action.id)) {
          game.addActionSpace(action)
        }
      }

      game.state.round = orderedCards.length
      game.state.stage = res.constants.roundToStage[orderedCards.length] || 1
    }
    else {
      game.state.round = state.round || 1
      game.state.stage = res.constants.roundToStage[game.state.round] || 1
    }

    // Resolve all card refs across all players and check for global duplicates
    const playerNames = game.players.all().map(p => p.name)
    const allCardIds = new Set()
    const cardFields = ['hand', 'occupations', 'minorImprovements', 'majorImprovements']

    for (const playerName of playerNames) {
      const playerState = state[playerName] || {}
      for (const field of cardFields) {
        if (playerState[field]) {
          const ids = TestUtil.resolveCardRefs(playerState[field], `${playerName}.${field}`)
          for (const id of ids) {
            if (allCardIds.has(id)) {
              throw new Error(`Duplicate card "${id}" across players in setBoard`)
            }
            allCardIds.add(id)
          }
          // Replace the refs with resolved IDs for downstream use
          playerState[field] = ids
        }
      }
    }

    // Set player states
    for (const playerName of playerNames) {
      TestUtil.setPlayerBoard(game, playerName, state[playerName] || {})
    }
  })
}

TestUtil.setPlayerBoard = function(game, playerName, playerState) {
  const player = game.players.byName(playerName)
  if (!player) {
    throw new Error('Player not found: ' + playerName)
  }

  // Set resources
  const resources = ['food', 'wood', 'clay', 'stone', 'reed', 'grain', 'vegetables']
  for (const resource of resources) {
    player[resource] = playerState[resource] || 0
  }

  // Set family members
  player.familyMembers = playerState.familyMembers || 2
  player.availableWorkers = playerState.familyMembers || 2

  // Set room type
  player.roomType = playerState.roomType || 'wood'

  // Set begging cards
  player.beggingCards = playerState.beggingCards || 0

  // Set occupations played count
  if (playerState.occupationsPlayed !== undefined) {
    player.occupationsPlayed = playerState.occupationsPlayed
  }

  // Set bonus points
  player.bonusPoints = playerState.bonusPoints || 0

  // Set cards via zones and card manager
  TestUtil.setPlayerCards(game, player, 'hand', playerState.hand || [])
  TestUtil.setPlayerCards(game, player, 'occupations', playerState.occupations || [])
  TestUtil.setPlayerCards(game, player, 'minorImprovements', playerState.minorImprovements || [])
  TestUtil.setPlayerMajorImprovements(game, player, playerState.majorImprovements || [])

  // Set farmyard (may override player.roomType via farmyard.roomType)
  if (playerState.farmyard) {
    TestUtil.setPlayerFarmyard(player, playerState.farmyard)
  }

  // Update all room grid cells to match final player.roomType
  for (let row = 0; row < res.constants.farmyardRows; row++) {
    for (let col = 0; col < res.constants.farmyardCols; col++) {
      if (player.farmyard.grid[row][col].type === 'room') {
        player.farmyard.grid[row][col].roomType = player.roomType
      }
    }
  }

  // Set animals
  if (playerState.animals) {
    for (const [type, count] of Object.entries(playerState.animals)) {
      if (count > 0) {
        player.addAnimals(type, count)
      }
    }
  }

  // Set pet
  if (playerState.pet !== undefined) {
    player.pet = playerState.pet
  }
}

TestUtil.setPlayerFarmyard = function(player, farmyardState) {
  // Build additional rooms at specified locations
  if (farmyardState.rooms) {
    for (const room of farmyardState.rooms) {
      player.farmyard.grid[room.row][room.col] = { type: 'room' }
    }
  }

  // Override room type if specified at farmyard level
  if (farmyardState.roomType) {
    player.roomType = farmyardState.roomType
  }

  // Set fields
  if (farmyardState.fields) {
    for (const field of farmyardState.fields) {
      player.farmyard.grid[field.row][field.col] = {
        type: 'field',
        crop: field.crop || null,
        cropCount: field.cropCount || 0,
      }
    }
  }

  // Set stables
  if (farmyardState.stables) {
    for (const stable of farmyardState.stables) {
      const space = player.farmyard.grid[stable.row][stable.col]
      space.hasStable = true
    }
  }

  // Set pastures
  if (farmyardState.pastures) {
    player.farmyard.pastures = []
    for (const pastureState of farmyardState.pastures) {
      const pasture = {
        id: player.farmyard.pastures.length,
        spaces: pastureState.spaces,
        animalType: null,
        animalCount: 0,
      }

      // Mark spaces as pasture
      for (const space of pastureState.spaces) {
        player.farmyard.grid[space.row][space.col].type = 'pasture'
        if (pastureState.hasStable) {
          player.farmyard.grid[space.row][space.col].hasStable = true
        }
      }

      // Add animals to pasture
      if (pastureState.animals) {
        for (const [type, count] of Object.entries(pastureState.animals)) {
          if (count > 0) {
            pasture.animalType = type
            pasture.animalCount = count
          }
        }
      }

      player.farmyard.pastures.push(pasture)
    }
  }
}

/**
 * Test game state in a declarative way.
 * Only checks properties that are specified - unspecified properties are ignored.
 */
TestUtil.testBoard = function(game, expected) {
  // Resolve all card refs across all players and check for global duplicates
  const playerNames = game.players.all().map(p => p.name)
  const allCardIds = new Set()
  const cardFields = ['hand', 'occupations', 'minorImprovements', 'majorImprovements']

  for (const playerName of playerNames) {
    const playerExpected = expected[playerName]
    if (!playerExpected) {
      continue
    }

    for (const field of cardFields) {
      if (playerExpected[field]) {
        const ids = TestUtil.resolveCardRefs(playerExpected[field], `${playerName}.${field}`)
        for (const id of ids) {
          if (allCardIds.has(id)) {
            throw new Error(`Duplicate card "${id}" across players in testBoard`)
          }
          allCardIds.add(id)
        }
        // Replace the refs with resolved IDs for downstream comparison
        playerExpected[field] = ids
      }
    }
  }

  const errors = []

  // Test round/stage
  if (expected.round !== undefined && game.state.round !== expected.round) {
    errors.push(`round: expected ${expected.round}, got ${game.state.round}`)
  }

  // Test player states
  for (const playerName of playerNames) {
    const playerErrors = TestUtil.testPlayerBoard(game, playerName, expected[playerName] || {})
    errors.push(...playerErrors.map(e => `${playerName}.${e}`))
  }

  if (errors.length > 0) {
    throw new Error('Board state mismatch:\n  ' + errors.join('\n  '))
  }
}

TestUtil.testPlayerBoard = function(game, playerName, expected) {
  const player = game.players.byName(playerName)
  const errors = []

  if (!player) {
    errors.push(`Player does not exist: ${playerName}`)
    return errors
  }

  // Only check properties that are explicitly specified
  const resources = ['food', 'wood', 'clay', 'stone', 'reed', 'grain', 'vegetables']
  for (const resource of resources) {
    if (expected[resource] !== undefined && player[resource] !== expected[resource]) {
      errors.push(`${resource}: expected ${expected[resource]}, got ${player[resource]}`)
    }
  }

  if (expected.familyMembers !== undefined && player.familyMembers !== expected.familyMembers) {
    errors.push(`familyMembers: expected ${expected.familyMembers}, got ${player.familyMembers}`)
  }

  if (expected.roomType !== undefined && player.roomType !== expected.roomType) {
    errors.push(`roomType: expected ${expected.roomType}, got ${player.roomType}`)
  }

  if (expected.beggingCards !== undefined && player.beggingCards !== expected.beggingCards) {
    errors.push(`beggingCards: expected ${expected.beggingCards}, got ${player.beggingCards}`)
  }

  if (expected.bonusPoints !== undefined && player.bonusPoints !== expected.bonusPoints) {
    errors.push(`bonusPoints: expected ${expected.bonusPoints}, got ${player.bonusPoints}`)
  }

  // Test card arrays only if specified
  if (expected.hand !== undefined) {
    const actualHand = [...player.hand].sort()
    const expectedHand = [...expected.hand].sort()
    if (JSON.stringify(actualHand) !== JSON.stringify(expectedHand)) {
      errors.push(`hand: expected [${expectedHand}], got [${actualHand}]`)
    }
  }

  if (expected.occupations !== undefined) {
    const actualOccupations = [...player.playedOccupations].sort()
    const expectedOccupations = [...expected.occupations].sort()
    if (JSON.stringify(actualOccupations) !== JSON.stringify(expectedOccupations)) {
      errors.push(`occupations: expected [${expectedOccupations}], got [${actualOccupations}]`)
    }
  }

  if (expected.minorImprovements !== undefined) {
    const actualMinorImprovements = [...player.playedMinorImprovements].sort()
    const expectedMinorImprovements = [...expected.minorImprovements].sort()
    if (JSON.stringify(actualMinorImprovements) !== JSON.stringify(expectedMinorImprovements)) {
      errors.push(`minorImprovements: expected [${expectedMinorImprovements}], got [${actualMinorImprovements}]`)
    }
  }

  if (expected.majorImprovements !== undefined) {
    const actualMajorImprovements = [...player.majorImprovements].sort()
    const expectedMajorImprovements = [...expected.majorImprovements].sort()
    if (JSON.stringify(actualMajorImprovements) !== JSON.stringify(expectedMajorImprovements)) {
      errors.push(`majorImprovements: expected [${expectedMajorImprovements}], got [${actualMajorImprovements}]`)
    }
  }

  if (expected.animals) {
    for (const [type, count] of Object.entries(expected.animals)) {
      const actual = player.getTotalAnimals(type)
      if (actual !== count) {
        errors.push(`animals.${type}: expected ${count}, got ${actual}`)
      }
    }
  }

  if (expected.farmyard) {
    if (expected.farmyard.rooms !== undefined) {
      const actual = player.getRoomCount()
      if (actual !== expected.farmyard.rooms) {
        errors.push(`farmyard.rooms: expected ${expected.farmyard.rooms}, got ${actual}`)
      }
    }

    if (expected.farmyard.fields !== undefined) {
      const actual = player.getFieldCount()
      if (actual !== expected.farmyard.fields) {
        errors.push(`farmyard.fields: expected ${expected.farmyard.fields}, got ${actual}`)
      }
    }

    if (expected.farmyard.pastures !== undefined) {
      const actual = player.getPastureCount()
      if (actual !== expected.farmyard.pastures) {
        errors.push(`farmyard.pastures: expected ${expected.farmyard.pastures}, got ${actual}`)
      }
    }

    if (expected.farmyard.stables !== undefined) {
      const actual = player.getStableCount()
      if (actual !== expected.farmyard.stables) {
        errors.push(`farmyard.stables: expected ${expected.farmyard.stables}, got ${actual}`)
      }
    }
  }

  if (expected.score !== undefined) {
    const actualScore = player.calculateScore()
    if (actualScore !== expected.score) {
      errors.push(`score: expected ${expected.score}, got ${actualScore}`)
    }
  }

  return errors
}

/**
 * Ensure a card exists in the card manager, creating it if needed.
 */
TestUtil.ensureCard = function(game, cardId) {
  if (game.cards.hasId(cardId)) {
    return game.cards.byId(cardId)
  }
  // Try to find the card definition from res
  const cardDef = res.getCardById(cardId) || res.getMajorImprovementById(cardId)
  if (!cardDef) {
    throw new Error(`Card not found in res: ${cardId}`)
  }
  const card = new AgricolaCard(game, cardDef)
  game.cards.register(card)

  // Place in supply zone so it has a zone (required for moveTo)
  const supplyZone = game.zones.byId('common.supply')
  supplyZone.push(card, supplyZone.nextIndex())

  return card
}

/**
 * Set player's cards in a given zone, creating cards as needed.
 */
TestUtil.setPlayerCards = function(game, player, zoneName, cardIds) {
  const zone = game.zones.byPlayer(player, zoneName)

  // Clear existing cards from the zone
  const existingCards = zone.cardlist()
  for (const card of existingCards) {
    // Move back to supply
    const supplyZone = game.zones.byId('common.supply')
    card.moveTo(supplyZone)
  }

  // Add specified cards to the zone
  for (const cardId of cardIds) {
    const card = TestUtil.ensureCard(game, cardId)
    card.moveTo(zone)
  }
}

/**
 * Set player's major improvements, moving them from common zone.
 */
TestUtil.setPlayerMajorImprovements = function(game, player, cardIds) {
  const playerZone = game.zones.byPlayer(player, 'majorImprovements')

  // Clear existing major improvements from player zone
  const existingCards = playerZone.cardlist()
  const commonMajorZone = game.zones.byId('common.majorImprovements')
  for (const card of existingCards) {
    card.moveTo(commonMajorZone)
  }

  // Move specified cards to player zone
  for (const cardId of cardIds) {
    const card = TestUtil.ensureCard(game, cardId)
    card.moveTo(playerZone)
  }
}
