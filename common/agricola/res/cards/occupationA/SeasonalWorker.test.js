const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Seasonal Worker (OccA 114)', () => {
  test('gives 1 grain when using day laborer before round 6', () => {
    const card = res.getCardById('seasonal-worker-a114')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    game.state.round = 3

    card.onAction(game, dennis, 'day-laborer')

    expect(dennis.grain).toBe(1)
  })

  test('offers choice at round 6 and later', () => {
    const card = res.getCardById('seasonal-worker-a114')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 6
    game.actions = { offerResourceChoice: jest.fn() }

    card.onAction(game, dennis, 'day-laborer')

    expect(game.actions.offerResourceChoice).toHaveBeenCalledWith(
      dennis, card, ['grain', 'vegetables']
    )
  })

  test('offers choice at round 10', () => {
    const card = res.getCardById('seasonal-worker-a114')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 10
    game.actions = { offerResourceChoice: jest.fn() }

    card.onAction(game, dennis, 'day-laborer')

    expect(game.actions.offerResourceChoice).toHaveBeenCalledWith(
      dennis, card, ['grain', 'vegetables']
    )
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('seasonal-worker-a114')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    game.state.round = 3

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.grain).toBe(0)
  })
})
