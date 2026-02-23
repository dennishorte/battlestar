const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe("Sardakk N'orr", () => {
  describe('Unrelenting', () => {
    test('Sardakk combat rolls are more effective', () => {
      // Deterministic layout: norr-home (0,-3) → adjacent to system 27 (0,-2)
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })

      // Sardakk has 5 cruisers (combat 7, with Unrelenting effectively combat 6)
      // vs 1 fighter (combat 9) — Sardakk should win easily
      t.setBoard(game, {
        dennis: {
          units: {
            'norr-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'quinarra': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['fighter'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Sardakk) uses tactical action
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'norr-home', count: 5 }],
      })

      // 5 cruisers with Unrelenting should destroy 1 fighter
      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })

    test('non-Sardakk player does not get Unrelenting bonus', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      game.run()

      // Sardakk has it
      const dennis = game.players.byName('dennis')
      expect(dennis.faction.abilities.some(a => a.id === 'unrelenting')).toBe(true)

      // Hacan does not
      const micah = game.players.byName('micah')
      expect(micah.faction.abilities.some(a => a.id === 'unrelenting')).toBe(false)
    })
  })
})
