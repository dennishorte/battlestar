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
      dennis.setResource('wood', 5)
      dennis.removeResource('wood', 2)
      expect(dennis.wood).toBe(3)
    })

    test('removeResource does not go below zero', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.setResource('wood', 2)
      dennis.removeResource('wood', 5)
      expect(dennis.wood).toBe(0)
    })

    test('hasResource checks resource availability', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.setResource('wood', 3)

      expect(dennis.hasResource('wood', 2)).toBe(true)
      expect(dennis.hasResource('wood', 3)).toBe(true)
      expect(dennis.hasResource('wood', 4)).toBe(false)
    })

    test('canAffordCost checks multiple resources', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.setResource('wood', 5)
      dennis.setResource('reed', 2)

      expect(dennis.canAffordCost({ wood: 5, reed: 2 })).toBe(true)
      expect(dennis.canAffordCost({ wood: 6, reed: 2 })).toBe(false)
      expect(dennis.canAffordCost({ wood: 5, reed: 3 })).toBe(false)
    })

    test('payCost deducts resources', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.setResource('wood', 10)
      dennis.setResource('reed', 5)

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

      dennis.setResource('wood', 5)
      dennis.setResource('reed', 2)
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
      dennis.setResource('clay', 2)
      dennis.setResource('reed', 1)
      expect(dennis.canRenovate()).toBe(true)
    })

    test('renovate upgrades house type', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.setResource('clay', 2)
      dennis.setResource('reed', 1)

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
      dennis.setResource('clay', 2)
      dennis.setResource('reed', 1)
      expect(dennis.canRenovate()).toBe(true)
      expect(ActionChoicesMixin.checkActionPrerequisites.call(game, dennis, action)).toBe(true)
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
      expect(res.cardSets.minorA).toBeDefined()
      expect(res.cardSets.minorA.name).toBe('Minor Improvements A')
      expect(res.cardSets.occupationA).toBeDefined()
      expect(res.cardSets.occupationA.name).toBe('Occupations A')
    })

    test('getCardSetIds returns all set IDs', () => {
      expect(res.getCardSetIds()).toEqual(['minorA', 'minorB', 'minorC', 'minorD', 'minorE', 'occupationA', 'occupationB', 'occupationC', 'occupationD', 'occupationE'])
    })

    test('getCardsByPlayerCount filters by set', () => {
      const minorAOnly = res.getCardsByPlayerCount(2, ['minorA'])
      const occupationAOnly = res.getCardsByPlayerCount(2, ['occupationA'])
      const both = res.getCardsByPlayerCount(2, ['minorA', 'occupationA'])

      expect(both.length).toBe(minorAOnly.length + occupationAOnly.length)
    })

    test('getCardsBySet filters correctly', () => {
      const minorACards = res.getCardsBySet(['minorA'])
      expect(minorACards.length).toBeGreaterThan(0)
    })

    test('validateCardSets passes for valid configuration', () => {
      const result = res.validateCardSets(['occupationA', 'minorA', 'occupationB', 'minorB'], 3)
      expect(result.valid).toBe(true)
      expect(result.errors.length).toBe(0)
    })

    test('validateCardSets fails when not enough cards', () => {
      const result = res.validateCardSets(['minorA'], 5)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    test('validateCardSets passes for single set with few players', () => {
      const result = res.validateCardSets(['occupationA', 'minorA'], 2)
      expect(result.valid).toBe(true)
    })

    test('game uses selected card sets', () => {
      const game = t.fixture({ cardSets: ['occupationA', 'minorA'] })
      game.run()

      const dennis = t.player(game)
      expect(dennis.hand.length).toBe(14)
    })

    test('game defaults to all card sets', () => {
      const { AgricolaFactory } = require('./agricola.js')
      const game = AgricolaFactory({
        name: 'test',
        seed: 'test',
        numPlayers: 2,
        players: [{ _id: '1', name: 'a' }, { _id: '2', name: 'b' }],
      })
      expect(game.settings.cardSets).toEqual(['minorA', 'minorB', 'minorC', 'minorD', 'minorE', 'occupationA', 'occupationB', 'occupationC', 'occupationD', 'occupationE'])
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

})
