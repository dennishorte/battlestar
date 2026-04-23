const t = require('../../testutil.js')
const leader = require('./ShaddamCorrinoIV.js')

describe('Shaddam Corrino IV', () => {
  test('data', () => {
    expect(leader.name).toBe('Shaddam Corrino IV')
    expect(leader.source).toBe('Uprising')
  })

  describe('Sardaukar Commander', () => {
    test('onAssign reserves Sardaukar contracts', () => {
      const game = t.fixture()
      t.setBoard(game, { leaders: { dennis: leader } })
      game.run()

      const reserved = game.state.shaddamReservedContracts
      expect(reserved).toBeDefined()
      expect(reserved.length).toBeGreaterThan(0)
    })
  })

  describe('Emperor of the Known Universe', () => {
    function playSignet(game) {
      t.choose(game, 'Agent Turn.Signet Ring')
      t.choose(game, 'Arrakeen')
      t.choose(game, 'Signet Ring')
    }

    test('+1 Solari +1 Troop choice and prevents this-turn deployment', () => {
      // Pick this branch explicitly by giving dennis enough solari that both
      // options are offered.
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { solari: 5, hand: ['Signet Ring'] },
      })
      game.run()

      const supplyBefore = game.players.byName('dennis').troopsInSupply
      const garrisonBefore = game.players.byName('dennis').troopsInGarrison

      playSignet(game)
      t.choose(game, '+1 Solari and +1 Troop')

      const dennis = game.players.byName('dennis')
      expect(dennis.solari).toBe(6)
      // +1 Troop from Emperor goes to supply. Arrakeen's recruit moves 1 from
      // supply to garrison.
      expect(dennis.troopsInSupply).toBe(supplyBefore + 1 - 1)
      expect(dennis.troopsInGarrison).toBe(garrisonBefore + 1)
    })

    test('Emperor restriction blocks deployment from the Conflict space', () => {
      // Send the agent to Arrakeen (combat space). With shaddamNoDeploy set,
      // the deployUnits prompt should be skipped entirely — game advances
      // straight to the next player's turn after plot intrigue.
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { solari: 5, hand: ['Signet Ring'], troopsInGarrison: 5 },
      })
      game.run()

      playSignet(game)
      t.choose(game, '+1 Solari and +1 Troop')

      // Dennis has 6 troops in garrison but the deploy step is skipped — no
      // Deploy prompt is ever raised for dennis.
      expect(game.waiting?.selectors[0].title).not.toContain('Deploy')
      expect(game.waiting?.selectors[0].actor).not.toBe('dennis')
    })

    test('pay 3 Solari for +1 Influence', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { solari: 3, influence: { emperor: 0 }, hand: ['Signet Ring'] },
      })
      game.run()

      playSignet(game)
      t.choose(game, 'Pay 3 Solari → +1 Influence')
      t.choose(game, 'emperor')

      const dennis = game.players.byName('dennis')
      expect(dennis.solari).toBe(0)
      expect(dennis.getInfluence('emperor')).toBe(1)
    })

    test('pay-3-solari option not offered when under 3 solari', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { solari: 2, hand: ['Signet Ring'] },
      })
      game.run()

      playSignet(game)
      // Single choice → auto-resolved; no prompt seen by the test
      expect(game.waiting?.selectors[0].title).not.toContain('Emperor of the Known Universe')
    })
  })
})
