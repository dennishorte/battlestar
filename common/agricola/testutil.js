const { AgricolaFactory } = require('./agricola.js')
const TestCommon = require('../lib/test_common.js')
const res = require('./res/index.js')


const TestUtil = { ...TestCommon }

TestUtil.fixture = function(options) {
  options = Object.assign({
    name: 'test_game',
    seed: 'test_seed',
    numPlayers: 2,
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
    player.majorImprovements = [...state.majorImprovements]
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
    if (key === 'dennis' || key === 'micah' || key === 'scott' || key === 'eliya') {
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


module.exports = TestUtil
