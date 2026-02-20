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

    test('gameOverData contains winner name', () => {
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

      t.choose(game, 'Strategic Action')  // micah: leadership
      t.choose(game, 'Pass')  // dennis declines leadership secondary
      t.choose(game, 'Strategic Action')  // dennis: imperial → 10 VP

      expect(game.gameOverData).toBeTruthy()
      expect(game.gameOverData.player).toBe('dennis')
    })

    test('game does not end at 9 VP', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          victoryPoints: 8,
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'imperial', 'leadership')

      t.choose(game, 'Strategic Action')  // micah: leadership
      t.choose(game, 'Pass')  // dennis declines leadership secondary
      t.choose(game, 'Strategic Action')  // dennis: imperial → 9 VP
      t.choose(game, 'Pass')  // micah declines imperial secondary

      expect(game.gameOver).toBe(false)
      const dennis = game.players.byName('dennis')
      expect(dennis.getVictoryPoints()).toBe(9)
    })

    test('game ends when player scores objective to reach 10 VP', () => {
      const game = t.fixture()
      t.setBoard(game, {
        revealedObjectives: ['develop-weaponry'],
        dennis: {
          victoryPoints: 9,
          technologies: [
            'neural-motivator', 'antimass-deflectors',
            'infantry-ii', 'fighter-ii',  // 2 unit upgrades
          ],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play through action phase — both pass
      t.choose(game, 'Strategic Action')  // dennis: leadership
      t.choose(game, 'Pass')  // micah declines leadership secondary
      t.choose(game, 'Strategic Action')  // micah: diplomacy
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass')  // dennis declines diplomacy secondary
      t.choose(game, 'Pass')  // dennis passes
      t.choose(game, 'Pass')  // micah passes

      // Status phase: objective scoring — dennis can score develop-weaponry
      t.choose(game, 'develop-weaponry: Develop Weaponry')

      expect(game.gameOver).toBe(true)
      expect(game.gameOverData.player).toBe('dennis')
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

  describe('Secret Objectives', () => {
    test('players draw initial secret objectives when enabled', () => {
      const game = t.fixture()
      t.setBoard(game, {
        enableInitialDraws: true,
      })
      game.run()

      // Dennis chooses first secret objective offered
      const dennisChoices = t.currentChoices(game)
      expect(dennisChoices.length).toBe(2)
      t.choose(game, dennisChoices[0])

      // Micah chooses first secret objective offered
      const micahChoices = t.currentChoices(game)
      expect(micahChoices.length).toBe(2)
      t.choose(game, micahChoices[0])

      // Each player should have 1 secret objective
      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      expect(dennis.secretObjectives.length).toBe(1)
      expect(micah.secretObjectives.length).toBe(1)
    })

    test('setBoard can assign secret objectives', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          secretObjectives: ['cut-supply-lines', 'control-the-region'],
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.secretObjectives).toEqual(['cut-supply-lines', 'control-the-region'])
    })

    test('player can score a secret objective during status phase', () => {
      const game = t.fixture()

      t.setBoard(game, {
        dennis: {
          secretObjectives: ['cut-supply-lines'],
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
            'hacan-home': {
              space: ['cruiser'],  // Ships in same system as Hacan's space dock
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play through action phase — both pass
      t.choose(game, 'Strategic Action')  // dennis: leadership
      t.choose(game, 'Pass')  // micah declines
      t.choose(game, 'Strategic Action')  // micah: diplomacy
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass')  // dennis declines
      t.choose(game, 'Pass')  // dennis passes
      t.choose(game, 'Pass')  // micah passes

      // Status phase: dennis should be prompted to score secret objective
      t.choose(game, 'cut-supply-lines: Cut Supply Lines')

      const dennis = game.players.byName('dennis')
      expect(dennis.getVictoryPoints()).toBe(1)
      expect(game.state.scoredObjectives['dennis']).toContain('cut-supply-lines')
    })

    test('secret objective scoring gives VP to winner at 10', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          victoryPoints: 9,
          secretObjectives: ['cut-supply-lines'],
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
            'hacan-home': {
              space: ['cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')
      t.choose(game, 'Strategic Action')
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Score secret objective → 10 VP → game over
      t.choose(game, 'cut-supply-lines: Cut Supply Lines')

      expect(game.gameOver).toBe(true)
      expect(game.gameOverData.player).toBe('dennis')
    })

    test('cannot score same secret objective twice', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          secretObjectives: ['cut-supply-lines'],
          scoredObjectives: ['cut-supply-lines'],  // already scored
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
            'hacan-home': {
              space: ['cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')
      t.choose(game, 'Strategic Action')
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Should not be prompted for secret objective (already scored)
      // Status phase continues to redistribution
      t.choose(game, 'Done')  // dennis redistribution
      t.choose(game, 'Done')  // micah redistribution

      const dennis = game.players.byName('dennis')
      expect(dennis.getVictoryPoints()).toBe(0)
    })
  })
})
