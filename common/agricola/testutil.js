const { AgricolaFactory } = require('./agricola.js')
const { AgricolaCard } = require('./AgricolaCard.js')
const TestCommon = require('../lib/test_common.js')
const res = require('./res/index.js')


const TestUtil = { ...TestCommon }

TestUtil.fixture = function(options) {
  options = Object.assign({
    name: 'test_game',
    seed: 'test_seed',
    numPlayers: 2,
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
    ],
    playerOptions: {
      shuffleSeats: false,
    },
  }, options)

  options.players = options.players.slice(0, options.numPlayers)

  const game = AgricolaFactory(options, 'dennis')

  game.testSetBreakpoint('initialization-complete', () => {
    // Test setup can go here
  })

  return game
}

TestUtil.gameFixture = function(state) {
  const game = this.fixture(state)

  game.testSetBreakpoint('initialization-complete', (game) => {
    if (state.dennis) {
      this.setPlayerState(game, 'dennis', state.dennis)
    }
    if (state.micah) {
      this.setPlayerState(game, 'micah', state.micah)
    }
    if (state.scott) {
      this.setPlayerState(game, 'scott', state.scott)
    }
    if (state.eliya) {
      this.setPlayerState(game, 'eliya', state.eliya)
    }
    if (state.tom) {
      this.setPlayerState(game, 'tom', state.tom)
    }
    if (state.round) {
      game.state.round = state.round
    }
    if (state.stage) {
      game.state.stage = state.stage
    }
  })

  return game
}

TestUtil.setPlayerState = function(game, playerName, state) {
  const player = game.players.byName(playerName)

  // Set resources
  const resources = [
    'food', 'wood', 'clay', 'stone', 'reed', 'grain', 'vegetables',
  ]
  for (const resource of resources) {
    if (state[resource] !== undefined) {
      player[resource] = state[resource]
    }
  }

  // Set farm state
  if (state.familyMembers !== undefined) {
    player.familyMembers = state.familyMembers
    player.availableWorkers = state.familyMembers
  }
  if (state.roomType !== undefined) {
    player.roomType = state.roomType
    // Update existing rooms
    for (let row = 0; row < res.constants.farmyardRows; row++) {
      for (let col = 0; col < res.constants.farmyardCols; col++) {
        if (player.farmyard.grid[row][col].type === 'room') {
          player.farmyard.grid[row][col].roomType = state.roomType
        }
      }
    }
  }
  if (state.beggingCards !== undefined) {
    player.beggingCards = state.beggingCards
  }
  if (state.occupationsPlayed !== undefined) {
    player.occupationsPlayed = state.occupationsPlayed
  }

  // Set major improvements
  if (state.majorImprovements !== undefined) {
    TestUtil.setPlayerMajorImprovements(game, player, state.majorImprovements)
  }

  // Set farmyard from description
  if (state.farmyard) {
    this.setFarmyard(player, state.farmyard)
  }

  // Set animals
  if (state.pet !== undefined) {
    player.pet = state.pet
  }

  // Add animals to pastures
  if (state.animals) {
    this.setAnimals(player, state.animals)
  }
}

TestUtil.setFarmyard = function(player, farmyardDesc) {
  // farmyardDesc is a 2D array or object describing the farmyard
  // Each cell can be:
  // - 'empty' or null
  // - 'room' or 'R'
  // - 'field' or 'F'
  // - 'stable' or 'S'
  // - { type: 'field', crop: 'grain', cropCount: 3 }
  // - { type: 'room', roomType: 'clay' }

  if (Array.isArray(farmyardDesc)) {
    for (let row = 0; row < farmyardDesc.length && row < res.constants.farmyardRows; row++) {
      for (let col = 0; col < farmyardDesc[row].length && col < res.constants.farmyardCols; col++) {
        const desc = farmyardDesc[row][col]
        player.farmyard.grid[row][col] = this.parseSpaceDescription(desc, player.roomType)
      }
    }
  }

  // Recalculate pastures if there are fences
  if (player.farmyard.fences.length > 0) {
    player.recalculatePastures()
  }
}

