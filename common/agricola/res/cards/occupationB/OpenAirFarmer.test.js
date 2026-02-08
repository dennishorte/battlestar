const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Open Air Farmer (B149)', () => {
  test('offers pasture when player has 3+ stables in supply', () => {
    const card = res.getCardById('open-air-farmer-b149')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.stablesInSupply = 4
    game.actions = { offerOpenAirFarmerPasture: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerOpenAirFarmerPasture).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer when less than 3 stables in supply', () => {
    const card = res.getCardById('open-air-farmer-b149')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.stablesInSupply = 2
    game.actions = { offerOpenAirFarmerPasture: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerOpenAirFarmerPasture).not.toHaveBeenCalled()
  })
})
