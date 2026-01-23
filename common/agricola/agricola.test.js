const t = require('./testutil.js')


describe('Agricola', () => {

  describe('initialization', () => {
    test('game initializes with correct default state', () => {
      const game = t.fixture()
      game.run()

      expect(game.state.initializationComplete).toBe(true)
      expect(game.state.round).toBe(1)
    })

    test('players start with correct resources', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.food).toBe(0)
      expect(dennis.wood).toBe(0)
      expect(dennis.familyMembers).toBe(2)
      expect(dennis.rooms).toBe(2)
      expect(dennis.roomType).toBe('wood')
    })

    test('supports 2-4 players', () => {
      for (const numPlayers of [2, 3, 4]) {
        const game = t.fixture({ numPlayers })
        game.run()

        expect(game.players.all()).toHaveLength(numPlayers)
      }
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
          rooms: 3,
          roomType: 'clay',
          fields: 2,
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.familyMembers).toBe(4)
      expect(dennis.rooms).toBe(3)
      expect(dennis.roomType).toBe('clay')
      expect(dennis.fields).toBe(2)
    })
  })
})
