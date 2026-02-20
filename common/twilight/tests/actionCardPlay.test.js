const t = require('../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Action Card Play', () => {
  describe('Playing from hand', () => {
    test('Play Action Card appears when player has action-timing cards', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          actionCards: ['focused-research'],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const choices = t.currentChoices(game)
      expect(choices).toContain('Play Action Card')
    })

    test('Play Action Card does not appear without action-timing cards', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          actionCards: ['sabotage'],  // timing: 'when-action-card-played', not 'action'
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const choices = t.currentChoices(game)
      expect(choices).not.toContain('Play Action Card')
    })

    test('playing action card removes it from hand', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          actionCards: ['mining-initiative'],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play Action Card (1 card auto-selects mining-initiative,
      // 1 planet auto-selects jord)
      t.choose(game, 'Play Action Card')

      const dennis = game.players.byName('dennis')
      expect(dennis.actionCards.length).toBe(0)
    })
  })

  describe('Focused Research', () => {
    test('spend 4 trade goods to research a technology', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          tradeGoods: 5,
          actionCards: ['focused-research'],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play Action Card → auto-selects Focused Research (only card)
      t.choose(game, 'Play Action Card')
      // Choose a tech to research (Sol starts with neural-motivator + antimass-deflectors)
      t.choose(game, 'plasma-scoring')

      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(1)  // 5 - 4
      expect(dennis.hasTechnology('plasma-scoring')).toBe(true)
    })
  })

  describe('Mining Initiative', () => {
    test('gain trade goods equal to planet resource value', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          actionCards: ['mining-initiative'],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play → auto-selects Mining Initiative → auto-selects Jord (only planet)
      t.choose(game, 'Play Action Card')

      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(4)  // Jord has 4 resources
    })
  })

  describe('Industrial Initiative', () => {
    test('gain trade goods for industrial planets', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          actionCards: ['industrial-initiative'],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis controls Jord (no industrial trait)
      // Play → auto-selects Industrial Initiative → 0 industrial planets
      t.choose(game, 'Play Action Card')

      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(0)
    })
  })

  describe('Uprising', () => {
    test('exhaust enemy planet and gain trade goods', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          actionCards: ['uprising'],
        },
        micah: {
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play → auto-selects Uprising → auto-selects mecatol-rex (only non-home enemy planet)
      t.choose(game, 'Play Action Card')

      // Mecatol Rex should be exhausted
      expect(game.state.planets['mecatol-rex'].exhausted).toBe(true)

      // Dennis gains trade goods equal to resources (Mecatol Rex = 1)
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(1)
    })
  })

  describe('Multiple cards', () => {
    test('player can choose which action card to play', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          tradeGoods: 5,
          actionCards: ['focused-research', 'mining-initiative'],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Play Action Card')
      // Should see both cards as options
      const choices = t.currentChoices(game)
      expect(choices).toContain('Focused Research')
      expect(choices).toContain('Mining Initiative')

      // Play mining initiative → auto-selects jord (only planet)
      t.choose(game, 'Mining Initiative')

      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(9)  // 5 + 4 (Jord resources)
      expect(dennis.actionCards.length).toBe(1)  // still has focused research
      expect(dennis.actionCards[0].id).toBe('focused-research')
    })
  })

  describe('Card data', () => {
    test('setBoard can give specific action cards', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          actionCards: ['sabotage', 'mining-initiative'],
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.actionCards.length).toBe(2)
      expect(dennis.actionCards[0].id).toBe('sabotage')
      expect(dennis.actionCards[1].id).toBe('mining-initiative')
    })
  })
})
