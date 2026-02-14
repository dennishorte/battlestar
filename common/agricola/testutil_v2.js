const { AgricolaFactory } = require('./agricola.js')
const { AgricolaCard } = require('./AgricolaCard.js')
const TestCommon = require('../lib/test_common.js')
const res = require('./res/index.js')


const TestUtil = { ...TestCommon }
module.exports = TestUtil

const PLAYER_DEFAULTS = {
  food: 0, wood: 0, clay: 0, stone: 0, reed: 0, grain: 0, vegetables: 0,
  familyMembers: 2, roomType: 'wood', beggingCards: 0, bonusPoints: 0,
  hand: [], occupations: [], minorImprovements: [], majorImprovements: [],
  pet: null,
}

const ANIMAL_DEFAULTS = { sheep: 0, boar: 0, cattle: 0 }

const FARMYARD_DEFAULTS = {
  rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
  fields: [],
  pastures: [],
  stables: [],
}

/**
 * Return the current choice names from the waiting selector as plain strings.
 * Handles both plain string choices and { title, detail } objects.
 */
TestUtil.currentChoices = function(game) {
  const choices = game.waiting.selectors[0].choices
  return choices.map(c => typeof c === 'object' ? c.title : c)
}

/**
 * Respond to an action-type input request (e.g. build-pasture, sow-field).
 * Shorthand for grabbing selectors[0] and calling respondToInputRequest.
 *
 * Usage:
 *   t.action(game, 'build-pasture', { spaces: [{row: 0, col: 1}] })
 *   t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })
 */
TestUtil.action = function(game, actionName, opts = {}) {
  const selector = game.waiting.selectors[0]
  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: { action: actionName, ...opts },
  })
}

/**
 * Respond to an anytime action (e.g. Grocer buy good, Clearing Spade crop move).
 * Anytime actions appear in the side panel and can be triggered during any choice prompt.
 *
 * Usage:
 *   const actions = game.getAnytimeActions(player)
 *   const grocerAction = actions.find(a => a.cardName === 'Grocer')
 *   t.anytimeAction(game, grocerAction)
 */
TestUtil.anytimeAction = function(game, anytimeAction) {
  const request = game.waiting
  const selector = request.selectors[0]
  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: { action: 'anytime-action', anytimeAction },
  })
}

