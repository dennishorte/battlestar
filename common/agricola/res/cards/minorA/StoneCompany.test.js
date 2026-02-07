const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Stone Company (A023)', () => {
  test('offers improvement action on quarry action', () => {
    const card = res.getCardById('stone-company-a023')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)

    let improvementCalled = false
    game.actions.buildImprovement = (player, opts) => {
      improvementCalled = true
      expect(opts.requireStone).toBe(true)
    }

    card.onAction(game, dennis, 'take-stone-1')

    expect(improvementCalled).toBe(true)
  })

  test('triggers on take-stone-2 as well', () => {
    const card = res.getCardById('stone-company-a023')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)

    let improvementCalled = false
    game.actions.buildImprovement = () => {
      improvementCalled = true
    }

    card.onAction(game, dennis, 'take-stone-2')

    expect(improvementCalled).toBe(true)
  })

  test('does not trigger on non-quarry actions', () => {
    const card = res.getCardById('stone-company-a023')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)

    let improvementCalled = false
    game.actions.buildImprovement = () => {
      improvementCalled = true
    }

    card.onAction(game, dennis, 'take-wood')

    expect(improvementCalled).toBe(false)
  })
})
