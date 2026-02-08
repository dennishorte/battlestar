const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Animal Catcher (C168)', () => {
  test('offers choice when using day laborer action', () => {
    const card = res.getCardById('animal-catcher-c168')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerAnimalCatcherChoice: jest.fn() }

    card.onAction(game, dennis, 'day-laborer')

    expect(game.actions.offerAnimalCatcherChoice).toHaveBeenCalledWith(dennis, card)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('animal-catcher-c168')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerAnimalCatcherChoice: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerAnimalCatcherChoice).not.toHaveBeenCalled()
  })
})
