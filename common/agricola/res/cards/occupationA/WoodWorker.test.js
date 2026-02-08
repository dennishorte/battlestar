const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Wood Worker (OccA 164)', () => {
  test('offers wood for sheep exchange when using take-wood', () => {
    const card = res.getCardById('wood-worker-a164')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 3
    game.actions = { offerWoodForSheepExchange: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerWoodForSheepExchange).toHaveBeenCalledWith(
      dennis, card, 'take-wood'
    )
  })

  test('offers exchange when using copse', () => {
    const card = res.getCardById('wood-worker-a164')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    game.actions = { offerWoodForSheepExchange: jest.fn() }

    card.onAction(game, dennis, 'copse')

    expect(game.actions.offerWoodForSheepExchange).toHaveBeenCalledWith(
      dennis, card, 'copse'
    )
  })

  test('offers exchange when using take-3-wood', () => {
    const card = res.getCardById('wood-worker-a164')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    game.actions = { offerWoodForSheepExchange: jest.fn() }

    card.onAction(game, dennis, 'take-3-wood')

    expect(game.actions.offerWoodForSheepExchange).toHaveBeenCalledWith(
      dennis, card, 'take-3-wood'
    )
  })

  test('offers exchange when using take-2-wood', () => {
    const card = res.getCardById('wood-worker-a164')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    game.actions = { offerWoodForSheepExchange: jest.fn() }

    card.onAction(game, dennis, 'take-2-wood')

    expect(game.actions.offerWoodForSheepExchange).toHaveBeenCalledWith(
      dennis, card, 'take-2-wood'
    )
  })

  test('does not offer exchange without wood', () => {
    const card = res.getCardById('wood-worker-a164')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.actions = { offerWoodForSheepExchange: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerWoodForSheepExchange).not.toHaveBeenCalled()
  })

  test('does not trigger for non-wood actions', () => {
    const card = res.getCardById('wood-worker-a164')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 5
    game.actions = { offerWoodForSheepExchange: jest.fn() }

    card.onAction(game, dennis, 'take-clay')

    expect(game.actions.offerWoodForSheepExchange).not.toHaveBeenCalled()
  })
})
