const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Culinary Artist (OccA 158)', () => {
  test('offers exchange when another player uses traveling players', () => {
    const card = res.getCardById('culinary-artist-a158')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    game.actions = { offerCulinaryArtistExchange: jest.fn() }

    card.onAnyAction(game, micah, 'traveling-players', dennis)

    expect(game.actions.offerCulinaryArtistExchange).toHaveBeenCalledWith(dennis, card)
  })

  test('does not trigger when card owner uses traveling players', () => {
    const card = res.getCardById('culinary-artist-a158')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerCulinaryArtistExchange: jest.fn() }

    card.onAnyAction(game, dennis, 'traveling-players', dennis)

    expect(game.actions.offerCulinaryArtistExchange).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('culinary-artist-a158')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    game.actions = { offerCulinaryArtistExchange: jest.fn() }

    card.onAnyAction(game, micah, 'take-wood', dennis)

    expect(game.actions.offerCulinaryArtistExchange).not.toHaveBeenCalled()
  })
})
