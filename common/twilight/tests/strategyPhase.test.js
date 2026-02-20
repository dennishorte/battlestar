const t = require('../testutil.js')

describe('Strategy Phase', () => {
  describe('Card Selection', () => {
    test('speaker picks first strategy card', () => {
      const game = t.fixture()
      game.run()

      expect(game.waiting.selectors[0].actor).toBe('dennis')
      expect(game.waiting.selectors[0].title).toBe('Choose Strategy Card')
    })

    test('second player picks after speaker', () => {
      const game = t.fixture()
      game.run()

      t.choose(game, 'leadership')

      expect(game.waiting.selectors[0].actor).toBe('micah')
      expect(game.waiting.selectors[0].title).toBe('Choose Strategy Card')
    })

    test('cannot pick already-chosen card', () => {
      const game = t.fixture()
      game.run()

      t.choose(game, 'leadership')

      const choices = t.currentChoices(game)
      expect(choices).not.toContain('leadership')
      expect(choices).toHaveLength(7)
    })

    test('all 8 strategy cards are available initially', () => {
      const game = t.fixture()
      game.run()

      const choices = t.currentChoices(game)
      expect(choices).toHaveLength(8)
      expect(choices).toContain('leadership')
      expect(choices).toContain('diplomacy')
      expect(choices).toContain('politics')
      expect(choices).toContain('construction')
      expect(choices).toContain('trade')
      expect(choices).toContain('warfare')
      expect(choices).toContain('technology')
      expect(choices).toContain('imperial')
    })

    test('picked strategy card is assigned to player', () => {
      const game = t.fixture()
      game.run()

      t.choose(game, 'warfare')
      t.choose(game, 'politics')

      // Now in action phase — verify assignments
      expect(game.players.byName('dennis').getStrategyCardId()).toBe('warfare')
      expect(game.players.byName('micah').getStrategyCardId()).toBe('politics')
    })
  })

  describe('Turn Order', () => {
    test('speaker always picks first', () => {
      const game = t.fixture()
      t.setBoard(game, { speaker: 'micah' })
      game.run()

      expect(game.waiting.selectors[0].actor).toBe('micah')
    })

    test('pick order goes clockwise from speaker', () => {
      const game = t.fixture({ numPlayers: 3 })
      t.setBoard(game, { speaker: 'micah' })
      game.run()

      // Seat order: dennis(0), micah(1), scott(2)
      // Clockwise from micah: micah, scott, dennis
      expect(game.waiting.selectors[0].actor).toBe('micah')
      t.choose(game, 'leadership')

      expect(game.waiting.selectors[0].actor).toBe('scott')
      t.choose(game, 'diplomacy')

      expect(game.waiting.selectors[0].actor).toBe('dennis')
    })

    test('3-player game: snake draft with reverse order for second pick', () => {
      const game = t.fixture({ numPlayers: 3 })
      game.run()

      // First round clockwise from speaker (dennis): dennis, micah, scott
      expect(game.waiting.selectors[0].actor).toBe('dennis')
      t.choose(game, 'leadership')
      expect(game.waiting.selectors[0].actor).toBe('micah')
      t.choose(game, 'diplomacy')
      expect(game.waiting.selectors[0].actor).toBe('scott')
      t.choose(game, 'politics')

      // Second round reverse: scott, micah, dennis
      expect(game.waiting.selectors[0].actor).toBe('scott')
      t.choose(game, 'construction')
      expect(game.waiting.selectors[0].actor).toBe('micah')
      t.choose(game, 'trade')
      expect(game.waiting.selectors[0].actor).toBe('dennis')
      t.choose(game, 'warfare')

      // Each player should have 2 strategy cards
      expect(game.players.byName('dennis').getStrategyCards()).toEqual(
        expect.arrayContaining(['leadership', 'warfare'])
      )
      expect(game.players.byName('micah').getStrategyCards()).toEqual(
        expect.arrayContaining(['diplomacy', 'trade'])
      )
      expect(game.players.byName('scott').getStrategyCards()).toEqual(
        expect.arrayContaining(['politics', 'construction'])
      )
    })

    test('initiative order in action phase based on lowest strategy card number', () => {
      const game = t.fixture()
      game.run()

      // dennis picks imperial (8), micah picks leadership (1)
      t.choose(game, 'imperial')
      t.choose(game, 'leadership')

      // micah has lower initiative — should go first in action phase
      expect(game.waiting.selectors[0].actor).toBe('micah')
    })
  })

  describe('Trade Goods on Cards', () => {
    test('unchosen cards receive 1 trade good after strategy phase', () => {
      const game = t.fixture()
      game.run()

      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // 6 unchosen cards should each have 1 trade good
      const tg = game.state.strategyCardTradeGoods
      expect(tg['leadership']).toBeUndefined()
      expect(tg['diplomacy']).toBeUndefined()
      expect(tg['politics']).toBe(1)
      expect(tg['construction']).toBe(1)
      expect(tg['trade']).toBe(1)
      expect(tg['warfare']).toBe(1)
      expect(tg['technology']).toBe(1)
      expect(tg['imperial']).toBe(1)
    })

    test('trade goods accumulate on unchosen cards', () => {
      const game = t.fixture()
      game.testSetBreakpoint('initialization-complete', (game) => {
        // Simulate trade goods from a previous round
        game.state.strategyCardTradeGoods['politics'] = 2
        game.state.strategyCardTradeGoods['trade'] = 1
      })
      game.run()

      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Pre-existing TG should accumulate
      expect(game.state.strategyCardTradeGoods['politics']).toBe(3)
      expect(game.state.strategyCardTradeGoods['trade']).toBe(2)
      expect(game.state.strategyCardTradeGoods['warfare']).toBe(1)
    })

    test('picking a card with trade goods gives them to player', () => {
      const game = t.fixture()
      game.testSetBreakpoint('initialization-complete', (game) => {
        game.state.strategyCardTradeGoods['leadership'] = 3
        game.state.strategyCardTradeGoods['diplomacy'] = 1
      })
      game.run()

      t.choose(game, 'leadership')  // dennis gets 3 TG
      t.choose(game, 'diplomacy')   // micah gets 1 TG

      expect(game.players.byName('dennis').tradeGoods).toBe(3)
      expect(game.players.byName('micah').tradeGoods).toBe(1)
    })

    test('trade goods cleared from card after being picked', () => {
      const game = t.fixture()
      game.testSetBreakpoint('initialization-complete', (game) => {
        game.state.strategyCardTradeGoods['leadership'] = 3
      })
      game.run()

      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      expect(game.state.strategyCardTradeGoods['leadership']).toBeUndefined()
    })
  })
})
