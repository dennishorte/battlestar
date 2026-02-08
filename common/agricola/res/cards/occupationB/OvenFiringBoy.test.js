const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Oven Firing Boy (B108)', () => {
  test('offers bake bread when using take-wood action', () => {
    const card = res.getCardById('oven-firing-boy-b108')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerBakeBread: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerBakeBread).toHaveBeenCalledWith(dennis, card)
  })

  test('offers bake bread when using copse action', () => {
    const card = res.getCardById('oven-firing-boy-b108')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerBakeBread: jest.fn() }

    card.onAction(game, dennis, 'copse')

    expect(game.actions.offerBakeBread).toHaveBeenCalledWith(dennis, card)
  })

  test('offers bake bread when using take-3-wood action', () => {
    const card = res.getCardById('oven-firing-boy-b108')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerBakeBread: jest.fn() }

    card.onAction(game, dennis, 'take-3-wood')

    expect(game.actions.offerBakeBread).toHaveBeenCalledWith(dennis, card)
  })

  test('does not trigger for non-wood actions', () => {
    const card = res.getCardById('oven-firing-boy-b108')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerBakeBread: jest.fn() }

    card.onAction(game, dennis, 'take-clay')

    expect(game.actions.offerBakeBread).not.toHaveBeenCalled()
  })
})
