const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('House Artist (OccA 149)', () => {
  test('offers discounted room building when using traveling players', () => {
    const card = res.getCardById('house-artist-a149')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerBuildRoomsWithDiscount: jest.fn() }

    card.onAction(game, dennis, 'traveling-players')

    expect(game.actions.offerBuildRoomsWithDiscount).toHaveBeenCalledWith(
      dennis, card, { reed: 1 }
    )
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('house-artist-a149')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerBuildRoomsWithDiscount: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerBuildRoomsWithDiscount).not.toHaveBeenCalled()
  })
})