TestUtil.fixture = function(options = {}) {
  options = Object.assign({
    name: 'test_game',
    seed: 'test_seed',
    numPlayers: options.numPlayers || 2,
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
    cardSets: options.cardSets || ['minorImprovementA', 'occupationA', 'test'],
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
 *   round            - Number. `round: N` plays round N. The game skips to that
 *                      round directly — no earlier rounds are played, and round
 *                      cards are revealed randomly as usual. Cannot combine with
 *                      actionSpaces.
 *   actionSpaces     - Array of action space references. Each element can be:
 *                        - A string (action space name or ID), e.g. 'Fishing'
 *                        - An object { ref, accumulated }, e.g. { ref: 'Fishing', accumulated: 2 }
 *                          The `accumulated` value is the amount on the space AFTER
 *                          replenish — i.e. what the player sees when they take their turn.
 *                          For non-accumulating spaces, `accumulated` is ignored.
 *                      Controls which round cards are available. Earlier stages
 *                      are auto-filled when a later-stage card is requested:
 *                      e.g. ['Western Quarry'] (stage 2) auto-fills all 4 stage 1
 *                      cards, producing 5 total → plays round 6. Requested cards
 *                      within the same stage are placed in the given order; other
 *                      cards for that stage are added in arbitrary order. The round
 *                      is set to orderedCards.length + 1. Cannot combine with round.
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
 *   scheduled        - Object of scheduled deliveries. Resources use { round: amount },
 *                      events use [round, ...]. Only checked when specified.
 *                      Resources: food, wood, clay, stone, reed, grain, vegetables,
 *                        vegetablesPurchase, sheep, boar, cattle.
 *                      Events: plows, freeStables, freeOccupation, woodWithMinor, plowman.
 *                      Example: { food: { 5: 1, 6: 1 }, plows: [7] }
 *   virtualFields    - Object mapping virtual field IDs to { crop, cropCount }.
 *                      Pre-sows virtual fields created by isField cards.
 *                      Example: { 'cherry-orchard-e068': { crop: 'wood', cropCount: 1 } }
 *   farmyard         - Object with layout options:
 *       rooms        - Location of additional rooms beyond the default rooms.
 *       roomType     - One of 'wood', 'clay', 'stone'. Default: 'wood'
 *       fields       - Array of { row, col, crop?, cropCount?, underCrop?, underCropCount? }.
 *                      `underCrop` and `underCropCount` support placing a crop underneath
 *                      the primary crop (e.g., Heresy Teacher places vegetables under grain).
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
  // Shared between initialization-complete and replenish-complete breakpoints.
  // Populated during init, applied after the first replenish of the target round.
  const accumulatedOverrides = {}

  game.testSetBreakpoint('initialization-complete', (game) => {
    if (state.round && state.actionSpaces) {
      throw new Error('Cannot specify both actionSpaces and round')
    }

    if (state.actionSpaces) {
      // Resolve and validate action space references
      // Each element can be a string or { ref, accumulated }
      const requested = state.actionSpaces.map(entry => {
        const ref = typeof entry === 'string' ? entry : entry.ref
        const action = TestUtil.resolveActionSpaceRef(ref)
        if (typeof entry === 'object' && entry.accumulated !== undefined) {
          accumulatedOverrides[action.id] = entry.accumulated
        }
        return action
      })
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

      // Sync roundCardDeck so getActionSpaceRound returns correct values
      const remaining = game.state.roundCardDeck.filter(c => !placedIds.has(c.id))
      game.state.roundCardDeck = [...orderedCards, ...remaining]

      for (const action of orderedCards) {
        if (!game.state.activeActions.includes(action.id)) {
          game.addActionSpace(action)
        }
      }

      game.state.round = orderedCards.length
      game.state.stage = res.constants.roundToStage[orderedCards.length] || 1
      targetRound = orderedCards.length + 1  // mainLoop increments before playing
    }
    else if (state.round) {
      // round: N means "play round N" — subtract 1 because mainLoop increments before playing
      game.state.round = state.round - 1
      game.state.stage = res.constants.roundToStage[state.round] || 1
      targetRound = state.round

      // Reveal all round cards for rounds 1 through N-1 so that earlier-stage
      // action spaces are available (e.g. House Redevelopment at round 11).
      for (let r = 0; r < state.round - 1; r++) {
        const card = game.state.roundCardDeck[r]
        if (card && !game.state.activeActions.includes(card.id)) {
          game.addActionSpace(card)
        }
      }
    }
    else {
      game.state.round = 1
      game.state.stage = 1
      targetRound = 2  // mainLoop increments from 1 to 2
    }

    // Set starting player
    if (state.firstPlayer) {
      game.state.startingPlayer = state.firstPlayer
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

    // Validate board state
    const errors = []
    for (const playerName of playerNames) {
      const playerState = state[playerName]
      if (!playerState) {
        continue
      }

      const player = game.players.byName(playerName)

      // Grid bounds — check all specified coordinates within 3x5
      const allCoords = []
      if (playerState.farmyard) {
        const fy = playerState.farmyard
        if (fy.rooms) {
          allCoords.push(...fy.rooms.map(r => ({ ...r, label: 'room' })))
        }
        if (fy.fields) {
          allCoords.push(...fy.fields.map(f => ({ ...f, label: 'field' })))
        }
        if (fy.stables) {
          allCoords.push(...fy.stables.map(s => ({ ...s, label: 'stable' })))
        }
        if (fy.pastures) {
          for (const p of fy.pastures) {
            allCoords.push(...p.spaces.map(s => ({ ...s, label: 'pasture' })))
          }
        }
      }
      for (const coord of allCoords) {
        if (coord.row < 0 || coord.row >= res.constants.farmyardRows ||
            coord.col < 0 || coord.col >= res.constants.farmyardCols) {
          errors.push(`${playerName}: ${coord.label} at (${coord.row},${coord.col}) is out of bounds`)
        }
      }

      // Room adjacency
      const roomSpaces = player.getRoomSpaces()
      if (roomSpaces.length > 1 && !player.areSpacesConnected(roomSpaces)) {
        errors.push(`${playerName}: rooms are not all orthogonally connected`)
      }

      // Field adjacency
      const fieldSpaces = player.getFieldSpaces()
      if (fieldSpaces.length > 1 && !player.areSpacesConnected(fieldSpaces)) {
        errors.push(`${playerName}: fields are not all orthogonally connected`)
      }

      // Pasture connectivity and capacity
      for (const pasture of player.farmyard.pastures) {
        if (pasture.spaces.length > 1 && !player.areSpacesConnected(pasture.spaces)) {
          const coords = pasture.spaces.map(s => `(${s.row},${s.col})`).join(', ')
          errors.push(`${playerName}: pasture [${coords}] spaces are not orthogonally connected`)
        }
        if (pasture.animalCount > player.getPastureCapacity(pasture)) {
          const coords = pasture.spaces.map(s => `(${s.row},${s.col})`).join(', ')
          errors.push(`${playerName}: pasture [${coords}] has ${pasture.animalCount} animals but capacity is ${player.getPastureCapacity(pasture)}`)
        }
      }

      // Card prereqs — skip negative prereqs (noFields, noAnimals, etc.) since
      // those are play-time conditions that may conflict with the test board state
      const negativePrereqs = ['noFields', 'noGrainFields', 'noOccupations', 'noAnimals', 'noSheep', 'noGrain', 'maxRound', 'minRound', 'personOnFishing', 'pastureSpacesGteRound']
      const playedCardFields = ['occupations', 'minorImprovements', 'majorImprovements']
      for (const field of playedCardFields) {
        if (playerState[field]) {
          for (const cardId of playerState[field]) {
            const cardDef = res.getCardById(cardId) || res.getMajorImprovementById(cardId)
            const hasNegativePrereq = cardDef?.prereqs && negativePrereqs.some(k => cardDef.prereqs[k])
            if (!hasNegativePrereq && !player.meetsCardPrereqs(cardId)) {
              errors.push(`${playerName}: card "${cardId}" prereqs not met`)
            }
          }
        }
      }
    }

    if (errors.length > 0) {
      throw new Error('setBoard validation failed:\n  ' + errors.join('\n  '))
    }
  })

  // Apply accumulated overrides after replenish on the target round.
  // This fires AFTER replenishPhase(), so the value you specify in setBoard is
  // exactly what ends up on the space — no mental math about replenish amounts.
  // Uses round number (not a flag) so it works correctly across game replays.
  // targetRound is set inside initialization-complete and captured via closure.
  let targetRound = 0
  game.testSetBreakpoint('replenish-complete', (game) => {
    if (game.state.round !== targetRound) {
      return
    }

    for (const [actionId, desiredAmount] of Object.entries(accumulatedOverrides)) {
      const actionDef = res.getActionById(actionId)
      if (!actionDef || actionDef.type !== 'accumulating' || !actionDef.accumulates) {
        throw new Error(`Action space "${actionId}" is not an accumulating space — cannot set accumulated`)
      }
      const spaceState = game.state.actionSpaces[actionId]
      if (!spaceState) {
        throw new Error(`Action space "${actionId}" not found in game state — was it added?`)
      }
      spaceState.accumulated = desiredAmount
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

  // Set bonus points
  player.bonusPoints = playerState.bonusPoints || 0

  // Set cards via zones and card manager
  TestUtil.setPlayerCards(game, player, 'hand', playerState.hand || [])
  TestUtil.setPlayerCards(game, player, 'occupations', playerState.occupations || [])
  TestUtil.setPlayerCards(game, player, 'minorImprovements', playerState.minorImprovements || [])
  TestUtil.setPlayerMajorImprovements(game, player, playerState.majorImprovements || [])

  // Register card-provided action spaces for played minor improvements
  // and create virtual fields for isField cards
  for (const cardId of playerState.minorImprovements || []) {
    const card = game.cards.byId(cardId)
    if (card.definition.providesActionSpace) {
      game.registerCardActionSpace(player, card)
    }
    if (card.definition.isField && card.definition.onPlay) {
      card.definition.onPlay(game, player)
    }
  }

  // Pre-sow virtual fields if specified
  if (playerState.virtualFields) {
    for (const [fieldId, fieldState] of Object.entries(playerState.virtualFields)) {
      const vf = player.getVirtualField(fieldId)
      if (!vf) {
        throw new Error(`Virtual field "${fieldId}" not found — is the card in minorImprovements?`)
      }
      vf.crop = fieldState.crop
      vf.cropCount = fieldState.cropCount
    }
  }

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

  // Set scheduled deliveries
  if (playerState.scheduled) {
    for (const [type, value] of Object.entries(playerState.scheduled)) {
      const stateKey = `scheduled${type[0].toUpperCase()}${type.slice(1)}`
      if (!game.state[stateKey]) {
        game.state[stateKey] = {}
      }
      if (Array.isArray(value)) {
        game.state[stateKey][playerName] = [...value]
      }
      else {
        game.state[stateKey][playerName] = { ...value }
      }
    }
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
      const space = {
        type: 'field',
        crop: field.crop || null,
        cropCount: field.cropCount || 0,
      }
      // Support underCrop for Heresy Teacher and similar cards
      if (field.underCrop !== undefined) {
        space.underCrop = field.underCrop || null
        space.underCropCount = field.underCropCount || 0
      }
      player.farmyard.grid[field.row][field.col] = space
    }
  }

  // Set stables
  if (farmyardState.stables) {
    for (const stable of farmyardState.stables) {
      const space = player.farmyard.grid[stable.row][stable.col]
      space.hasStable = true
    }
  }

  // Set pastures — generate real fences so recalculatePastures works
  if (farmyardState.pastures) {
    // Collect desired animal assignments per pasture (by space set key)
    const animalsBySpaceKey = []

    for (const pastureState of farmyardState.pastures) {
      // Calculate and add fence segments for this pasture
      const fences = player.calculateFencesForPasture(pastureState.spaces)
      for (const fence of fences) {
        // Avoid duplicate fences
        const exists = player.farmyard.fences.some(f =>
          f.row1 === fence.row1 && f.col1 === fence.col1 &&
          f.row2 === fence.row2 && f.col2 === fence.col2
        )
        if (!exists) {
          player.farmyard.fences.push(fence)
        }
      }

      // Parse animal config: support both flat { sheep: 2 } and { animals: { sheep: 2 } }
      let animalType = null
      let animalCount = 0
      const animalSource = pastureState.animals || pastureState
      for (const type of ['sheep', 'boar', 'cattle']) {
        if (animalSource[type] && animalSource[type] > 0) {
          animalType = type
          animalCount = animalSource[type]
        }
      }

      const spaceKey = pastureState.spaces
        .map(s => `${s.row},${s.col}`)
        .sort()
        .join('|')
      animalsBySpaceKey.push({ spaceKey, animalType, animalCount })
    }

    // Let the engine figure out enclosed areas from the fences
    player.recalculatePastures()

    // Match animals back to recalculated pastures by space-set comparison
    for (const pasture of player.farmyard.pastures) {
      const pKey = pasture.spaces
        .map(s => `${s.row},${s.col}`)
        .sort()
        .join('|')
      const match = animalsBySpaceKey.find(a => a.spaceKey === pKey)
      if (match && match.animalType) {
        pasture.animalType = match.animalType
        pasture.animalCount = match.animalCount
      }
    }
  }
}

/**
 * Test game state in a declarative way.
 * Checks all properties for players mentioned in `expected`, using defaults
 * for any unspecified property. Players not mentioned are not checked.
 */
TestUtil.testBoard = function(game, expected) {
  // Resolve all card refs across mentioned players
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
        playerExpected[field] = ids
      }
    }
  }

  const errors = []

  // Test round/stage
  if (expected.round !== undefined && game.state.round !== expected.round) {
    errors.push(`round: expected ${expected.round}, got ${game.state.round}`)
  }

  // Test first player
  if (expected.firstPlayer !== undefined && game.state.startingPlayer !== expected.firstPlayer) {
    errors.push(`firstPlayer: expected ${expected.firstPlayer}, got ${game.state.startingPlayer}`)
  }

  // Test current player (whose turn it is to act)
  if (expected.currentPlayer !== undefined) {
    const actual = game.waiting?.selectors?.[0]?.actor
    if (actual !== expected.currentPlayer) {
      errors.push(`currentPlayer: expected ${expected.currentPlayer}, got ${actual}`)
    }
  }

  // Only test players explicitly mentioned in expected
  for (const playerName of playerNames) {
    if (expected[playerName] === undefined) {
      continue
    }
    const playerErrors = TestUtil.testPlayerBoard(game, playerName, expected[playerName])
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

  // Use defaults for all unspecified properties
  const resources = ['food', 'wood', 'clay', 'stone', 'reed', 'grain', 'vegetables']
  for (const resource of resources) {
    const exp = expected[resource] ?? PLAYER_DEFAULTS[resource]
    if (player[resource] !== exp) {
      errors.push(`${resource}: expected ${exp}, got ${player[resource]}`)
    }
  }

  const familyExp = expected.familyMembers ?? PLAYER_DEFAULTS.familyMembers
  if (player.familyMembers !== familyExp) {
    errors.push(`familyMembers: expected ${familyExp}, got ${player.familyMembers}`)
  }

  const roomTypeExp = expected.roomType ?? PLAYER_DEFAULTS.roomType
  if (player.roomType !== roomTypeExp) {
    errors.push(`roomType: expected ${roomTypeExp}, got ${player.roomType}`)
  }

  const beggingExp = expected.beggingCards ?? PLAYER_DEFAULTS.beggingCards
  if (player.beggingCards !== beggingExp) {
    errors.push(`beggingCards: expected ${beggingExp}, got ${player.beggingCards}`)
  }

  const bonusExp = expected.bonusPoints ?? PLAYER_DEFAULTS.bonusPoints
  if (player.bonusPoints !== bonusExp) {
    errors.push(`bonusPoints: expected ${bonusExp}, got ${player.bonusPoints}`)
  }

  // Card arrays — always check, default to []
  const handExp = [...(expected.hand ?? PLAYER_DEFAULTS.hand)].sort()
  const handActual = [...player.hand].sort()
  if (JSON.stringify(handActual) !== JSON.stringify(handExp)) {
    errors.push(`hand: expected [${handExp}], got [${handActual}]`)
  }

  const occExp = [...(expected.occupations ?? PLAYER_DEFAULTS.occupations)].sort()
  const occActual = [...player.playedOccupations].sort()
  if (JSON.stringify(occActual) !== JSON.stringify(occExp)) {
    errors.push(`occupations: expected [${occExp}], got [${occActual}]`)
  }

  const minorExp = [...(expected.minorImprovements ?? PLAYER_DEFAULTS.minorImprovements)].sort()
  const minorActual = [...player.playedMinorImprovements].sort()
  if (JSON.stringify(minorActual) !== JSON.stringify(minorExp)) {
    errors.push(`minorImprovements: expected [${minorExp}], got [${minorActual}]`)
  }

  const majorExp = [...(expected.majorImprovements ?? PLAYER_DEFAULTS.majorImprovements)].sort()
  const majorActual = [...player.majorImprovements].sort()
  if (JSON.stringify(majorActual) !== JSON.stringify(majorExp)) {
    errors.push(`majorImprovements: expected [${majorExp}], got [${majorActual}]`)
  }

  // Pet
  const petExp = expected.pet !== undefined ? expected.pet : PLAYER_DEFAULTS.pet
  if (player.pet !== petExp) {
    errors.push(`pet: expected ${petExp}, got ${player.pet}`)
  }

  // Animals — always check all types
  const animalsExp = { ...ANIMAL_DEFAULTS, ...(expected.animals || {}) }
  for (const [type, count] of Object.entries(animalsExp)) {
    const actual = player.getTotalAnimals(type)
    if (actual !== count) {
      errors.push(`animals.${type}: expected ${count}, got ${actual}`)
    }
  }

  // Farmyard — detailed array-based checking
  const farmyardExp = { ...FARMYARD_DEFAULTS, ...(expected.farmyard || {}) }

  // Rooms: array of {row, col}
  const expectedRooms = farmyardExp.rooms
  const actualRoomSpaces = player.getRoomSpaces().map(r => ({ row: r.row, col: r.col }))
  const expRoomKeys = expectedRooms.map(r => `${r.row},${r.col}`).sort()
  const actRoomKeys = actualRoomSpaces.map(r => `${r.row},${r.col}`).sort()
  if (JSON.stringify(expRoomKeys) !== JSON.stringify(actRoomKeys)) {
    errors.push(`farmyard.rooms: expected [${expRoomKeys}] (${expRoomKeys.length}), got [${actRoomKeys}] (${actRoomKeys.length})`)
  }

  // Fields: array of {row, col, crop?, cropCount?}
  const expectedFields = farmyardExp.fields
  const actualFieldSpaces = player.getFieldSpaces()
  const expFieldKeys = expectedFields.map(f => `${f.row},${f.col}`).sort()
  const actFieldKeys = actualFieldSpaces.map(f => `${f.row},${f.col}`).sort()
  if (JSON.stringify(expFieldKeys) !== JSON.stringify(actFieldKeys)) {
    errors.push(`farmyard.fields: expected [${expFieldKeys}] (${expFieldKeys.length}), got [${actFieldKeys}] (${actFieldKeys.length})`)
  }
  // Check crop details for each expected field
  for (const expField of expectedFields) {
    const actual = actualFieldSpaces.find(f => f.row === expField.row && f.col === expField.col)
    if (actual) {
      const expCrop = expField.crop ?? null
      const expCropCount = expField.cropCount ?? 0
      if (actual.crop !== expCrop) {
        errors.push(`farmyard.field(${expField.row},${expField.col}).crop: expected ${expCrop}, got ${actual.crop}`)
      }
      if (actual.cropCount !== expCropCount) {
        errors.push(`farmyard.field(${expField.row},${expField.col}).cropCount: expected ${expCropCount}, got ${actual.cropCount}`)
      }
      // Check underCrop if specified (for Heresy Teacher and similar cards)
      if (expField.underCrop !== undefined) {
        const expUnderCrop = expField.underCrop ?? null
        const expUnderCropCount = expField.underCropCount ?? 0
        const actualSpace = player.getSpace(expField.row, expField.col)
        const actualUnderCrop = actualSpace.underCrop ?? null
        const actualUnderCropCount = actualSpace.underCropCount ?? 0
        if (actualUnderCrop !== expUnderCrop) {
          errors.push(`farmyard.field(${expField.row},${expField.col}).underCrop: expected ${expUnderCrop}, got ${actualUnderCrop}`)
        }
        if (actualUnderCropCount !== expUnderCropCount) {
          errors.push(`farmyard.field(${expField.row},${expField.col}).underCropCount: expected ${expUnderCropCount}, got ${actualUnderCropCount}`)
        }
      }
    }
  }

  // Pastures: array of {spaces: [{row,col}], sheep?, boar?, cattle?}
  const expectedPastures = farmyardExp.pastures
  const actualPastures = player.farmyard.pastures
  if (expectedPastures.length !== actualPastures.length) {
    errors.push(`farmyard.pastures count: expected ${expectedPastures.length}, got ${actualPastures.length}`)
  }
  for (const expPasture of expectedPastures) {
    const expKey = expPasture.spaces.map(s => `${s.row},${s.col}`).sort().join('|')
    const match = actualPastures.find(p =>
      p.spaces.map(s => `${s.row},${s.col}`).sort().join('|') === expKey
    )
    if (!match) {
      errors.push(`farmyard.pasture [${expKey}]: not found in actual pastures`)
    }
    else {
      for (const type of ['sheep', 'boar', 'cattle']) {
        const expCount = expPasture[type] ?? 0
        const actType = match.animalType
        const actCount = (actType === type) ? match.animalCount : 0
        if (actCount !== expCount) {
          errors.push(`farmyard.pasture [${expKey}].${type}: expected ${expCount}, got ${actCount}`)
        }
      }
    }
  }

  // Stables: array of {row, col}
  const expectedStables = farmyardExp.stables
  const actualStableSpaces = []
  for (let row = 0; row < res.constants.farmyardRows; row++) {
    for (let col = 0; col < res.constants.farmyardCols; col++) {
      if (player.farmyard.grid[row][col].hasStable) {
        actualStableSpaces.push({ row, col })
      }
    }
  }
  const expStableKeys = expectedStables.map(s => `${s.row},${s.col}`).sort()
  const actStableKeys = actualStableSpaces.map(s => `${s.row},${s.col}`).sort()
  if (JSON.stringify(expStableKeys) !== JSON.stringify(actStableKeys)) {
    errors.push(`farmyard.stables: expected [${expStableKeys}] (${expStableKeys.length}), got [${actStableKeys}] (${actStableKeys.length})`)
  }

  // Scheduled deliveries (optional — only check if specified)
  // Resources use { round: amount } format, events use [round, ...] format
  const SCHEDULED_EVENT_TYPES = ['plows', 'freeStables', 'freeOccupation', 'woodWithMinor', 'plowman', 'stoneRooms']
  if (expected.scheduled !== undefined) {
    for (const [type, expValue] of Object.entries(expected.scheduled)) {
      const stateKey = `scheduled${type[0].toUpperCase()}${type.slice(1)}`
      if (SCHEDULED_EVENT_TYPES.includes(type)) {
        const exp = [...expValue].sort()
        const actual = [...(game.state[stateKey]?.[playerName] ?? [])].sort()
        if (JSON.stringify(exp) !== JSON.stringify(actual)) {
          errors.push(`scheduled.${type}: expected [${exp}], got [${actual}]`)
        }
      }
      else {
        const actual = game.state[stateKey]?.[playerName] ?? {}
        const allRounds = new Set([
          ...Object.keys(expValue).map(String),
          ...Object.keys(actual).map(String),
        ])
        for (const round of allRounds) {
          const expAmount = expValue[round] ?? 0
          const actAmount = actual[round] ?? 0
          if (expAmount !== actAmount) {
            errors.push(`scheduled.${type}[${round}]: expected ${expAmount}, got ${actAmount}`)
          }
        }
      }
    }
  }

  // Score (optional — only check if specified)
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
