const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Moldboard Plow (B019)', () => {
  test('places 2 field charges on card', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        wood: 2,
        hand: ['moldboard-plow-b019'],
        occupations: ['wood-cutter'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'moldboard-plow-b019')

    const dennis = t.player(game)
    expect(dennis.moldboardPlowCharges).toBe(2)
  })

  test('plows extra field when using plow-field action', () => {
    const card = res.getCardById('moldboard-plow-b019')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.moldboardPlowCharges = 2

    // Mock plowField to track calls
    let plowCalled = false
    game.actions.plowField = (player, opts) => {
      plowCalled = true
      expect(opts.immediate).toBe(true)
    }

    card.onAction(game, dennis, 'plow-field')

    expect(plowCalled).toBe(true)
    expect(dennis.moldboardPlowCharges).toBe(1)
  })

  test('does not plow when no charges remain', () => {
    const card = res.getCardById('moldboard-plow-b019')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.moldboardPlowCharges = 0

    let plowCalled = false
    game.actions.plowField = () => {
      plowCalled = true
    }

    card.onAction(game, dennis, 'plow-field')

    expect(plowCalled).toBe(false)
    expect(dennis.moldboardPlowCharges).toBe(0)
  })
})
