const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Moonshine (B003)', () => {
  test('calls moonshineEffect on play', () => {
    const card = res.getCardById('moonshine-b003')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.actions.moonshineEffect = jest.fn()

    card.onPlay(game, dennis)

    expect(game.actions.moonshineEffect).toHaveBeenCalledWith(dennis, card)
  })

  test('requires occupation in hand', () => {
    const card = res.getCardById('moonshine-b003')
    expect(card.prereqs.occupationsInHand).toBe(1)
  })

  test('has no cost', () => {
    const card = res.getCardById('moonshine-b003')
    expect(card.cost).toEqual({})
  })
})