TestUtil.parseSpaceDescription = function(desc, defaultRoomType) {
  if (!desc || desc === 'empty' || desc === '.') {
    return { type: 'empty' }
  }

  if (desc === 'room' || desc === 'R') {
    return { type: 'room', roomType: defaultRoomType }
  }

  if (desc === 'field' || desc === 'F') {
    return { type: 'field', crop: null, cropCount: 0 }
  }

  if (desc === 'stable' || desc === 'S') {
    return { type: 'empty', hasStable: true }
  }

  if (desc === 'pasture' || desc === 'P') {
    return { type: 'pasture' }
  }

  if (typeof desc === 'object') {
    const space = { type: desc.type || 'empty' }

    if (desc.type === 'room') {
      space.roomType = desc.roomType || defaultRoomType
    }

    if (desc.type === 'field') {
      space.crop = desc.crop || null
      space.cropCount = desc.cropCount || 0
    }

    if (desc.hasStable) {
      space.hasStable = true
    }

    if (desc.animal) {
      space.animal = desc.animal
    }

    return space
  }

  return { type: 'empty' }
}

TestUtil.setAnimals = function(player, animals) {
  // animals is an object like { sheep: 3, boar: 2, cattle: 1 }
  for (const [type, count] of Object.entries(animals)) {
    if (count > 0) {
      player.addAnimals(type, count)
    }
  }
}

TestUtil.addPasture = function(player, spaces, animalType = null, animalCount = 0) {
  // Add a pasture to the player's farmyard
  // spaces is an array of { row, col } objects

  const pasture = {
    id: player.farmyard.pastures.length,
    spaces: spaces,
    animalType: animalType,
    animalCount: animalCount,
  }

  player.farmyard.pastures.push(pasture)

  // Mark spaces as pasture
  for (const space of spaces) {
    player.farmyard.grid[space.row][space.col].type = 'pasture'
  }

  return pasture
}

TestUtil.addFences = function(player, fences) {
  // Add fence segments to the player's farmyard
  // fences is an array of { row1, col1, row2, col2 } objects
  for (const fence of fences) {
    player.farmyard.fences.push(fence)
  }
  player.recalculatePastures()
}

TestUtil.buildRooms = function(player, positions) {
  // Build rooms at the specified positions
  // positions is an array of { row, col } objects
  for (const pos of positions) {
    player.farmyard.grid[pos.row][pos.col] = {
      type: 'room',
      roomType: player.roomType,
    }
  }
}

TestUtil.plowFields = function(player, positions) {
  // Plow fields at the specified positions
  for (const pos of positions) {
    player.farmyard.grid[pos.row][pos.col] = {
      type: 'field',
      crop: null,
      cropCount: 0,
    }
  }
}

TestUtil.sowFields = function(player, sowings) {
  // Sow crops on fields
  // sowings is an array of { row, col, crop, cropCount } objects
  for (const sow of sowings) {
    const space = player.farmyard.grid[sow.row][sow.col]
    if (space.type === 'field') {
      space.crop = sow.crop
      space.cropCount = sow.cropCount
    }
  }
}

TestUtil.buildStables = function(player, positions) {
  // Build stables at the specified positions
  for (const pos of positions) {
    player.farmyard.grid[pos.row][pos.col].hasStable = true
  }
}

TestUtil.testBoard = function(game, expected) {
  for (const [key, value] of Object.entries(expected)) {
    if (key === 'dennis' || key === 'micah' || key === 'scott' || key === 'eliya' || key === 'tom') {
      this.testPlayerState(game, key, value)
    }
    else if (key === 'round') {
      expect(game.state.round).toBe(value)
    }
    else if (key === 'stage') {
      expect(game.state.stage).toBe(value)
    }
  }
}

TestUtil.testPlayerState = function(game, playerName, expected) {
  const player = game.players.byName(playerName)

  for (const [key, value] of Object.entries(expected)) {
    if (key === 'animals') {
      this.testAnimals(player, value)
    }
    else if (key === 'farmyard') {
      this.testFarmyard(player, value)
    }
    else if (key === 'score') {
      expect(player.calculateScore()).toBe(value)
    }
    else {
      expect(player[key]).toBe(value)
    }
  }
}

TestUtil.testAnimals = function(player, expected) {
  for (const [type, count] of Object.entries(expected)) {
    expect(player.getTotalAnimals(type)).toBe(count)
  }
}

TestUtil.testFarmyard = function(player, expected) {
  if (expected.rooms !== undefined) {
    expect(player.getRoomCount()).toBe(expected.rooms)
  }
  if (expected.fields !== undefined) {
    expect(player.getFieldCount()).toBe(expected.fields)
  }
  if (expected.pastures !== undefined) {
    expect(player.getPastureCount()).toBe(expected.pastures)
  }
  if (expected.stables !== undefined) {
    expect(player.getStableCount()).toBe(expected.stables)
  }
  if (expected.fences !== undefined) {
    expect(player.getFenceCount()).toBe(expected.fences)
  }
  if (expected.unusedSpaces !== undefined) {
    expect(player.getUnusedSpaceCount()).toBe(expected.unusedSpaces)
  }
}

