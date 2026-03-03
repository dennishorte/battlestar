const t = require('../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Leaders', () => {
  describe('Agent', () => {
    test('agent starts ready', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.agent).toBe('ready')
      expect(dennis.isAgentReady()).toBe(true)
    })

    test('agent can be exhausted', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.exhaustAgent()
      expect(dennis.leaders.agent).toBe('exhausted')
      expect(dennis.isAgentReady()).toBe(false)
    })

    test('agent readies during status phase', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play through action phase
      t.choose(game, 'Strategic Action')  // dennis: leadership
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Pass')  // micah declines
      t.choose(game, 'Strategic Action')  // micah: diplomacy
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass')  // dennis declines
      t.choose(game, 'Pass')  // dennis passes
      t.choose(game, 'Pass')  // micah passes

      // Status phase: redistribution
      t.choose(game, 'Done')
      t.choose(game, 'Done')

      // Agent should be ready again
      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.agent).toBe('ready')
    })
  })

  describe('Commander', () => {
    test('commander starts locked', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.commander).toBe('locked')
      expect(dennis.isCommanderUnlocked()).toBe(false)
    })

    test('setBoard can unlock commander', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.commander).toBe('unlocked')
      expect(dennis.isCommanderUnlocked()).toBe(true)
    })

    test('Sol commander unlocks with 12+ ground forces', () => {
      const game = t.fixture()
      // Sol starts with 5 infantry on Jord. Add 7 more to reach 12.
      // We need to set units manually to have exactly 12 ground forces.
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': [
                'infantry', 'infantry', 'infantry', 'infantry', 'infantry',
                'infantry', 'infantry', 'infantry', 'infantry', 'infantry',
                'infantry', 'infantry',  // 12 infantry
                'space-dock',
              ],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // At the start of dennis's first action, leader unlock should check
      // and unlock the commander
      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(true)
    })

    test('Sol commander stays locked with fewer than 12 ground forces', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': [
                'infantry', 'infantry', 'infantry', 'infantry', 'infantry',
                'space-dock',
              ],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(false)
    })

    test('Hacan commander unlocks with 10 trade goods', () => {
      const game = t.fixture()
      t.setBoard(game, {
        micah: {
          tradeGoods: 10,
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const micah = game.players.byName('micah')
      expect(micah.isCommanderUnlocked()).toBe(true)
    })
  })

  describe('Hero', () => {
    test('hero starts locked', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.hero).toBe('locked')
      expect(dennis.isHeroUnlocked()).toBe(false)
    })

    test('hero unlocks with 3 scored objectives', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          scoredObjectives: ['diversify-research', 'develop-weaponry', 'corner-the-market'],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // After leader unlock check at start of dennis's turn
      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroUnlocked()).toBe(true)
    })

    test('hero stays locked with fewer than 3 scored objectives', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          scoredObjectives: ['diversify-research', 'develop-weaponry'],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroUnlocked()).toBe(false)
    })

    test('hero can be purged', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.unlockHero()
      expect(dennis.isHeroUnlocked()).toBe(true)

      dennis.purgeHero()
      expect(dennis.isHeroPurged()).toBe(true)
      expect(dennis.isHeroUnlocked()).toBe(false)
    })

    test('purged hero cannot be unlocked again', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      dennis.purgeHero()
      dennis.unlockHero()  // Should not re-unlock
      expect(dennis.isHeroPurged()).toBe(true)
    })
  })
})
