const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Swing Plow (C019)', () => {
  test('places 4 field tiles on card', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      dennis: {
        wood: 3,
        hand: ['swing-plow-c019'],
        occupations: ['wood-cutter', 'firewood-collector', 'seasonal-worker'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'swing-plow-c019')

    const dennis = t.player(game)
    expect(dennis.swingPlowCharges).toBe(4)
  })

  test('plows up to 2 extra fields when using plow-field action', () => {
    const card = res.getCardById('swing-plow-c019')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.swingPlowCharges = 4

    let plowCount = 0
    game.actions.plowField = (player, opts) => {
      plowCount++
      expect(opts.immediate).toBe(true)
    }

    card.onAction(game, dennis, 'plow-field')

    expect(plowCount).toBe(2)
    expect(dennis.swingPlowCharges).toBe(2)
  })

  test('plows only 1 field when 1 charge remains', () => {
    const card = res.getCardById('swing-plow-c019')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.swingPlowCharges = 1

    let plowCount = 0
    game.actions.plowField = () => {
      plowCount++
    }

    card.onAction(game, dennis, 'plow-field')

    expect(plowCount).toBe(1)
    expect(dennis.swingPlowCharges).toBe(0)
  })

  test('does not plow when no charges remain', () => {
    const card = res.getCardById('swing-plow-c019')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.swingPlowCharges = 0

    let plowCalled = false
    game.actions.plowField = () => {
      plowCalled = true
    }

    card.onAction(game, dennis, 'plow-field')

    expect(plowCalled).toBe(false)
  })
})