TestUtil.testScoring = function(player, expected) {
  const breakdown = player.getScoreBreakdown()

  for (const [category, value] of Object.entries(expected)) {
    if (typeof value === 'object') {
      if (value.count !== undefined) {
        expect(breakdown[category].count).toBe(value.count)
      }
      if (value.points !== undefined) {
        expect(breakdown[category].points).toBe(value.points)
      }
    }
    else {
      expect(breakdown[category]).toBe(value)
    }
  }
}


// ---------------------------------------------------------------------------
// setBoard / testBoard pattern for comprehensive testing
// ---------------------------------------------------------------------------

/**
 * Set up game state in a declarative way.
 * Usage:
 *   t.setBoard(game, {
 *     dennis: {
 *       food: 5,
 *       wood: 3,
 *       hand: ['shifting-cultivation', 'clay-embankment'],
 *       occupations: ['wood-cutter'],
 *       minorImprovements: ['corn-scoop'],
 *       majorImprovements: ['fireplace-2'],
 *       farmyard: {
 *         rooms: 3,
 *         fields: [{ row: 1, col: 0, crop: 'grain', cropCount: 3 }],
 *         pastures: [{ spaces: [{row: 2, col: 0}], animals: { sheep: 2 }}],
 *         stables: [{ row: 1, col: 1 }],
 *       },
 *       animals: { sheep: 2, boar: 1 },
 *     },
 *     round: 5,
 *   })
 */
TestUtil.setBoard = function(game, state) {
  game.testSetBreakpoint('initialization-complete', (game) => {
    // Set round/stage
    if (state.round !== undefined) {
      game.state.round = state.round
      game.state.stage = res.constants.roundToStage[state.round] || 1
    }
    if (state.stage !== undefined) {
      game.state.stage = state.stage
    }

    // Set player states
    for (const playerName of ['dennis', 'micah', 'scott', 'eliya', 'tom']) {
      if (state[playerName]) {
        TestUtil.setPlayerBoard(game, playerName, state[playerName])
      }
    }

    // availableMajorImprovements is now zone-backed, no direct state manipulation needed
  })
}

