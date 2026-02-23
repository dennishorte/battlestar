const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Naalu Collective', () => {
  describe('Telepathic', () => {
    test('Naalu always goes first in action phase regardless of strategy card', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'naalu-collective', 'emirates-of-hacan'],
      })
      game.run()

      // Snake draft: dennis, micah, scott, scott, micah, dennis
      t.choose(game, 'leadership')    // dennis: leadership(1)
      t.choose(game, 'imperial')      // micah: imperial(8)
      t.choose(game, 'diplomacy')     // scott: diplomacy(2)
      t.choose(game, 'construction')  // scott: construction(4)
      t.choose(game, 'politics')      // micah: politics(3)
      t.choose(game, 'trade')         // dennis: trade(5)

      // Despite having high cards (3,8), Naalu should go first (initiative 0)
      expect(game.waiting.selectors[0].actor).toBe('micah')
    })

    test('non-Naalu player with lower card goes after Naalu', () => {
      const game = t.fixture({
        factions: ['federation-of-sol', 'naalu-collective'],
      })
      game.run()

      // Dennis picks leadership(1), micah (Naalu) picks imperial(8)
      t.choose(game, 'leadership')
      t.choose(game, 'imperial')

      // Naalu goes first even though leadership(1) < imperial(8)
      expect(game.waiting.selectors[0].actor).toBe('micah')
    })
  })

  describe('Foresight', () => {
    test('Naalu can move ship to adjacent system when opponent enters', () => {
      // Deterministic layout: hacan-home at (0,-3) → adjacent to system 27 (0,-2)
      // System 27 (0,-2) is adjacent to: [37, 26, 48, hacan-home]
      // Place Naalu fighter in system 27, Hacan approaches from home
      const game = t.fixture({
        factions: ['emirates-of-hacan', 'naalu-collective'],
      })
      t.setBoard(game, {
        dennis: {
          units: {
            'hacan-home': {
              space: ['cruiser'],
              'arretze': ['space-dock'],
            },
          },
        },
        micah: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            '27': {
              space: ['fighter'],
            },
            'naalu-home': {
              space: [],
              'druaa': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Micah (Naalu, telepathic=0) goes first — use diplomacy
      t.choose(game, 'Strategic Action')
      t.choose(game, 'naalu-home')   // diplomacy: choose system
      t.choose(game, 'Pass')         // dennis declines diplomacy secondary

      // Dennis (Hacan) takes tactical action
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'hacan-home', count: 1 }],
      })

      // Naalu prompted for Foresight — retreat to system 37 (adjacent to 27)
      // Use * prefix to prevent t.choose from converting '37' to number
      t.choose(game, '*37')

      // Naalu's fighter should have moved to system 37
      const retreatShips = game.state.units['37'].space
        .filter(u => u.owner === 'micah')
      expect(retreatShips.length).toBe(1)

      // Naalu should have spent 1 strategy token
      const micah = game.players.byName('micah')
      expect(micah.commandTokens.strategy).toBe(1)
    })
  })
})
