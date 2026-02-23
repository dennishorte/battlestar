const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Clan of Saar', () => {
  describe('Scavenge', () => {
    test('gains 1 trade good when gaining planet control', () => {
      // Saar moves ground forces to an uncontrolled planet
      const game = t.fixture({ factions: ['clan-of-saar', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          units: {
            'saar-home': {
              space: ['carrier'],
              'lisis-ii': ['infantry', 'infantry', 'space-dock'],
            },
            '27': {
              space: ['carrier'],
              'new-albion': ['infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis takes tactical action to move into system 37 (has planets)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '37' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'carrier', from: '27', count: 1 }, { unitType: 'infantry', from: '27', count: 1 }],
      })

      // Infantry placed on planet → planet gained → scavenge triggers
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(1)
    })
  })
})
