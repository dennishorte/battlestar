const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Seducer (B127)', () => {
  test('offers family growth when played in round 5 or later', () => {
    const card = res.getCardById('seducer-b127')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)
    game.actions = { offerSeducerGrowth: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerSeducerGrowth).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer family growth before round 5', () => {
    const card = res.getCardById('seducer-b127')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 4

    const dennis = t.player(game)
    game.actions = { offerSeducerGrowth: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerSeducerGrowth).not.toHaveBeenCalled()
  })
})