TestUtil.setPlayerBoard = function(game, playerName, playerState) {
  const player = game.players.byName(playerName)
  if (!player) {
    return
  }

  // Set resources
  const resources = ['food', 'wood', 'clay', 'stone', 'reed', 'grain', 'vegetables']
  for (const resource of resources) {
    if (playerState[resource] !== undefined) {
      player[resource] = playerState[resource]
    }
  }

  // Set family members
  if (playerState.familyMembers !== undefined) {
    player.familyMembers = playerState.familyMembers
    player.availableWorkers = playerState.familyMembers
  }

  // Set room type
  if (playerState.roomType !== undefined) {
    player.roomType = playerState.roomType
    // Update existing rooms
    for (let row = 0; row < res.constants.farmyardRows; row++) {
      for (let col = 0; col < res.constants.farmyardCols; col++) {
        if (player.farmyard.grid[row][col].type === 'room') {
          player.farmyard.grid[row][col].roomType = playerState.roomType
        }
      }
    }
  }

  // Set begging cards
  if (playerState.beggingCards !== undefined) {
    player.beggingCards = playerState.beggingCards
  }

  // Set bonus points
  if (playerState.bonusPoints !== undefined) {
    player.bonusPoints = playerState.bonusPoints
  }

  // Set cards via zones and card manager
  if (playerState.hand !== undefined) {
    TestUtil.setPlayerCards(game, player, 'hand', playerState.hand)
  }
  if (playerState.occupations !== undefined) {
    TestUtil.setPlayerCards(game, player, 'occupations', playerState.occupations)
    player.occupationsPlayed = playerState.occupations.length
  }
  if (playerState.minorImprovements !== undefined) {
    TestUtil.setPlayerCards(game, player, 'minorImprovements', playerState.minorImprovements)
  }
  if (playerState.majorImprovements !== undefined) {
    TestUtil.setPlayerMajorImprovements(game, player, playerState.majorImprovements)
  }

  // Set farmyard
  if (playerState.farmyard) {
    TestUtil.setPlayerFarmyard(player, playerState.farmyard)
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
  // Set room count (build additional rooms if needed)
  if (farmyardState.rooms !== undefined) {
    const currentRooms = player.getRoomCount()
    if (farmyardState.rooms > currentRooms) {
      const validSpaces = player.getValidRoomBuildSpaces()
      let toAdd = farmyardState.rooms - currentRooms
      for (const space of validSpaces) {
        if (toAdd <= 0) {
          break
        }
        player.buildRoom(space.row, space.col)
        toAdd--
      }
    }
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
  const errors = []

  // Test round/stage
  if (expected.round !== undefined && game.state.round !== expected.round) {
    errors.push(`round: expected ${expected.round}, got ${game.state.round}`)
  }
  if (expected.stage !== undefined && game.state.stage !== expected.stage) {
    errors.push(`stage: expected ${expected.stage}, got ${game.state.stage}`)
  }

  // Test player states
  for (const playerName of ['dennis', 'micah', 'scott', 'eliya', 'tom']) {
    if (expected[playerName]) {
      const playerErrors = TestUtil.testPlayerBoard(game, playerName, expected[playerName])
      errors.push(...playerErrors.map(e => `${playerName}.${e}`))
    }
  }

  if (errors.length > 0) {
    throw new Error('Board state mismatch:\n  ' + errors.join('\n  '))
  }
}

TestUtil.testPlayerBoard = function(game, playerName, expected) {
  const player = game.players.byName(playerName)
  const errors = []

  // Test resources
  const resources = ['food', 'wood', 'clay', 'stone', 'reed', 'grain', 'vegetables']
  for (const resource of resources) {
    if (expected[resource] !== undefined && player[resource] !== expected[resource]) {
      errors.push(`${resource}: expected ${expected[resource]}, got ${player[resource]}`)
    }
  }

  // Test family
  if (expected.familyMembers !== undefined && player.familyMembers !== expected.familyMembers) {
    errors.push(`familyMembers: expected ${expected.familyMembers}, got ${player.familyMembers}`)
  }

  // Test room type
  if (expected.roomType !== undefined && player.roomType !== expected.roomType) {
    errors.push(`roomType: expected ${expected.roomType}, got ${player.roomType}`)
  }

  // Test begging cards
  if (expected.beggingCards !== undefined && player.beggingCards !== expected.beggingCards) {
    errors.push(`beggingCards: expected ${expected.beggingCards}, got ${player.beggingCards}`)
  }

  // Test cards
  if (expected.hand !== undefined) {
    const actualHand = [...player.hand].sort()
    const expectedHand = [...expected.hand].sort()
    if (JSON.stringify(actualHand) !== JSON.stringify(expectedHand)) {
      errors.push(`hand: expected [${expectedHand}], got [${actualHand}]`)
    }
  }

  if (expected.occupations !== undefined) {
    const actual = [...player.playedOccupations].sort()
    const exp = [...expected.occupations].sort()
    if (JSON.stringify(actual) !== JSON.stringify(exp)) {
      errors.push(`occupations: expected [${exp}], got [${actual}]`)
    }
  }

  if (expected.minorImprovements !== undefined) {
    const actual = [...player.playedMinorImprovements].sort()
    const exp = [...expected.minorImprovements].sort()
    if (JSON.stringify(actual) !== JSON.stringify(exp)) {
      errors.push(`minorImprovements: expected [${exp}], got [${actual}]`)
    }
  }

  if (expected.majorImprovements !== undefined) {
    const actual = [...player.majorImprovements].sort()
    const exp = [...expected.majorImprovements].sort()
    if (JSON.stringify(actual) !== JSON.stringify(exp)) {
      errors.push(`majorImprovements: expected [${exp}], got [${actual}]`)
    }
  }

  // Test animals
  if (expected.animals) {
    for (const [type, count] of Object.entries(expected.animals)) {
      const actual = player.getTotalAnimals(type)
      if (actual !== count) {
        errors.push(`animals.${type}: expected ${count}, got ${actual}`)
      }
    }
  }

  // Test farmyard properties
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

  // Test score
  if (expected.score !== undefined) {
    const actual = player.calculateScore()
    if (actual !== expected.score) {
      errors.push(`score: expected ${expected.score}, got ${actual}`)
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

// Shortcut to get a player
TestUtil.player = function(game, name = 'dennis') {
  return game.players.byName(name)
}

// Shortcut to play a card directly (bypasses normal game flow)
TestUtil.playCard = function(game, playerName, cardId) {
  const player = game.players.byName(playerName)
  const card = TestUtil.ensureCard(game, cardId)

  // Add to hand zone if not there
  if (!player.hand.includes(cardId)) {
    const handZone = game.zones.byPlayer(player, 'hand')
    card.moveTo(handZone)
  }

  // Play the card
  player.playCard(cardId)

  // Execute onPlay if present
  if (card.hasHook('onPlay')) {
    card.callHook('onPlay', game, player)
  }

  return card
}


module.exports = TestUtil
