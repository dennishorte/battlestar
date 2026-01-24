const t = require('./testutil.js')
const res = require('./res/index.js')


describe('Agricola', () => {

  describe('initialization', () => {
    test('game initializes with correct default state', () => {
      const game = t.fixture()
      game.run()

      expect(game.state.initializationComplete).toBe(true)
      expect(game.state.round).toBe(1)
      expect(game.state.stage).toBe(1)
    })

    test('players start with correct resources', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.food).toBe(2) // First player gets 2 food
      expect(dennis.wood).toBe(0)
      expect(dennis.familyMembers).toBe(2)
      expect(dennis.roomType).toBe('wood')

      const micah = game.players.byName('micah')
      expect(micah.food).toBe(3) // Other players get 3 food
    })

    test('players start with 2 wooden rooms', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.getRoomCount()).toBe(2)
      expect(dennis.roomType).toBe('wood')
    })

    test('players start with correct farmyard', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.getSpace(0, 0).type).toBe('room')
      expect(dennis.getSpace(0, 1).type).toBe('room')
      expect(dennis.getSpace(0, 2).type).toBe('empty')
    })

    test('base action spaces are initialized', () => {
      const game = t.fixture()
      game.run()

      expect(game.state.activeActions).toContain('take-wood')
      expect(game.state.activeActions).toContain('take-clay')
      expect(game.state.activeActions).toContain('plow-field')
    })

    test('supports 2-5 players', () => {
      for (const numPlayers of [2, 3, 4, 5]) {
        const game = t.fixture({ numPlayers })
        game.run()

        expect(game.players.all()).toHaveLength(numPlayers)
      }
    })

    test('starting food varies by player position', () => {
      const game = t.fixture({ numPlayers: 4 })
      game.run()

      const players = game.players.all()
      expect(players[0].food).toBe(2) // First player: 2 food
      expect(players[1].food).toBe(3) // Others: 3 food
      expect(players[2].food).toBe(3)
      expect(players[3].food).toBe(3)
    })

    test('players receive cards when not drafting', () => {
      const game = t.fixture({ useDrafting: false })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hand.length).toBe(14) // 7 occupations + 7 minor improvements

      const micah = game.players.byName('micah')
      expect(micah.hand.length).toBe(14)
    })

    test('drafting sets up draft pools', () => {
      const game = t.fixture({ useDrafting: true })

      // Set up a breakpoint after initialization to check draft state
      game.testSetBreakpoint('initialization-complete', () => {
        // Draft pools should be set up
        expect(game.state.draftPools).toBeDefined()
        expect(game.state.draftPools.occupations).toHaveLength(2) // 2 players
        expect(game.state.draftPools.minors).toHaveLength(2)
        expect(game.state.draftPools.occupations[0]).toHaveLength(7)
        expect(game.state.draftPools.minors[0]).toHaveLength(7)

        // Players should start with empty hands
        const dennis = game.players.byName('dennis')
        expect(dennis.hand.length).toBe(0)
      })

      game.run()
    })
  })

  describe('player resources', () => {
    test('addResource increases resource count', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.addResource('wood', 3)
      expect(dennis.wood).toBe(3)

      dennis.addResource('wood', 2)
      expect(dennis.wood).toBe(5)
    })

    test('removeResource decreases resource count', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.wood = 5
      dennis.removeResource('wood', 2)
      expect(dennis.wood).toBe(3)
    })

    test('removeResource does not go below zero', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.wood = 2
      dennis.removeResource('wood', 5)
      expect(dennis.wood).toBe(0)
    })

    test('hasResource checks resource availability', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.wood = 3

      expect(dennis.hasResource('wood', 2)).toBe(true)
      expect(dennis.hasResource('wood', 3)).toBe(true)
      expect(dennis.hasResource('wood', 4)).toBe(false)
    })

    test('canAffordCost checks multiple resources', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.wood = 5
      dennis.reed = 2

      expect(dennis.canAffordCost({ wood: 5, reed: 2 })).toBe(true)
      expect(dennis.canAffordCost({ wood: 6, reed: 2 })).toBe(false)
      expect(dennis.canAffordCost({ wood: 5, reed: 3 })).toBe(false)
    })

    test('payCost deducts resources', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.wood = 10
      dennis.reed = 5

      dennis.payCost({ wood: 5, reed: 2 })

      expect(dennis.wood).toBe(5)
      expect(dennis.reed).toBe(3)
    })
  })

  describe('family members', () => {
    test('players start with 2 family members', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.getFamilySize()).toBe(2)
      expect(dennis.getAvailableWorkers()).toBe(2)
    })

    test('useWorker decrements available workers', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.useWorker()).toBe(true)
      expect(dennis.getAvailableWorkers()).toBe(1)

      expect(dennis.useWorker()).toBe(true)
      expect(dennis.getAvailableWorkers()).toBe(0)

      expect(dennis.useWorker()).toBe(false)
      expect(dennis.getAvailableWorkers()).toBe(0)
    })

    test('resetWorkers restores available workers', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.useWorker()
      dennis.useWorker()
      expect(dennis.getAvailableWorkers()).toBe(0)

      dennis.resetWorkers()
      expect(dennis.getAvailableWorkers()).toBe(2)
    })

    test('canGrowFamily checks room availability', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      // 2 rooms, 2 family members - cannot grow
      expect(dennis.canGrowFamily(true)).toBe(false)

      // Add a room
      dennis.buildRoom(0, 2)
      expect(dennis.canGrowFamily(true)).toBe(true)
    })

    test('canGrowFamily without room requirement', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      // 2 rooms, 2 family members - can grow without room requirement
      expect(dennis.canGrowFamily(false)).toBe(true)
    })

    test('growFamily adds family member', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.buildRoom(0, 2) // Add third room

      expect(dennis.growFamily()).toBe(true)
      expect(dennis.getFamilySize()).toBe(3)
      expect(dennis.newborns).toContain(3)
    })

    test('cannot exceed 5 family members', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.familyMembers = 5

      expect(dennis.canGrowFamily(false)).toBe(false)
      expect(dennis.growFamily()).toBe(false)
    })
  })

  describe('farmyard grid', () => {
    test('getSpace returns correct space', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      const space = dennis.getSpace(0, 0)

      expect(space.type).toBe('room')
      expect(space.roomType).toBe('wood')
    })

    test('getSpace returns null for out of bounds', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')

      expect(dennis.getSpace(-1, 0)).toBeNull()
      expect(dennis.getSpace(0, -1)).toBeNull()
      expect(dennis.getSpace(3, 0)).toBeNull()
      expect(dennis.getSpace(0, 5)).toBeNull()
    })

    test('isSpaceEmpty correctly identifies empty spaces', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')

      expect(dennis.isSpaceEmpty(0, 0)).toBe(false) // Room
      expect(dennis.isSpaceEmpty(0, 2)).toBe(true)  // Empty
    })

    test('getEmptySpaces returns all empty spaces', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      const emptySpaces = dennis.getEmptySpaces()

      // 15 total - 2 rooms = 13 empty
      expect(emptySpaces.length).toBe(13)
    })
  })

  describe('room building', () => {
    test('canBuildRoom requires adjacency to existing room', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')

      // Adjacent to room at (0,1)
      expect(dennis.canBuildRoom(0, 2)).toBe(true)
      expect(dennis.canBuildRoom(1, 0)).toBe(true)
      expect(dennis.canBuildRoom(1, 1)).toBe(true)

      // Not adjacent to any room
      expect(dennis.canBuildRoom(2, 4)).toBe(false)
    })

    test('buildRoom creates room at location', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.buildRoom(0, 2)

      expect(dennis.getSpace(0, 2).type).toBe('room')
      expect(dennis.getSpace(0, 2).roomType).toBe('wood')
      expect(dennis.getRoomCount()).toBe(3)
    })

    test('getValidRoomBuildSpaces returns correct spaces', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      const validSpaces = dennis.getValidRoomBuildSpaces()

      // Should be adjacent to existing rooms
      expect(validSpaces.length).toBeGreaterThan(0)
      expect(validSpaces.some(s => s.row === 0 && s.col === 2)).toBe(true)
      expect(validSpaces.some(s => s.row === 1 && s.col === 0)).toBe(true)
    })

    test('canAffordRoom checks resources', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.canAffordRoom()).toBe(false)

      dennis.wood = 5
      dennis.reed = 2
      expect(dennis.canAffordRoom()).toBe(true)
    })
  })

  describe('renovation', () => {
    test('canRenovate checks material and reed', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.canRenovate()).toBe(false)

      // Need 2 clay (1 per room) + 1 reed
      dennis.clay = 2
      dennis.reed = 1
      expect(dennis.canRenovate()).toBe(true)
    })

    test('renovate upgrades house type', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.clay = 2
      dennis.reed = 1

      expect(dennis.renovate()).toBe(true)
      expect(dennis.roomType).toBe('clay')
      expect(dennis.getSpace(0, 0).roomType).toBe('clay')
      expect(dennis.clay).toBe(0)
      expect(dennis.reed).toBe(0)
    })

    test('cannot renovate stone house', () => {
      const game = t.gameFixture({
        dennis: { roomType: 'stone', stone: 10, reed: 10 },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.canRenovate()).toBe(false)
    })
  })

  describe('fields', () => {
    test('plowField creates field', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.plowField(1, 0)).toBe(true)

      expect(dennis.getSpace(1, 0).type).toBe('field')
      expect(dennis.getFieldCount()).toBe(1)
    })

    test('first field can go anywhere', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.canPlowField(2, 4)).toBe(true)
    })

    test('additional fields must be adjacent', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.plowField(1, 0)

      expect(dennis.canPlowField(1, 1)).toBe(true)  // Adjacent
      expect(dennis.canPlowField(2, 4)).toBe(false) // Not adjacent
    })

    test('sowField plants crops', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.plowField(1, 0)
      dennis.grain = 1

      expect(dennis.sowField(1, 0, 'grain')).toBe(true)

      const space = dennis.getSpace(1, 0)
      expect(space.crop).toBe('grain')
      expect(space.cropCount).toBe(3) // 1 + 2 bonus
      expect(dennis.grain).toBe(0)
    })

    test('harvestFields collects crops', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      t.plowFields(dennis, [{ row: 1, col: 0 }])
      t.sowFields(dennis, [{ row: 1, col: 0, crop: 'grain', cropCount: 3 }])

      const harvested = dennis.harvestFields()

      expect(harvested.grain).toBe(1)
      expect(dennis.grain).toBe(1)
      expect(dennis.getSpace(1, 0).cropCount).toBe(2)
    })
  })

  describe('stables', () => {
    test('buildStable creates stable', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.buildStable(1, 0)).toBe(true)

      expect(dennis.getSpace(1, 0).hasStable).toBe(true)
      expect(dennis.getStableCount()).toBe(1)
    })

    test('cannot build stable on room or field', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.plowField(1, 0)

      expect(dennis.canBuildStable(0, 0)).toBe(false) // Room
      expect(dennis.canBuildStable(1, 0)).toBe(false) // Field
    })

    test('max 4 stables per player', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      t.buildStables(dennis, [
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 1, col: 2 },
        { row: 1, col: 3 },
      ])

      expect(dennis.canBuildStable(1, 4)).toBe(false)
    })
  })

  describe('animals', () => {
    test('pet can hold one animal', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.addAnimals('sheep', 1)).toBe(true)

      expect(dennis.pet).toBe('sheep')
      expect(dennis.getTotalAnimals('sheep')).toBe(1)
    })

    test('unfenced stable holds one animal', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.buildStable(1, 0)

      expect(dennis.addAnimals('sheep', 2)).toBe(true)
      expect(dennis.getTotalAnimals('sheep')).toBe(2)
    })

    test('pasture holds 2 animals per space', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      t.addPasture(dennis, [{ row: 1, col: 0 }, { row: 1, col: 1 }])

      // 2 spaces * 2 = 4 capacity, plus 1 pet = 5 total
      expect(dennis.addAnimals('sheep', 5)).toBe(true)
      expect(dennis.getTotalAnimals('sheep')).toBe(5)
    })

    test('stable in pasture doubles capacity', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.buildStable(1, 0)
      t.addPasture(dennis, [{ row: 1, col: 0 }])

      // 1 space * 2 * 2 (stable) = 4, plus 1 pet = 5
      expect(dennis.canPlaceAnimals('sheep', 5)).toBe(true)
    })

    test('removeAnimals removes from inventory', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      t.addPasture(dennis, [{ row: 1, col: 0 }], 'sheep', 3)
      dennis.pet = 'sheep'

      expect(dennis.removeAnimals('sheep', 2)).toBe(true)
      expect(dennis.getTotalAnimals('sheep')).toBe(2)
    })

    test('breedAnimals creates offspring', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      t.addPasture(dennis, [{ row: 1, col: 0 }, { row: 1, col: 1 }], 'sheep', 2)

      const bred = dennis.breedAnimals()

      expect(bred.sheep).toBe(1)
      expect(dennis.getTotalAnimals('sheep')).toBe(3)
    })

    test('breedAnimals requires 2 animals', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      t.addPasture(dennis, [{ row: 1, col: 0 }], 'sheep', 1)

      const bred = dennis.breedAnimals()

      expect(bred.sheep).toBe(0)
    })
  })

  describe('feeding', () => {
    test('getFoodRequired calculates correctly', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      // 2 family members * 2 food = 4
      expect(dennis.getFoodRequired()).toBe(4)
    })

    test('newborns only need 1 food', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.familyMembers = 3
      dennis.newborns = [3]

      // 2 adults * 2 + 1 newborn * 1 = 5
      expect(dennis.getFoodRequired()).toBe(5)
    })

    test('feedFamily with enough food', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.food = 10

      const result = dennis.feedFamily()

      expect(result.required).toBe(4)
      expect(result.beggingCards).toBe(0)
      expect(dennis.food).toBe(6)
    })

    test('feedFamily with insufficient food', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.food = 1

      const result = dennis.feedFamily()

      expect(result.beggingCards).toBe(3) // Need 4, have 1
      expect(dennis.food).toBe(0)
      expect(dennis.beggingCards).toBe(3)
    })
  })

  describe('cooking and baking', () => {
    test('hasCookingAbility without improvement', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasCookingAbility()).toBe(false)
    })

    test('hasCookingAbility with fireplace', () => {
      const game = t.gameFixture({
        dennis: { majorImprovements: ['fireplace-2'] },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasCookingAbility()).toBe(true)
    })

    test('cookAnimal converts to food', () => {
      const game = t.gameFixture({
        dennis: { majorImprovements: ['fireplace-2'] },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      t.addPasture(dennis, [{ row: 1, col: 0 }], 'sheep', 2)

      const food = dennis.cookAnimal('sheep', 1)

      expect(food).toBe(2) // Fireplace: sheep -> 2 food
      expect(dennis.food).toBe(4) // Started with 2
      expect(dennis.getTotalAnimals('sheep')).toBe(1)
    })

    test('bakeGrain with fireplace', () => {
      const game = t.gameFixture({
        dennis: { majorImprovements: ['fireplace-2'], grain: 3 },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const food = dennis.bakeGrain(2)

      expect(food).toBe(4) // Fireplace: 2 grain -> 4 food
      expect(dennis.grain).toBe(1)
    })

    test('convertToFood basic conversion', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.grain = 3

      const converted = dennis.convertToFood('grain', 2)

      expect(converted).toBe(2)
      expect(dennis.grain).toBe(1)
      expect(dennis.food).toBe(4) // Started with 2
    })
  })

  describe('major improvements', () => {
    test('canBuyMajorImprovement checks resources', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.canBuyMajorImprovement('fireplace-2')).toBe(false)

      dennis.clay = 2
      expect(dennis.canBuyMajorImprovement('fireplace-2')).toBe(true)
    })

    test('buyMajorImprovement adds to inventory', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.clay = 2

      expect(dennis.buyMajorImprovement('fireplace-2')).toBe(true)
      expect(dennis.majorImprovements).toContain('fireplace-2')
      expect(dennis.clay).toBe(0)
    })

    test('upgrade fireplace to cooking hearth', () => {
      const game = t.gameFixture({
        dennis: { majorImprovements: ['fireplace-2'], clay: 4 },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.canBuyMajorImprovement('cooking-hearth-4')).toBe(true)

      dennis.buyMajorImprovement('cooking-hearth-4')

      expect(dennis.majorImprovements).toContain('cooking-hearth-4')
      expect(dennis.majorImprovements).not.toContain('fireplace-2')
    })
  })

  describe('scoring', () => {
    test('field scoring', () => {
      const game = t.fixture()
      game.run()

      // 0-1 fields = -1 point
      expect(res.scoreCategory('fields', 0)).toBe(-1)
      expect(res.scoreCategory('fields', 1)).toBe(-1)

      // 2 fields = 1 point
      expect(res.scoreCategory('fields', 2)).toBe(1)

      // 5+ fields = 4 points
      expect(res.scoreCategory('fields', 5)).toBe(4)
    })

    test('pasture scoring', () => {
      // 0 pastures = -1
      expect(res.scoreCategory('pastures', 0)).toBe(-1)

      // 4+ pastures = 4 points
      expect(res.scoreCategory('pastures', 4)).toBe(4)
    })

    test('grain scoring', () => {
      // 0 grain = -1
      expect(res.scoreCategory('grain', 0)).toBe(-1)

      // 1-3 grain = 1 point
      expect(res.scoreCategory('grain', 1)).toBe(1)
      expect(res.scoreCategory('grain', 3)).toBe(1)

      // 8+ grain = 4 points
      expect(res.scoreCategory('grain', 8)).toBe(4)
    })

    test('animal scoring', () => {
      // Sheep: 8+ = 4 points
      expect(res.scoreCategory('sheep', 8)).toBe(4)

      // Boar: 7+ = 4 points
      expect(res.scoreCategory('boar', 7)).toBe(4)

      // Cattle: 6+ = 4 points
      expect(res.scoreCategory('cattle', 6)).toBe(4)
    })

    test('room scoring', () => {
      expect(res.scoreRooms(3, 'wood')).toBe(0)
      expect(res.scoreRooms(3, 'clay')).toBe(3)
      expect(res.scoreRooms(3, 'stone')).toBe(6)
    })

    test('family member scoring', () => {
      expect(res.scoreFamilyMembers(2)).toBe(6)
      expect(res.scoreFamilyMembers(5)).toBe(15)
    })

    test('unused space penalty', () => {
      expect(res.scoreUnusedSpaces(5)).toBe(-5)
    })

    test('begging card penalty', () => {
      expect(res.scoreBeggingCards(2)).toBe(-6)
    })

    test('complete score calculation', () => {
      const game = t.gameFixture({
        dennis: {
          familyMembers: 3,
          grain: 4,
          vegetables: 2,
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      t.plowFields(dennis, [{ row: 1, col: 0 }, { row: 1, col: 1 }])
      t.addPasture(dennis, [{ row: 2, col: 0 }], 'sheep', 4)

      const breakdown = dennis.getScoreBreakdown()

      expect(breakdown.fields.count).toBe(2)
      expect(breakdown.fields.points).toBe(1)
      expect(breakdown.pastures.count).toBe(1)
      expect(breakdown.pastures.points).toBe(1)
      expect(breakdown.grain.count).toBe(4)
      expect(breakdown.grain.points).toBe(2)
      expect(breakdown.vegetables.count).toBe(2)
      expect(breakdown.vegetables.points).toBe(2)
      expect(breakdown.sheep.count).toBe(4)
      expect(breakdown.sheep.points).toBe(2)
      expect(breakdown.familyMembers.count).toBe(3)
      expect(breakdown.familyMembers.points).toBe(9)
    })
  })

  describe('gameFixture', () => {
    test('sets player resources from fixture', () => {
      const game = t.gameFixture({
        dennis: {
          wood: 5,
          clay: 3,
          food: 10,
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.wood).toBe(5)
      expect(dennis.clay).toBe(3)
      expect(dennis.food).toBe(10)
    })

    test('sets player farm state from fixture', () => {
      const game = t.gameFixture({
        dennis: {
          familyMembers: 4,
          roomType: 'clay',
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.familyMembers).toBe(4)
      expect(dennis.roomType).toBe('clay')
    })

    test('sets major improvements from fixture', () => {
      const game = t.gameFixture({
        dennis: {
          majorImprovements: ['fireplace-2', 'well'],
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.majorImprovements).toContain('fireplace-2')
      expect(dennis.majorImprovements).toContain('well')
    })
  })

  describe('action spaces', () => {
    test('getActionById returns correct action', () => {
      const action = res.getActionById('take-wood')
      expect(action.name).toBe('Take Wood')
      expect(action.type).toBe('accumulating')
    })

    test('getBaseActions returns base actions', () => {
      const baseActions = res.getBaseActions()
      expect(baseActions.length).toBe(10)
      expect(baseActions.some(a => a.id === 'take-wood')).toBe(true)
    })

    test('getRoundCardsByStage returns correct cards', () => {
      const stage1Cards = res.getRoundCardsByStage(1)
      expect(stage1Cards.length).toBe(4)
      expect(stage1Cards.some(c => c.id === 'sow-bake')).toBe(true)
    })
  })

  describe('player count actions', () => {
    test('2 player game has no additional actions', () => {
      const game = t.fixture({ numPlayers: 2 })
      game.run()

      // Base actions only (10)
      expect(game.state.activeActions).not.toContain('clay-pit')
      expect(game.state.activeActions).not.toContain('copse')
    })

    test('3 player game has 4 additional actions', () => {
      const game = t.fixture({ numPlayers: 3 })
      game.run()

      // Should have 3-player actions
      expect(game.state.activeActions).toContain('clay-pit')
      expect(game.state.activeActions).toContain('take-1-building-resource')
      expect(game.state.activeActions).toContain('take-3-wood')
      expect(game.state.activeActions).toContain('resource-market')

      // Should NOT have 4-5 player actions
      expect(game.state.activeActions).not.toContain('copse')
      expect(game.state.activeActions).not.toContain('take-2-wood')
    })

    test('4 player game has 6 additional actions', () => {
      const game = t.fixture({ numPlayers: 4 })
      game.run()

      // Should have all 3-player actions
      expect(game.state.activeActions).toContain('clay-pit')
      expect(game.state.activeActions).toContain('take-1-building-resource')

      // Should also have 4-5 player actions
      expect(game.state.activeActions).toContain('copse')
      expect(game.state.activeActions).toContain('take-2-wood')
    })

    test('5 player game has 6 additional actions', () => {
      const game = t.fixture({ numPlayers: 5 })
      game.run()

      // Should have all actions
      expect(game.state.activeActions).toContain('clay-pit')
      expect(game.state.activeActions).toContain('copse')
      expect(game.state.activeActions).toContain('take-2-wood')
      expect(game.state.activeActions).toContain('resource-market')
    })

    test('getAdditionalActionsForPlayerCount returns correct actions', () => {
      expect(res.getAdditionalActionsForPlayerCount(2)).toHaveLength(0)
      expect(res.getAdditionalActionsForPlayerCount(3)).toHaveLength(4)
      expect(res.getAdditionalActionsForPlayerCount(4)).toHaveLength(6)
      expect(res.getAdditionalActionsForPlayerCount(5)).toHaveLength(6)
    })

    test('clay-pit accumulates 2 clay per round', () => {
      const action = res.getActionById('clay-pit')
      expect(action.type).toBe('accumulating')
      expect(action.accumulates.clay).toBe(2)
    })

    test('copse accumulates 1 wood per round', () => {
      const action = res.getActionById('copse')
      expect(action.type).toBe('accumulating')
      expect(action.accumulates.wood).toBe(1)
    })

    test('resource-market allows choosing 2 different resources', () => {
      const action = res.getActionById('resource-market')
      expect(action.allowsResourceChoice).toEqual(['wood', 'clay', 'reed', 'stone'])
      expect(action.choiceCount).toBe(2)
      expect(action.choiceMustBeDifferent).toBe(true)
    })
  })

  describe('resources module', () => {
    test('constants are defined', () => {
      expect(res.constants.totalRounds).toBe(14)
      expect(res.constants.harvestRounds).toEqual([4, 7, 9, 11, 13, 14])
      expect(res.constants.maxFamilyMembers).toBe(5)
    })

    test('building costs are defined', () => {
      expect(res.buildingCosts.room.wood).toEqual({ wood: 5, reed: 2 })
      expect(res.buildingCosts.stable).toEqual({ wood: 2 })
    })

    test('major improvements are complete', () => {
      const improvements = res.getAllMajorImprovements()
      expect(improvements.length).toBe(10)
    })
  })
})
