const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Animal Feeder (C138)', () => {
  test('offers choice when using day laborer action', () => {
    const card = res.getCardById('animal-feeder-c138')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerAnimalFeederChoice: jest.fn() }

    card.onAction(game, dennis, 'day-laborer')

    expect(game.actions.offerAnimalFeederChoice).toHaveBeenCalledWith(dennis, card)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('animal-feeder-c138')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerAnimalFeederChoice: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerAnimalFeederChoice).not.toHaveBeenCalled()
  })
})
