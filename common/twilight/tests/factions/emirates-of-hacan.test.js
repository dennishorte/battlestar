const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Emirates of Hacan', () => {
  describe('Guild Ships', () => {
    test('Hacan can trade with non-neighbors', () => {
      // In the default 2-player map, sol-home and hacan-home are not adjacent
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      t.setBoard(game, {
        dennis: { tradeGoods: 5 },
        micah: { tradeGoods: 5 },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Hacan) uses leadership — goes first (card #1)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines secondary

      // After strategic action, Dennis gets transaction window
      // Hacan's Guild Ships means Dennis can trade even though not neighbors
      const choices = t.currentChoices(game)
      expect(choices).toContain('micah')
    })

    test('non-Hacan cannot trade with non-neighbors', () => {
      // Micah (Sol) should not be able to trade with non-adjacent Hacan
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: { tradeGoods: 5 },
        micah: { tradeGoods: 5 },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Sol) uses leadership
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines secondary

      // Dennis is Sol — not neighbors with Hacan in default map
      // Should go directly to micah's turn (no transaction window)
      expect(game.waiting.selectors[0].actor).toBe('micah')
    })
  })

  describe('Masters of Trade', () => {
    test('Hacan uses Trade secondary for free', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      // Dennis (Sol, trade=5) uses strategic action
      t.choose(game, 'Strategic Action')

      // Micah (Hacan) gets Trade secondary prompt — should be free
      t.choose(game, 'Use Secondary')

      // Hacan should have replenished commodities without spending strategy token
      const micah = game.players.byName('micah')
      expect(micah.commodities).toBe(6)  // Hacan max
      expect(micah.commandTokens.strategy).toBe(2)  // unchanged — free!
    })

    test('non-Hacan pays strategy token for Trade secondary', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      // Dennis (Hacan, trade=5) uses strategic action
      t.choose(game, 'Strategic Action')

      // Micah (Sol) gets Trade secondary prompt — costs 1 strategy token
      t.choose(game, 'Use Secondary')

      const micah = game.players.byName('micah')
      expect(micah.commodities).toBe(4)  // Sol max
      expect(micah.commandTokens.strategy).toBe(1)  // spent 1
    })
  })

  describe('Hacan — Arbiters (Action Card Trading)', () => {
    test('canTradeActionCards returns true when Hacan is involved', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      game.run()

      const dennis = game.players.byName('dennis')  // Hacan
      const micah = game.players.byName('micah')     // Sol

      expect(game.factionAbilities.canTradeActionCards(dennis, micah)).toBe(true)
      expect(game.factionAbilities.canTradeActionCards(micah, dennis)).toBe(true)
    })

    test('action cards transfer correctly via Arbiters', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      t.setBoard(game, {
        dennis: {
          actionCards: ['sabotage'],
          tradeGoods: 1,
        },
        micah: {
          actionCards: ['direct-hit'],
          tradeGoods: 1,
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Hacan): Strategic Action + transaction
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines secondary

      // Transaction window for dennis (Hacan has guild-ships → can trade with anyone)
      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: { actionCards: ['sabotage'] },
        requesting: { actionCards: ['direct-hit'] },
      })
      t.choose(game, 'Accept')
      // Transaction loop auto-exits: micah already traded with, no more partners

      // Verify cards transferred
      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      expect(dennis.actionCards.some(c => c.id === 'direct-hit')).toBe(true)
      expect(dennis.actionCards.some(c => c.id === 'sabotage')).toBe(false)
      expect(micah.actionCards.some(c => c.id === 'sabotage')).toBe(true)
      expect(micah.actionCards.some(c => c.id === 'direct-hit')).toBe(false)
    })

    test('non-Hacan cannot trade action cards', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'barony-of-letnev'] })
      game.run()

      const dennis = game.players.byName('dennis')  // Sol
      const micah = game.players.byName('micah')     // Letnev

      expect(game.factionAbilities.canTradeActionCards(dennis, micah)).toBe(false)
    })
  })
})
