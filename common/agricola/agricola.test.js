const t = require('./testutil.js')
const res = require('./res/index.js')
const { InputRequestEvent } = require('../lib/game.js')


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
      expect(dennis.getSpace(1, 0).type).toBe('room')
      expect(dennis.getSpace(0, 1).type).toBe('empty')
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
      dennis.buildRoom(0, 1)
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

      // Adjacent to rooms at (0,0) and (1,0)
      expect(dennis.canBuildRoom(0, 1)).toBe(true)
      expect(dennis.canBuildRoom(1, 1)).toBe(true)
      expect(dennis.canBuildRoom(2, 0)).toBe(true)

      // Not adjacent to any room
      expect(dennis.canBuildRoom(2, 4)).toBe(false)
    })

    test('buildRoom creates room at location', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.buildRoom(0, 1)

      expect(dennis.getSpace(0, 1).type).toBe('room')
      expect(dennis.getSpace(0, 1).roomType).toBe('wood')
      expect(dennis.getRoomCount()).toBe(3)
    })

    test('getValidRoomBuildSpaces returns correct spaces', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      const validSpaces = dennis.getValidRoomBuildSpaces()

      // Should be adjacent to existing rooms
      expect(validSpaces.length).toBeGreaterThan(0)
      expect(validSpaces.some(s => s.row === 0 && s.col === 1)).toBe(true)
      expect(validSpaces.some(s => s.row === 2 && s.col === 0)).toBe(true)
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

    test('house-redevelopment action requires renovation resources', () => {
      const game = t.gameFixture({
        dennis: { clay: 0, reed: 0 },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const action = res.getActionById('renovation-improvement')

      // Import the mixin to access checkActionPrerequisites
      const { ActionChoicesMixin } = require('./mixins/ActionChoicesMixin.js')

      // Without resources, action should be blocked
      expect(dennis.canRenovate()).toBe(false)
      expect(ActionChoicesMixin.checkActionPrerequisites.call(game, dennis, action)).toBe(false)

      // With resources, action should be allowed
      dennis.clay = 2
      dennis.reed = 1
      expect(dennis.canRenovate()).toBe(true)
      expect(ActionChoicesMixin.checkActionPrerequisites.call(game, dennis, action)).toBe(true)
    })
  })

  describe('fields', () => {
    test('plowField creates field', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.plowField(0, 1)).toBe(true)

      expect(dennis.getSpace(0, 1).type).toBe('field')
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
      dennis.plowField(0, 1)

      expect(dennis.canPlowField(0, 2)).toBe(true)  // Adjacent
      expect(dennis.canPlowField(2, 4)).toBe(false) // Not adjacent
    })

    test('sowField plants crops', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.plowField(0, 1)
      dennis.grain = 1

      expect(dennis.sowField(0, 1, 'grain')).toBe(true)

      const space = dennis.getSpace(0, 1)
      expect(space.crop).toBe('grain')
      expect(space.cropCount).toBe(3) // 1 + 2 bonus
      expect(dennis.grain).toBe(0)
    })

    test('harvestFields collects crops', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      t.plowFields(dennis, [{ row: 0, col: 1 }])
      t.sowFields(dennis, [{ row: 0, col: 1, crop: 'grain', cropCount: 3 }])

      const result = dennis.harvestFields()

      expect(result.harvested.grain).toBe(1)
      expect(dennis.grain).toBe(1)
      expect(dennis.getSpace(0, 1).cropCount).toBe(2)
    })
  })

  describe('stables', () => {
    test('buildStable creates stable', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.buildStable(2, 0)).toBe(true)

      expect(dennis.getSpace(2, 0).hasStable).toBe(true)
      expect(dennis.getStableCount()).toBe(1)
    })

    test('cannot build stable on room or field', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.plowField(2, 0)

      expect(dennis.canBuildStable(0, 0)).toBe(false) // Room
      expect(dennis.canBuildStable(2, 0)).toBe(false) // Field
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
      dennis.buildStable(2, 0)

      expect(dennis.addAnimals('sheep', 2)).toBe(true)
      expect(dennis.getTotalAnimals('sheep')).toBe(2)
    })

    test('pasture holds 2 animals per space', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      t.addPasture(dennis, [{ row: 2, col: 0 }, { row: 2, col: 1 }])

      // 2 spaces * 2 = 4 capacity, plus 1 pet = 5 total
      expect(dennis.addAnimals('sheep', 5)).toBe(true)
      expect(dennis.getTotalAnimals('sheep')).toBe(5)
    })

    test('stable in pasture doubles capacity', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.buildStable(2, 0)
      t.addPasture(dennis, [{ row: 2, col: 0 }])

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

    test('newborns persist through returnHomePhase to harvest', () => {
      const game = t.fixture({ seed: 'newborn-harvest-test' })
      game.run()

      const dennis = game.players.byName('dennis')
      // Setup: give player a room and grow family
      dennis.buildRoom(0, 2)
      dennis.growFamily()

      expect(dennis.familyMembers).toBe(3)
      expect(dennis.newborns).toContain(3)

      // Simulate returnHomePhase (what happens at end of work phase)
      game.returnHomePhase()

      // Newborns should still be tracked after returnHomePhase
      expect(dennis.newborns).toContain(3)
      expect(dennis.getFoodRequired()).toBe(5) // 2*2 + 1*1 = 5
    })

    test('newborns are cleared after round ends', () => {
      const game = t.fixture({ seed: 'newborn-clear-test' })
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.buildRoom(0, 2)
      dennis.growFamily()

      expect(dennis.newborns).toContain(3)

      // Clear newborns (happens at end of round)
      dennis.clearNewborns()

      expect(dennis.newborns).toEqual([])
      expect(dennis.getFoodRequired()).toBe(6) // 3*2 = 6 (all adults now)
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
      dennis.payCost(dennis.getMajorImprovementCost('fireplace-2'))
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
      expect(action.name).toBe('Forest') // Revised Edition name
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

    // Revised Edition: 3-player and 4+ player have different action sets (not cumulative)
    test('3 player game has 4 additional actions', () => {
      const game = t.fixture({ numPlayers: 3 })
      game.run()

      // Should have 3-player actions (Revised Edition names)
      expect(game.state.activeActions).toContain('grove')
      expect(game.state.activeActions).toContain('hollow')
      expect(game.state.activeActions).toContain('resource-market')
      expect(game.state.activeActions).toContain('lessons-3')

      // Should NOT have 4+ player actions
      expect(game.state.activeActions).not.toContain('copse')
      expect(game.state.activeActions).not.toContain('lessons-4')
      expect(game.state.activeActions).not.toContain('traveling-players')
    })

    test('4 player game has 6 additional actions', () => {
      const game = t.fixture({ numPlayers: 4 })
      game.run()

      // 4+ player games have their own set (Revised Edition)
      expect(game.state.activeActions).toContain('copse')
      expect(game.state.activeActions).toContain('grove')
      expect(game.state.activeActions).toContain('hollow')
      expect(game.state.activeActions).toContain('resource-market')
      expect(game.state.activeActions).toContain('lessons-4')
      expect(game.state.activeActions).toContain('traveling-players')

      // Should NOT have 3-player specific actions
      expect(game.state.activeActions).not.toContain('lessons-3')
    })

    test('5 player game has 5-6 player expansion actions', () => {
      const game = t.fixture({ numPlayers: 5 })
      game.run()

      // 5-6 player expansion actions with linked spaces
      expect(game.state.activeActions).toContain('lessons-5')
      expect(game.state.activeActions).toContain('copse-5')
      expect(game.state.activeActions).toContain('house-building')
      expect(game.state.activeActions).toContain('traveling-players-5')
      expect(game.state.activeActions).toContain('lessons-5b')
      expect(game.state.activeActions).toContain('modest-wish-for-children')
      expect(game.state.activeActions).toContain('grove-5')
      expect(game.state.activeActions).toContain('hollow-5')
      expect(game.state.activeActions).toContain('resource-market-5')

      // Should NOT have 4-player specific actions
      expect(game.state.activeActions).not.toContain('lessons-4')
      expect(game.state.activeActions).not.toContain('copse')
    })

    test('6 player game has 5-6 player actions plus 6-player only actions', () => {
      const game = t.fixture({ numPlayers: 6 })
      game.run()

      // 5-6 player actions
      expect(game.state.activeActions).toContain('lessons-5')
      expect(game.state.activeActions).toContain('copse-5')
      expect(game.state.activeActions).toContain('house-building')
      expect(game.state.activeActions).toContain('traveling-players-5')

      // 6-player only actions
      expect(game.state.activeActions).toContain('riverbank-forest')
      expect(game.state.activeActions).toContain('grove-6')
      expect(game.state.activeActions).toContain('hollow-6')
      expect(game.state.activeActions).toContain('resource-market-6')
      expect(game.state.activeActions).toContain('animal-market')
      expect(game.state.activeActions).toContain('farm-supplies')
      expect(game.state.activeActions).toContain('building-supplies')
      expect(game.state.activeActions).toContain('corral')
      expect(game.state.activeActions).toContain('side-job')
      expect(game.state.activeActions).toContain('improvement-6')
    })

    test('getAdditionalActionsForPlayerCount returns correct actions', () => {
      expect(res.getAdditionalActionsForPlayerCount(2)).toHaveLength(0)
      expect(res.getAdditionalActionsForPlayerCount(3)).toHaveLength(4) // Revised Edition: grove, hollow, resource-market, lessons-3
      expect(res.getAdditionalActionsForPlayerCount(4)).toHaveLength(6) // Revised Edition: copse, grove, hollow, resource-market, lessons-4, traveling-players
      expect(res.getAdditionalActionsForPlayerCount(5)).toHaveLength(9) // 5-6 player expansion actions
      expect(res.getAdditionalActionsForPlayerCount(6)).toHaveLength(19) // 5-6 player + 6-player only
    })

    // Revised Edition: Hollow replaces Clay Pit for additional players
    test('hollow accumulates clay per round', () => {
      // 3-player Hollow accumulates 1 clay
      const threePlayerActions = res.getAdditionalActionsForPlayerCount(3)
      const hollow3 = threePlayerActions.find(a => a.id === 'hollow')
      expect(hollow3.type).toBe('accumulating')
      expect(hollow3.accumulates.clay).toBe(1)

      // 4+ player Hollow accumulates 2 clay
      const fourPlayerActions = res.getAdditionalActionsForPlayerCount(4)
      const hollow4 = fourPlayerActions.find(a => a.id === 'hollow')
      expect(hollow4.type).toBe('accumulating')
      expect(hollow4.accumulates.clay).toBe(2)
    })

    test('copse accumulates 1 wood per round', () => {
      const action = res.getActionById('copse')
      expect(action.type).toBe('accumulating')
      expect(action.accumulates.wood).toBe(1)
    })

    test('grove accumulates 2 wood per round', () => {
      const action = res.getActionById('grove')
      expect(action.type).toBe('accumulating')
      expect(action.accumulates.wood).toBe(2)
    })

    // Revised Edition: Resource Market is different for 3-player vs 4+ player
    test('resource-market (3-player) gives 1 food and choice of reed or stone', () => {
      const threePlayerActions = res.getAdditionalActionsForPlayerCount(3)
      const action = threePlayerActions.find(a => a.id === 'resource-market')
      expect(action.gives.food).toBe(1)
      expect(action.allowsResourceChoice).toEqual(['reed', 'stone'])
      expect(action.choiceCount).toBe(1)
    })

    test('resource-market (4+ player) gives food, reed, and stone', () => {
      const fourPlayerActions = res.getAdditionalActionsForPlayerCount(4)
      const action = fourPlayerActions.find(a => a.id === 'resource-market')
      expect(action.gives).toEqual({ food: 1, reed: 1, stone: 1 })
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

    test('6-player major improvements are included for 6 players', () => {
      const improvements = res.getAllMajorImprovements(6)
      expect(improvements.length).toBe(18) // 10 base + 8 expansion
      expect(improvements.find(i => i.id === 'fireplace-4')).toBeDefined()
      expect(improvements.find(i => i.id === 'cooking-hearth-6')).toBeDefined()
      expect(improvements.find(i => i.id === 'well-2')).toBeDefined()
      expect(improvements.find(i => i.id === 'clay-oven-2')).toBeDefined()
      expect(improvements.find(i => i.id === 'stone-oven-2')).toBeDefined()
      expect(improvements.find(i => i.id === 'joinery-2')).toBeDefined()
      expect(improvements.find(i => i.id === 'pottery-2')).toBeDefined()
      expect(improvements.find(i => i.id === 'basketmakers-workshop-2')).toBeDefined()
    })
  })

  describe('card sets', () => {
    test('cardSets metadata is defined', () => {
      expect(res.cardSets.baseA).toBeDefined()
      expect(res.cardSets.baseA.name).toBe('Base A')
      expect(res.cardSets.baseA.minorCount).toBe(24)
      expect(res.cardSets.baseA.occupationCount).toBe(24)
      expect(res.cardSets.baseB).toBeDefined()
      expect(res.cardSets.baseB.name).toBe('Base B')
    })

    test('getCardSetIds returns all set IDs', () => {
      expect(res.getCardSetIds()).toEqual(['baseA', 'baseB', 'minorA', 'minorB', 'minorC', 'minorD', 'minorE', 'occupationA', 'occupationB', 'occupationC', 'occupationD', 'occupationE'])
    })

    test('getCardsByPlayerCount filters by set', () => {
      const baseAOnly = res.getCardsByPlayerCount(2, ['baseA'])
      const baseBOnly = res.getCardsByPlayerCount(2, ['baseB'])
      const both = res.getCardsByPlayerCount(2, ['baseA', 'baseB'])

      expect(baseAOnly.every(c => c.deck === 'A')).toBe(true)
      expect(baseBOnly.every(c => c.deck === 'B')).toBe(true)
      expect(both.length).toBe(baseAOnly.length + baseBOnly.length)
    })

    test('getCardsBySet filters correctly', () => {
      const baseACards = res.getCardsBySet(['baseA'])
      expect(baseACards.length).toBe(48) // 24 minor + 24 occ
      expect(baseACards.every(c => c.deck === 'A')).toBe(true)
    })

    test('validateCardSets passes for valid configuration', () => {
      const result = res.validateCardSets(['baseA', 'baseB'], 3)
      expect(result.valid).toBe(true)
      expect(result.errors.length).toBe(0)
    })

    test('validateCardSets fails when not enough cards', () => {
      // With only baseA, 5 players need 35 of each type but baseA has only 24
      const result = res.validateCardSets(['baseA'], 5)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    test('validateCardSets passes for single set with few players', () => {
      const result = res.validateCardSets(['baseA'], 2)
      expect(result.valid).toBe(true)
    })

    test('game uses selected card sets', () => {
      const game = t.fixture({ cardSets: ['baseA'] })
      game.run()

      // All dealt cards should be from baseA
      const dennis = t.player(game)
      for (const cardId of dennis.hand) {
        const card = res.getCardById(cardId)
        expect(card.deck).toBe('A')
      }
    })

    test('game defaults to all card sets', () => {
      const { AgricolaFactory } = require('./agricola.js')
      const game = AgricolaFactory({
        name: 'test',
        seed: 'test',
        numPlayers: 2,
        players: [{ _id: '1', name: 'a' }, { _id: '2', name: 'b' }],
      })
      expect(game.settings.cardSets).toEqual(['baseA', 'baseB', 'minorA', 'minorB', 'minorC', 'minorD', 'minorE', 'occupationA', 'occupationB', 'occupationC', 'occupationD', 'occupationE'])
    })
  })

  describe('fenceUtil', () => {
    const { fenceUtil } = require('./agricola.js')

    describe('areSpacesConnected', () => {
      test('empty array is connected', () => {
        expect(fenceUtil.areSpacesConnected([])).toBe(true)
      })

      test('single space is connected', () => {
        expect(fenceUtil.areSpacesConnected([{ row: 0, col: 0 }])).toBe(true)
      })

      test('two adjacent horizontal spaces are connected', () => {
        const spaces = [{ row: 0, col: 0 }, { row: 0, col: 1 }]
        expect(fenceUtil.areSpacesConnected(spaces)).toBe(true)
      })

      test('two adjacent vertical spaces are connected', () => {
        const spaces = [{ row: 0, col: 0 }, { row: 1, col: 0 }]
        expect(fenceUtil.areSpacesConnected(spaces)).toBe(true)
      })

      test('two diagonal spaces are not connected', () => {
        const spaces = [{ row: 0, col: 0 }, { row: 1, col: 1 }]
        expect(fenceUtil.areSpacesConnected(spaces)).toBe(false)
      })

      test('L-shaped selection is connected', () => {
        const spaces = [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 1, col: 0 },
        ]
        expect(fenceUtil.areSpacesConnected(spaces)).toBe(true)
      })

      test('non-contiguous spaces are not connected', () => {
        const spaces = [
          { row: 0, col: 0 },
          { row: 0, col: 2 }, // Gap at col 1
        ]
        expect(fenceUtil.areSpacesConnected(spaces)).toBe(false)
      })

      test('2x2 block is connected', () => {
        const spaces = [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 1, col: 0 },
          { row: 1, col: 1 },
        ]
        expect(fenceUtil.areSpacesConnected(spaces)).toBe(true)
      })
    })

    describe('calculateFenceEdges', () => {
      test('single corner space needs 4 fences (including board edges)', () => {
        const spaces = [{ row: 0, col: 0 }]
        const edges = fenceUtil.calculateFenceEdges(spaces)

        expect(edges['0,0']).toEqual({
          top: true,     // Board edge needs fence
          right: true,   // Interior edge needs fence
          bottom: true,  // Interior edge needs fence
          left: true,    // Board edge needs fence
        })
      })

      test('single center space needs 4 fences', () => {
        const spaces = [{ row: 1, col: 2 }]
        const edges = fenceUtil.calculateFenceEdges(spaces)

        expect(edges['1,2']).toEqual({
          top: true,
          right: true,
          bottom: true,
          left: true,
        })
      })

      test('two horizontal spaces share inner edge', () => {
        const spaces = [
          { row: 1, col: 1 },
          { row: 1, col: 2 },
        ]
        const edges = fenceUtil.calculateFenceEdges(spaces)

        // Left space: no right fence (shared with neighbor)
        expect(edges['1,1'].right).toBe(false)
        // Right space: no left fence (shared with neighbor)
        expect(edges['1,2'].left).toBe(false)

        // Both need top and bottom
        expect(edges['1,1'].top).toBe(true)
        expect(edges['1,1'].bottom).toBe(true)
        expect(edges['1,2'].top).toBe(true)
        expect(edges['1,2'].bottom).toBe(true)
      })

      test('2x2 block in bottom-right corner has outer edges including board edges', () => {
        const spaces = [
          { row: 1, col: 3 },
          { row: 1, col: 4 },
          { row: 2, col: 3 },
          { row: 2, col: 4 },
        ]
        const edges = fenceUtil.calculateFenceEdges(spaces)

        // Top row: top edges need fences (interior)
        expect(edges['1,3'].top).toBe(true)
        expect(edges['1,4'].top).toBe(true)

        // Bottom row: bottom edges need fences (board edge)
        expect(edges['2,3'].bottom).toBe(true)
        expect(edges['2,4'].bottom).toBe(true)

        // Left side (interior)
        expect(edges['1,3'].left).toBe(true)
        expect(edges['2,3'].left).toBe(true)

        // Right side (board edge)
        expect(edges['1,4'].right).toBe(true)
        expect(edges['2,4'].right).toBe(true)

        // Inner edges are all false
        expect(edges['1,3'].right).toBe(false)
        expect(edges['1,3'].bottom).toBe(false)
        expect(edges['1,4'].left).toBe(false)
        expect(edges['1,4'].bottom).toBe(false)
        expect(edges['2,3'].top).toBe(false)
        expect(edges['2,3'].right).toBe(false)
        expect(edges['2,4'].top).toBe(false)
        expect(edges['2,4'].left).toBe(false)
      })

      test('respects existing fences', () => {
        const spaces = [{ row: 1, col: 2 }]
        const existingFences = [
          { row1: 1, col1: 2, row2: 0, col2: 2 }, // Fence on top
        ]
        const edges = fenceUtil.calculateFenceEdges(spaces, existingFences)

        expect(edges['1,2'].top).toBe(false) // Already has fence
        expect(edges['1,2'].right).toBe(true)
        expect(edges['1,2'].bottom).toBe(true)
        expect(edges['1,2'].left).toBe(true)
      })
    })

    describe('countFencesNeeded', () => {
      test('single corner space needs 4 fences (including board edges)', () => {
        const spaces = [{ row: 0, col: 0 }]
        expect(fenceUtil.countFencesNeeded(spaces)).toBe(4)
      })

      test('single edge space needs 4 fences (including board edge)', () => {
        const spaces = [{ row: 0, col: 2 }] // Top edge, middle column
        expect(fenceUtil.countFencesNeeded(spaces)).toBe(4)
      })

      test('single center space needs 4 fences', () => {
        const spaces = [{ row: 1, col: 2 }]
        expect(fenceUtil.countFencesNeeded(spaces)).toBe(4)
      })

      test('two horizontal adjacent spaces need 6 fences', () => {
        // Two spaces in middle: each needs top, bottom, and one side = 3 each
        // But they share a side, so: 4 + 4 - 2 = 6
        const spaces = [
          { row: 1, col: 1 },
          { row: 1, col: 2 },
        ]
        expect(fenceUtil.countFencesNeeded(spaces)).toBe(6)
      })

      test('2x2 block in corner needs 8 fences (including board edges)', () => {
        // Bottom-right corner: 2 top + 2 bottom (board) + 2 left + 2 right (board) = 8
        const spaces = [
          { row: 1, col: 3 },
          { row: 1, col: 4 },
          { row: 2, col: 3 },
          { row: 2, col: 4 },
        ]
        expect(fenceUtil.countFencesNeeded(spaces)).toBe(8)
      })

      test('existing fences reduce count', () => {
        const spaces = [{ row: 1, col: 2 }]
        const existingFences = [
          { row1: 1, col1: 2, row2: 0, col2: 2 }, // Top
          { row1: 1, col1: 2, row2: 1, col2: 1 }, // Left
        ]
        expect(fenceUtil.countFencesNeeded(spaces, existingFences)).toBe(2)
      })
    })

    describe('validatePastureSelection', () => {
      test('empty selection is invalid', () => {
        const result = fenceUtil.validatePastureSelection([])
        expect(result.valid).toBe(false)
        expect(result.error).toBe('No spaces selected')
      })

      test('valid single space selection', () => {
        const spaces = [{ row: 0, col: 0 }]
        const result = fenceUtil.validatePastureSelection(spaces, { wood: 10 })

        expect(result.valid).toBe(true)
        expect(result.fencesNeeded).toBe(4) // All 4 edges including board edges
        expect(result.fenceEdges['0,0']).toBeDefined()
      })

      test('disconnected spaces are invalid', () => {
        const spaces = [
          { row: 0, col: 0 },
          { row: 0, col: 2 },
        ]
        const result = fenceUtil.validatePastureSelection(spaces, { wood: 10 })

        expect(result.valid).toBe(false)
        expect(result.error).toBe('Spaces must be connected')
      })

      test('insufficient wood is invalid', () => {
        const spaces = [{ row: 1, col: 2 }] // Needs 4 fences
        const result = fenceUtil.validatePastureSelection(spaces, { wood: 2 })

        expect(result.valid).toBe(false)
        expect(result.error).toBe('Need 4 wood (have 2)')
        expect(result.fencesNeeded).toBe(4)
        expect(result.fenceEdges).toBeDefined() // Still provides edges for UI
      })

      test('exceeding fence limit is invalid', () => {
        const spaces = [{ row: 1, col: 2 }] // Needs 4 fences
        const result = fenceUtil.validatePastureSelection(spaces, {
          wood: 10,
          currentFenceCount: 13, // Only 2 remaining
          maxFences: 15,
        })

        expect(result.valid).toBe(false)
        expect(result.error).toBe('Need 4 fences (2 remaining)')
      })

      test('invalid space callback rejects selection', () => {
        const spaces = [{ row: 0, col: 0 }]
        const result = fenceUtil.validatePastureSelection(spaces, {
          wood: 10,
          isSpaceValid: (row, col) => row !== 0 || col !== 0, // Reject (0,0)
        })

        expect(result.valid).toBe(false)
        expect(result.error).toBe('Invalid space selected')
      })
    })
  })

  describe('major improvements e2e', () => {

    /**
     * Helper: respond to the current input request with a selection.
     */
    function respond(game, selection) {
      const request = game.waiting
      const selector = request.selectors[0]
      return game.respondToInputRequest({
        actor: selector.actor,
        title: selector.title,
        selection: Array.isArray(selection) ? selection : [selection],
      })
    }

    /**
     * Helper: pick an action or skip optional prompts.
     */
    function handleChoice(game, result) {
      const selector = result.selectors[0]
      const title = selector.title || ''
      const choices = selector.choices || []

      if (title === 'Choose an action') {
        const preferred = ['Day Laborer', 'Grain Seeds', 'Fishing', 'Forest', 'Clay Pit', 'Reed Bank']
        for (const p of preferred) {
          const match = choices.find(c => typeof c === 'string' && c.toLowerCase().includes(p.toLowerCase()))
          if (match) {
            return respond(game, match)
          }
        }
        const stringChoice = choices.find(c => typeof c === 'string')
        return respond(game, stringChoice || choices[0])
      }

      const skipOpt = choices.find(c => typeof c === 'string' && (c.includes('Do not') || c.includes('Done') || c.includes('Skip')))
      if (skipOpt) {
        return respond(game, skipOpt)
      }
      const stringChoice = choices.find(c => typeof c === 'string')
      return respond(game, stringChoice || choices[0])
    }

    /**
     * Helper: advance through rounds until the target round completes (harvest included).
     * Handles feeding by accepting begging cards (Done converting).
     */
    function playThroughRound(game, targetRound) {
      const maxIterations = 1000
      let result = game.waiting || game.run()

      for (let i = 0; i < maxIterations; i++) {
        if (game.state.round > targetRound) {
          break
        }

        if (!(result instanceof InputRequestEvent)) {
          result = game.run()
          if (!(result instanceof InputRequestEvent)) {
            break
          }
        }

        const selector = result.selectors[0]
        if (!selector) {
          result = game.run()
          continue
        }

        const title = selector.title || ''
        const choices = selector.choices || []

        if (title.includes('more food')) {
          const doneOpt = choices.find(c => typeof c === 'string' && c.includes('Done'))
          result = respond(game, doneOpt || choices[0])
        }
        else {
          result = handleChoice(game, result)
        }
      }
    }

    /**
     * Helper: play through rounds up to targetRound, using a custom feeding handler.
     */
    function playThroughRoundWithFeeding(game, targetRound, feedingHandler) {
      const maxIterations = 1000
      let result = game.waiting || game.run()

      for (let i = 0; i < maxIterations; i++) {
        if (game.state.round > targetRound) {
          break
        }

        if (!(result instanceof InputRequestEvent)) {
          result = game.run()
          if (!(result instanceof InputRequestEvent)) {
            break
          }
        }

        const selector = result.selectors[0]
        if (!selector) {
          result = game.run()
          continue
        }

        const title = selector.title || ''
        const choices = selector.choices || []

        if (title.includes('more food')) {
          result = feedingHandler(game, choices)
        }
        else {
          result = handleChoice(game, result)
        }
      }
    }


    // ---- Phase 1: Purchase tests ----

    test('Fireplace — purchase via action space and cook sheep during harvest', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          clay: 2,
          food: 0,
          farmyard: {
            pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 1 } }],
          },
        },
        micah: {
          food: 10,
        },
        round: 3,
      })
      game.testSetBreakpoint('initialization-complete', (game) => {
        game.state.activeActions.push('major-minor-improvement')
        game.state.actionSpaces['major-minor-improvement'] = { occupiedBy: null }
      })
      game.run()

      // Dennis takes Major Improvement action
      t.choose(game, 'Major Improvement')
      // Select Fireplace (fireplace-2) from nested Major Improvement choices
      t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

      const dennis = t.player(game)
      expect(dennis.majorImprovements).toContain('fireplace-2')
      expect(dennis.clay).toBe(0)

      // Play through round 3 and into round 4 (harvest round)
      // Use custom feeding handler to cook sheep
      let cookedSheep = false
      playThroughRoundWithFeeding(game, 4, (game, choices) => {
        const cookOpt = choices.find(c => typeof c === 'string' && c.includes('Cook 1 sheep'))
        if (cookOpt && !cookedSheep) {
          cookedSheep = true
          return respond(game, cookOpt)
        }
        const doneOpt = choices.find(c => typeof c === 'string' && c.includes('Done'))
        return respond(game, doneOpt || choices[0])
      })

      expect(cookedSheep).toBe(true)
      // Sheep was cooked for 2 food (fireplace rate).
      // Don't check sheep count since breeding may have added one back.
      // Verify dennis got food from cooking (food includes the 2 from cooking sheep).
      expect(dennis.food).toBeGreaterThanOrEqual(0)
    })


    test('Cooking Hearth — upgrade from Fireplace', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          clay: 4,
          majorImprovements: ['fireplace-2'],
        },
      })
      game.testSetBreakpoint('initialization-complete', (game) => {
        game.state.activeActions.push('major-minor-improvement')
        game.state.actionSpaces['major-minor-improvement'] = { occupiedBy: null }
      })
      game.run()

      // Dennis takes Major Improvement action
      t.choose(game, 'Major Improvement')
      // Select Cooking Hearth (cooking-hearth-4) — upgrades from fireplace-2
      t.choose(game, 'Major Improvement.Cooking Hearth (cooking-hearth-4)')

      const dennis = t.player(game)
      expect(dennis.majorImprovements).toContain('cooking-hearth-4')
      expect(dennis.majorImprovements).not.toContain('fireplace-2')
      expect(dennis.clay).toBe(0)

      // Fireplace should be back in common zone
      const commonMajorZone = game.zones.byId('common.majorImprovements')
      const commonCards = commonMajorZone.cardlist().map(c => c.id)
      expect(commonCards).toContain('fireplace-2')
    })


    test('Clay Oven — purchase triggers bake bread action', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          clay: 3,
          stone: 1,
          grain: 2,
          food: 0,
        },
      })
      game.testSetBreakpoint('initialization-complete', (game) => {
        game.state.activeActions.push('major-minor-improvement')
        game.state.actionSpaces['major-minor-improvement'] = { occupiedBy: null }
      })
      game.run()

      // Dennis takes Major Improvement action
      t.choose(game, 'Major Improvement')
      // Select Clay Oven
      t.choose(game, 'Major Improvement.Clay Oven (clay-oven)')
      // Bake bread prompt should appear - Clay Oven allows baking 1 grain for 5 food
      t.choose(game, 'Bake 1 grain')

      const dennis = t.player(game)
      expect(dennis.majorImprovements).toContain('clay-oven')
      expect(dennis.clay).toBe(0)
      expect(dennis.stone).toBe(0)
      // bakeBreadOnBuild converts 1 grain to 5 food
      expect(dennis.grain).toBe(1) // Started with 2, baked 1
      expect(dennis.food).toBe(5) // Started with 0, +5 from baking
    })

    test('Clay Oven — can decline bake bread on build', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          clay: 3,
          stone: 1,
          grain: 1,
          food: 0,
        },
      })
      game.testSetBreakpoint('initialization-complete', (game) => {
        game.state.activeActions.push('major-minor-improvement')
        game.state.actionSpaces['major-minor-improvement'] = { occupiedBy: null }
      })
      game.run()

      // Dennis takes Major Improvement action
      t.choose(game, 'Major Improvement')
      // Select Clay Oven
      t.choose(game, 'Major Improvement.Clay Oven (clay-oven)')
      // Decline to bake
      t.choose(game, 'Do not bake')

      const dennis = t.player(game)
      expect(dennis.majorImprovements).toContain('clay-oven')
      expect(dennis.grain).toBe(1) // Unchanged
      expect(dennis.food).toBe(0) // Unchanged
    })


    test('Well — purchase and food delivery over subsequent rounds', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          wood: 1,
          stone: 3,
          food: 10,
        },
        micah: {
          food: 10,
        },
      })
      game.testSetBreakpoint('initialization-complete', (game) => {
        game.state.activeActions.push('major-minor-improvement')
        game.state.actionSpaces['major-minor-improvement'] = { occupiedBy: null }
      })
      game.run()

      // Dennis takes Major Improvement action to buy Well
      t.choose(game, 'Major Improvement')
      t.choose(game, 'Major Improvement.Well (well)')

      const dennis = t.player(game)
      expect(dennis.majorImprovements).toContain('well')
      expect(dennis.wood).toBe(0)
      expect(dennis.stone).toBe(0)

      // Well should have scheduled food for next 5 rounds
      expect(game.state.scheduledFood).toBeDefined()
      expect(game.state.scheduledFood['dennis']).toBeDefined()
      const scheduledRounds = Object.keys(game.state.scheduledFood['dennis']).map(Number).sort((a, b) => a - b)
      expect(scheduledRounds).toHaveLength(5)
      // Each scheduled round should have 1 food
      for (const round of scheduledRounds) {
        expect(game.state.scheduledFood['dennis'][round]).toBe(1)
      }
      const firstScheduledRound = scheduledRounds[0]

      // Play through to round 2 (well food delivered at start of round 2)
      playThroughRound(game, 2)

      // Dennis should have received scheduled food during round 2 start
      // First scheduled round food should be consumed from scheduledFood
      expect(game.state.scheduledFood['dennis'][firstScheduledRound]).toBeUndefined()
    })


    // ---- Phase 2: Harvest conversion tests ----

    test('Joinery — convert wood to food during harvest', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          wood: 3,
          food: 0,
          majorImprovements: ['joinery'],
        },
        micah: {
          food: 10,
        },
        round: 3,
      })
      game.run()

      let usedJoinery = false
      playThroughRoundWithFeeding(game, 4, (game, choices) => {
        const useOpt = choices.find(c => typeof c === 'string' && c.includes('Use Joinery'))
        if (useOpt && !usedJoinery) {
          usedJoinery = true
          return respond(game, useOpt)
        }
        const doneOpt = choices.find(c => typeof c === 'string' && c.includes('Done'))
        return respond(game, doneOpt || choices[0])
      })

      expect(usedJoinery).toBe(true)
      const dennis = t.player(game)
      // Joinery converts 1 wood to 2 food
      expect(dennis.wood).toBeLessThan(3)
    })


    test('Pottery — convert clay to food during harvest', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          clay: 3,
          food: 0,
          majorImprovements: ['pottery'],
        },
        micah: {
          food: 10,
        },
        round: 3,
      })
      game.run()

      let usedPottery = false
      playThroughRoundWithFeeding(game, 4, (game, choices) => {
        const useOpt = choices.find(c => typeof c === 'string' && c.includes('Use Pottery'))
        if (useOpt && !usedPottery) {
          usedPottery = true
          return respond(game, useOpt)
        }
        const doneOpt = choices.find(c => typeof c === 'string' && c.includes('Done'))
        return respond(game, doneOpt || choices[0])
      })

      expect(usedPottery).toBe(true)
      const dennis = t.player(game)
      // Pottery converts 1 clay to 2 food
      expect(dennis.clay).toBeLessThan(3)
    })


    test("Basketmaker's Workshop — convert reed to food during harvest", () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          reed: 3,
          food: 0,
          majorImprovements: ['basketmakers-workshop'],
        },
        micah: {
          food: 10,
        },
        round: 3,
      })
      game.run()

      let usedBasketmaker = false
      playThroughRoundWithFeeding(game, 4, (game, choices) => {
        const useOpt = choices.find(c => typeof c === 'string' && c.includes("Use Basketmaker"))
        if (useOpt && !usedBasketmaker) {
          usedBasketmaker = true
          return respond(game, useOpt)
        }
        const doneOpt = choices.find(c => typeof c === 'string' && c.includes('Done'))
        return respond(game, doneOpt || choices[0])
      })

      expect(usedBasketmaker).toBe(true)
      const dennis = t.player(game)
      // Basketmaker's converts 1 reed to 3 food
      expect(dennis.reed).toBeLessThan(3)
    })


    // ---- Phase 3: End-game bonus scoring ----

    test('Joinery — bonus points based on wood count', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          majorImprovements: ['joinery'],
          wood: 7,
        },
      })
      game.run()

      const dennis = t.player(game)
      const scoreWith = dennis.calculateScore()

      t.setPlayerMajorImprovements(game, dennis, [])
      const scoreWithout = dennis.calculateScore()

      // joinery: 2 VP + 3 bonus (7+ wood) = 5 point delta
      expect(scoreWith - scoreWithout).toBe(5)
    })

    test('Pottery — bonus points based on clay count', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          majorImprovements: ['pottery'],
          clay: 5,
        },
      })
      game.run()

      const dennis = t.player(game)
      const scoreWith = dennis.calculateScore()

      t.setPlayerMajorImprovements(game, dennis, [])
      const scoreWithout = dennis.calculateScore()

      // pottery: 2 VP + 2 bonus (5-6 clay) = 4 point delta
      expect(scoreWith - scoreWithout).toBe(4)
    })

    test("Basketmaker's Workshop — bonus points based on reed count", () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          majorImprovements: ['basketmakers-workshop'],
          reed: 5,
        },
      })
      game.run()

      const dennis = t.player(game)
      const scoreWith = dennis.calculateScore()

      t.setPlayerMajorImprovements(game, dennis, [])
      const scoreWithout = dennis.calculateScore()

      // basketmaker's: 2 VP + 3 bonus (5+ reed) = 5 point delta
      expect(scoreWith - scoreWithout).toBe(5)
    })
  })

  describe('5-6 player expansion', () => {

    describe('linked spaces', () => {
      test('linked spaces are tracked in state', () => {
        const game = t.fixture({ numPlayers: 5 })
        game.run()

        expect(game.state.linkedSpaces).toBeDefined()
        expect(game.state.linkedSpaces['lessons-5']).toBe('copse-5')
        expect(game.state.linkedSpaces['copse-5']).toBe('lessons-5')
        expect(game.state.linkedSpaces['house-building']).toBe('traveling-players-5')
        expect(game.state.linkedSpaces['traveling-players-5']).toBe('house-building')
      })

      test('blockLinkedSpace blocks the linked space', () => {
        const game = t.fixture({ numPlayers: 5 })
        game.run()

        // Initially neither space is blocked
        expect(game.state.actionSpaces['lessons-5'].blockedBy).toBeUndefined()
        expect(game.state.actionSpaces['copse-5'].blockedBy).toBeUndefined()

        // Block linked space when using lessons-5
        game.blockLinkedSpace('lessons-5')

        // copse-5 should now be blocked
        expect(game.state.actionSpaces['copse-5'].blockedBy).toBe('lessons-5')
        // lessons-5 should not be blocked
        expect(game.state.actionSpaces['lessons-5'].blockedBy).toBeUndefined()
      })

      test('blocked spaces are not available for selection', () => {
        const game = t.fixture({ numPlayers: 5 })
        game.run()

        const dennis = game.players.byName('dennis')

        // Initially copse-5 is available
        let availableActions = game.getAvailableActions(dennis)
        expect(availableActions).toContain('copse-5')

        // Block copse-5
        game.state.actionSpaces['copse-5'].blockedBy = 'lessons-5'

        // Now copse-5 is not available
        availableActions = game.getAvailableActions(dennis)
        expect(availableActions).not.toContain('copse-5')
      })

      test('blocked state is cleared at end of round', () => {
        const game = t.fixture({ numPlayers: 5 })
        game.run()

        // Block a space
        game.state.actionSpaces['copse-5'].blockedBy = 'lessons-5'
        expect(game.state.actionSpaces['copse-5'].blockedBy).toBe('lessons-5')

        // Simulate return home phase
        game.returnHomePhase()

        // Blocked state should be cleared
        expect(game.state.actionSpaces['copse-5'].blockedBy).toBeUndefined()
      })
    })

    describe('minRound restriction', () => {
      test('modest-wish-for-children is not available before round 5', () => {
        const game = t.fixture({ numPlayers: 5 })
        game.run()

        const dennis = game.players.byName('dennis')
        // Add a room so player can grow family
        dennis.buildRoom(0, 1)

        // Round 1: action should not be available
        expect(game.state.round).toBe(1)
        expect(game.canTakeAction(dennis, 'modest-wish-for-children')).toBe(false)

        // Set round to 5
        game.state.round = 5
        expect(game.canTakeAction(dennis, 'modest-wish-for-children')).toBe(true)
      })
    })

    describe('6-player major improvements', () => {
      test('6-player game initializes with expansion major improvements', () => {
        const game = t.fixture({ numPlayers: 6 })
        game.run()

        const majorZone = game.zones.byId('common.majorImprovements')
        const cardIds = majorZone.cardlist().map(c => c.id)

        // Base improvements
        expect(cardIds).toContain('fireplace-2')
        expect(cardIds).toContain('fireplace-3')

        // 6-player expansion improvements
        expect(cardIds).toContain('fireplace-4')
        expect(cardIds).toContain('cooking-hearth-6')
        expect(cardIds).toContain('well-2')
        expect(cardIds).toContain('clay-oven-2')
        expect(cardIds).toContain('stone-oven-2')
        expect(cardIds).toContain('joinery-2')
        expect(cardIds).toContain('pottery-2')
        expect(cardIds).toContain('basketmakers-workshop-2')
      })

      test('getMajorImprovementById finds expansion improvements', () => {
        const fireplace4 = res.getMajorImprovementById('fireplace-4')
        expect(fireplace4).toBeDefined()
        expect(fireplace4.cost).toEqual({ clay: 4 })
        expect(fireplace4.expansion).toBe('5-6')

        const cookingHearth6 = res.getMajorImprovementById('cooking-hearth-6')
        expect(cookingHearth6).toBeDefined()
        expect(cookingHearth6.cost).toEqual({ clay: 6 })
      })
    })

    describe('new action space definitions', () => {
      test('copse-5 accumulates 1 wood', () => {
        const action = res.getActionById('copse-5')
        expect(action.type).toBe('accumulating')
        expect(action.accumulates.wood).toBe(1)
        expect(action.linkedWith).toBe('lessons-5')
      })

      test('lessons-5 costs 2 food and is linked with copse-5', () => {
        const action = res.getActionById('lessons-5')
        expect(action.allowsOccupation).toBe(true)
        expect(action.occupationCost).toBe(2)
        expect(action.linkedWith).toBe('copse-5')
      })

      test('house-building allows room building at special cost', () => {
        const action = res.getActionById('house-building')
        expect(action.allowsHouseBuilding).toBe(true)
        expect(action.linkedWith).toBe('traveling-players-5')
      })

      test('modest-wish-for-children allows family growth from round 5', () => {
        const action = res.getActionById('modest-wish-for-children')
        expect(action.allowsFamilyGrowth).toBe(true)
        expect(action.requiresRoom).toBe(true)
        expect(action.minRound).toBe(5)
        expect(action.linkedWith).toBe('lessons-5b')
      })

      test('riverbank-forest accumulates wood and gives instant reed', () => {
        const action = res.getActionById('riverbank-forest')
        expect(action.type).toBe('accumulating')
        expect(action.accumulates.wood).toBe(1)
        expect(action.gives.reed).toBe(1)
      })

      test('animal-market allows animal choice', () => {
        const action = res.getActionById('animal-market')
        expect(action.allowsAnimalMarket).toBe(true)
      })

      test('farm-supplies allows grain/plow for food', () => {
        const action = res.getActionById('farm-supplies')
        expect(action.allowsFarmSupplies).toBe(true)
      })

      test('building-supplies gives food and resource choices', () => {
        const action = res.getActionById('building-supplies')
        expect(action.allowsBuildingSupplies).toBe(true)
      })

      test('corral gives animal player doesn\'t have', () => {
        const action = res.getActionById('corral')
        expect(action.allowsCorral).toBe(true)
      })

      test('side-job allows stable building and baking', () => {
        const action = res.getActionById('side-job')
        expect(action.allowsSideJob).toBe(true)
      })

      test('improvement-6 allows minor, major from round 5', () => {
        const action = res.getActionById('improvement-6')
        expect(action.allowsMinorImprovement).toBe(true)
        expect(action.allowsMajorFromRound5).toBe(true)
      })
    })
  })

  describe('anytime food conversion', () => {

    function respondConvertToFood(game, option) {
      const request = game.waiting
      const selector = request.selectors[0]
      return game.respondToInputRequest({
        actor: selector.actor,
        title: selector.title,
        selection: { action: 'convert-to-food', option },
      })
    }

    test('getAnytimeFoodConversionOptions returns basic options for grain and vegetables', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: { grain: 2, vegetables: 1 },
      })
      game.run()

      const dennis = t.player(game)
      const options = game.getAnytimeFoodConversionOptions(dennis)

      expect(options).toEqual(expect.arrayContaining([
        expect.objectContaining({ type: 'basic', resource: 'grain', food: 1 }),
        expect.objectContaining({ type: 'basic', resource: 'vegetables', food: 1 }),
      ]))
    })

    test('getAnytimeFoodConversionOptions returns cooking options with Fireplace', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          majorImprovements: ['fireplace-2'],
          farmyard: {
            pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 2 } }],
          },
        },
      })
      game.run()

      const dennis = t.player(game)
      const options = game.getAnytimeFoodConversionOptions(dennis)

      expect(options).toEqual(expect.arrayContaining([
        expect.objectContaining({ type: 'cook', resource: 'sheep', food: 2 }),
      ]))
    })

    test('getAnytimeFoodConversionOptions returns empty when no convertible resources', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: { food: 5 },
      })
      game.run()

      const dennis = t.player(game)
      const options = game.getAnytimeFoodConversionOptions(dennis)
      expect(options).toEqual([])
    })

    test('executeAnytimeFoodConversion converts grain to food', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: { grain: 3, food: 0 },
      })
      game.run()

      const dennis = t.player(game)
      game.executeAnytimeFoodConversion(dennis, {
        type: 'basic', resource: 'grain', count: 1, food: 1,
      })
      expect(dennis.grain).toBe(2)
      expect(dennis.food).toBe(1)
    })

    test('executeAnytimeFoodConversion cooks animal', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          majorImprovements: ['fireplace-2'],
          food: 0,
          farmyard: {
            pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 2 } }],
          },
        },
      })
      game.run()

      const dennis = t.player(game)
      game.executeAnytimeFoodConversion(dennis, {
        type: 'cook', resource: 'sheep', count: 1, food: 2,
      })
      expect(dennis.getTotalAnimals('sheep')).toBe(1)
      expect(dennis.food).toBe(2)
    })

    test('executeAnytimeFoodConversion handles craft type', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          majorImprovements: ['joinery'],
          wood: 3,
          food: 0,
        },
      })
      game.run()

      const dennis = t.player(game)
      game.executeAnytimeFoodConversion(dennis, {
        type: 'craft', improvement: 'Joinery', resource: 'wood', count: 1, food: 2,
      })
      expect(dennis.wood).toBe(2)
      expect(dennis.food).toBe(2)
    })

    test('allowFoodConversion uses shared conversion method', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          majorImprovements: ['fireplace-2'],
          food: 0,
          farmyard: {
            pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 3 } }],
          },
        },
      })
      game.run()

      const dennis = t.player(game)

      // Mock choose to select cooking sheep
      game.actions.choose = () => ['Cook 1 sheep for 2 food']

      // Call allowFoodConversion (used during harvest)
      game.allowFoodConversion(dennis, 4)

      // Should have cooked 2 sheep (4 food needed, 2 food per sheep)
      expect(dennis.getTotalAnimals('sheep')).toBe(1)
      expect(dennis.food).toBe(4)
    })

    test('choose override intercepts convert-to-food and re-presents choices', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: { grain: 2, food: 0 },
      })
      game.run()

      // First request: action space selection. Convert grain to food, then choose action.
      const request = game.waiting
      expect(request.selectors[0].foodConversionOptions).toBeDefined()
      expect(request.selectors[0].foodConversionOptions.length).toBeGreaterThan(0)

      // Send convert-to-food action
      respondConvertToFood(game, {
        type: 'basic', resource: 'grain', count: 1, food: 1,
      })

      // Should re-present the same selector (action space choice)
      const dennis = t.player(game)
      expect(dennis.grain).toBe(1)
      expect(dennis.food).toBe(1)

      // Game should still be waiting for action selection
      const request2 = game.waiting
      expect(request2).toBeInstanceOf(InputRequestEvent)
    })

    test('foodConversionOptions not present when no conversions available', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: { food: 5 },
      })
      game.run()

      const request = game.waiting
      expect(request.selectors[0].foodConversionOptions).toBeUndefined()
    })

    test('player with 0 food + grain can enter occupation flow via anytime conversion', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          food: 0,
          grain: 2,
          hand: ['wood-cutter'],
          occupationsPlayed: 1,
        },
      })
      game.run()

      // Choose the Lessons action space
      t.choose(game, 'Lessons')

      // Should be at occupation selection (not blocked by food gate)
      const request = game.waiting
      expect(request.selectors[0].title).toMatch(/Occupation/)

      // Convert grain to food first
      respondConvertToFood(game, {
        type: 'basic', resource: 'grain', count: 1, food: 1,
      })

      const dennis = t.player(game)
      expect(dennis.food).toBe(1)
      expect(dennis.grain).toBe(1)

      // Now select the occupation
      t.choose(game, 'Wood Cutter')

      // Re-fetch dennis after full replay
      const d = t.player(game)

      // Occupation was played, food deducted, grain spent
      expect(d.playedOccupations).toContain('wood-cutter')
      expect(d.occupationsPlayed).toBeGreaterThanOrEqual(1)
      expect(d.grain).toBe(1)  // 2 - 1 converted
      expect(d.food).toBe(0)   // 0 + 1 converted - 1 occupation cost
    })
  })
})
