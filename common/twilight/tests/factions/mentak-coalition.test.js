const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Mentak Coalition', () => {
  describe('Ambush', () => {
    test('Mentak ambush fires before combat and can destroy ships', () => {
      // Mentak (dennis) moves cruisers into system with enemy fighter
      // Ambush rolls 2 dice at 9+ before combat begins
      // Deterministic layout: mentak-home (0,-3) → adjacent to system 27 (0,-2)
      const game = t.fixture({
        factions: ['mentak-coalition', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          units: {
            'mentak-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'moll-primus': ['space-dock'],
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

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'mentak-home', count: 5 }],
      })

      // 5 cruisers vs 1 fighter — Mentak should win (ambush + combat)
      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })
  })

  describe('Pillage', () => {
    test('Mentak can steal trade good from neighbor after transaction', () => {
      // 3 players: Sol (dennis), Hacan (micah), Mentak (scott)
      // Sol and Hacan trade while adjacent to Mentak — Mentak pillages
      // 3p uses random layout (deterministic only applies to 2p)
      // Use a setup game to find an adjacent system
      const { Galaxy } = require('../../model/Galaxy.js')
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'mentak-coalition'],
      })
      const setupGame = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'mentak-coalition'],
      })
      setupGame.run()
      const galaxy = new Galaxy(setupGame)
      const solAdj = galaxy.getAdjacent('sol-home')[0]

      t.setBoard(game, {
        dennis: {
          tradeGoods: 5,
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          tradeGoods: 5,
          units: {
            // Place Hacan adjacent to Sol so they can trade
            [solAdj]: { space: ['cruiser'] },
          },
        },
        scott: {
          tradeGoods: 0,
          units: {
            // Place Mentak adjacent to Sol so pillage triggers
            [solAdj]: { space: ['cruiser'] },
          },
        },
      })
      game.run()

      // 3-player strategy: snake draft
      t.choose(game, 'leadership')    // dennis
      t.choose(game, 'diplomacy')     // micah
      t.choose(game, 'trade')         // scott
      t.choose(game, 'construction')  // scott (2nd pick)
      t.choose(game, 'politics')      // micah (2nd pick)
      t.choose(game, 'warfare')       // dennis (2nd pick)

      // Dennis (leadership=1) goes first
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines secondary
      t.choose(game, 'Pass')  // scott declines secondary

      // Dennis should get transaction window (adjacent to micah via solAdj)
      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: { tradeGoods: 1 },
        requesting: {},
      })
      t.choose(game, 'Accept')

      // Mentak (scott) should be prompted to pillage micah (who received TG)
      // Scott steals 1 trade good from micah
      t.choose(game, 'Steal Trade Good')

      const scott = game.players.byName('scott')
      expect(scott.tradeGoods).toBe(1)
    })
  })
})
