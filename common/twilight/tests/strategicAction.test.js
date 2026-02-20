const t = require('../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Strategic Actions', () => {
  describe('Leadership (#1)', () => {
    test('primary: gain 3 command tokens', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis has leadership, uses it
      t.choose(game, 'Strategic Action')

      const dennis = game.players.byName('dennis')
      // Started with tactics=3, gained 3 from Leadership
      expect(dennis.commandTokens.tactics).toBe(6)
    })
  })

  describe('Trade (#5)', () => {
    test('primary: gain 3 trade goods and replenish commodities', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      // Dennis has trade(5), micah has imperial(8). Dennis goes first.
      t.choose(game, 'Strategic Action')

      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(3)
      // Sol has 4 max commodities
      expect(dennis.commodities).toBe(4)
    })

    test('primary: all other players replenish commodities', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      t.choose(game, 'Strategic Action')

      // Micah (Hacan) has 6 max commodities
      const micah = game.players.byName('micah')
      expect(micah.commodities).toBe(6)
    })
  })

  describe('Technology (#7)', () => {
    test('primary: research one technology', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'technology', 'imperial')

      // Dennis has technology(7), micah has imperial(8). Dennis goes first.
      t.choose(game, 'Strategic Action')

      // Sol starts with neural-motivator (green) + antimass-deflectors (blue)
      // Sarween Tools has no prerequisites — should be available
      t.choose(game, 'sarween-tools')

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('sarween-tools')).toBe(true)
    })

    test('primary: can research tech matching prerequisites', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'technology', 'imperial')

      t.choose(game, 'Strategic Action')

      // Sol has 1 blue (antimass) — can research gravity-drive (needs 1 blue)
      t.choose(game, 'gravity-drive')

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('gravity-drive')).toBe(true)
    })

    test('researched tech only available choices that meet prerequisites', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'technology', 'imperial')

      t.choose(game, 'Strategic Action')

      // Check available choices — should not include fleet-logistics (needs 2 blue)
      const choices = t.currentChoices(game)
      expect(choices).toContain('sarween-tools')
      expect(choices).toContain('gravity-drive')
      expect(choices).not.toContain('fleet-logistics')  // needs 2 blue, only has 1
    })
  })

  describe('Imperial (#8)', () => {
    test('primary: gain 1 VP if controlling Mecatol Rex', () => {
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

      // Micah has leadership(1), goes first
      t.choose(game, 'Strategic Action')  // micah: leadership
      // Dennis uses imperial
      t.choose(game, 'Strategic Action')

      const dennis = game.players.byName('dennis')
      expect(dennis.victoryPoints).toBe(1)
    })

    test('primary: no VP without Mecatol Rex', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'imperial', 'leadership')

      // Micah has leadership(1), goes first
      t.choose(game, 'Strategic Action')  // micah: leadership
      // Dennis uses imperial
      t.choose(game, 'Strategic Action')

      const dennis = game.players.byName('dennis')
      expect(dennis.victoryPoints).toBe(0)
    })
  })

  describe('Card Effects', () => {
    test('leadership tokens persist through status phase', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses leadership (gains 3 tactic tokens)
      t.choose(game, 'Strategic Action')
      // Micah uses diplomacy
      t.choose(game, 'Strategic Action')
      // Both pass
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase: redistribute (Dennis gains 3 for Versatile, Micah gains 2)
      t.choose(game, 'Done')  // dennis
      t.choose(game, 'Done')  // micah

      // Dennis: 3 (start) + 3 (leadership) + 3 (status: 2+1 versatile) = 9
      const dennis = game.players.byName('dennis')
      expect(dennis.commandTokens.tactics).toBe(9)
    })

    test('trade goods from Trade persist', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      // Dennis (trade=5) goes first
      t.choose(game, 'Strategic Action')

      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(3)
      expect(dennis.commodities).toBe(4)  // Sol max commodities

      // Micah also replenished
      const micah = game.players.byName('micah')
      expect(micah.commodities).toBe(6)  // Hacan max commodities
    })
  })
})
