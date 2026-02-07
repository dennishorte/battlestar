const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Beating Rod (B009)', () => {
  test('calls offerBeatingRod on play', () => {
    const card = res.getCardById('beating-rod-b009')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.actions.offerBeatingRod = jest.fn()

    card.onPlay(game, dennis)

    expect(game.actions.offerBeatingRod).toHaveBeenCalledWith(dennis, card)
  })

  test('has no cost', () => {
    const card = res.getCardById('beating-rod-b009')
    expect(card.cost).toEqual({})
  })
})
