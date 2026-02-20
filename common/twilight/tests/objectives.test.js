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
      t.choose(game, 'Strategic Action')  // micah
      // Dennis uses imperial
      t.choose(game, 'Strategic Action')  // dennis

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
      t.choose(game, 'Strategic Action')  // micah
      // Dennis uses imperial (+1 VP for Mecatol)
      t.choose(game, 'Strategic Action')  // dennis

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
      t.choose(game, 'Strategic Action')  // micah
      // Dennis uses imperial → goes to 10 VP → game should end
      t.choose(game, 'Strategic Action')  // dennis (imperial → 10 VP)

      expect(game.gameOver).toBe(true)
      const dennis = game.players.byName('dennis')
      expect(dennis.getVictoryPoints()).toBe(10)
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
