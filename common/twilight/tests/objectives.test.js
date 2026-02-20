const t = require('../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Objectives', () => {
  describe('Victory Points', () => {
    test('player starts with 0 VP', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.getVictoryPoints()).toBe(0)
    })

    test('VP from Mecatol Rex custodians', () => {
      // Tested in invasion.test.js — custodians removal gives 1 VP
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      // No Mecatol control, 0 VP
      expect(dennis.getVictoryPoints()).toBe(0)
    })

    test('VP from Imperial strategy card', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'imperial', 'leadership')

      // Micah (leadership=1) goes first
      t.choose(game, 'Strategic Action')  // micah: leadership
      t.choose(game, 'Pass')  // dennis declines leadership secondary
      // Dennis uses imperial
      t.choose(game, 'Strategic Action')  // dennis: imperial
      t.choose(game, 'Pass')  // micah declines imperial secondary

      const dennis = game.players.byName('dennis')
      expect(dennis.getVictoryPoints()).toBe(1)
    })

    test('VP accumulates from multiple sources', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          victoryPoints: 3,
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'imperial', 'leadership')

      // Micah (leadership=1) goes first
      t.choose(game, 'Strategic Action')  // micah: leadership
      t.choose(game, 'Pass')  // dennis declines leadership secondary
      // Dennis uses imperial (+1 VP for Mecatol)
      t.choose(game, 'Strategic Action')  // dennis: imperial
      t.choose(game, 'Pass')  // micah declines imperial secondary

      const dennis = game.players.byName('dennis')
      // 3 (starting) + 1 (Imperial Mecatol) = 4
      expect(dennis.getVictoryPoints()).toBe(4)
    })
  })

  describe('Victory Condition', () => {
    test('game ends when player reaches 10 VP', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          victoryPoints: 9,
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'imperial', 'leadership')

      // Micah (leadership=1) goes first
      t.choose(game, 'Strategic Action')  // micah: leadership
      t.choose(game, 'Pass')  // dennis declines leadership secondary
      // Dennis uses imperial → goes to 10 VP → game should end
      t.choose(game, 'Strategic Action')  // dennis (imperial → 10 VP)

      expect(game.gameOver).toBe(true)
      const dennis = game.players.byName('dennis')
      expect(dennis.getVictoryPoints()).toBe(10)
    })
  })

  describe('Public Objectives', () => {
    test('objective revealed during status phase', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play through action phase
      t.choose(game, 'Strategic Action')  // dennis: leadership
      t.choose(game, 'Pass')  // micah declines leadership secondary
      t.choose(game, 'Strategic Action')  // micah: diplomacy
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass')  // dennis declines diplomacy secondary
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase runs objective reveal
      t.choose(game, 'Done')  // dennis redistribution
      t.choose(game, 'Done')  // micah redistribution

      // Should have 1 revealed objective
      expect(game.state.revealedObjectives.length).toBe(1)
    })

    test('Diversify Research: checks tech color prerequisites', () => {
      const game = t.fixture()
      game.run()

      // Sol starts with 1 green (neural-motivator) and 1 blue (antimass-deflectors)
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechPrerequisites().green).toBe(1)
      expect(dennis.getTechPrerequisites().blue).toBe(1)

      // Not enough for Diversify Research (need 2 in each of 2 colors)
      const res = require('../res/index.js')
      const obj = res.getObjective('diversify-research')
      expect(obj.check(dennis)).toBe(false)
    })
  })

  describe('Scored Objectives', () => {
    test('scored objectives tracked in game state', () => {
      const game = t.fixture()
      game.run()

      expect(game.state.scoredObjectives).toEqual({})
    })
  })

  describe('Planet Control', () => {
    test('getControlledPlanets returns controlled planet IDs', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      const planets = dennis.getControlledPlanets()
      expect(planets).toContain('jord')
    })

    test('getReadyPlanets excludes exhausted planets', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          planets: {
            'jord': { exhausted: true },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const readyPlanets = dennis.getReadyPlanets()
      expect(readyPlanets).not.toContain('jord')
    })
  })
})
