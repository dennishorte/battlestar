const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Roastmaster (E166)', () => {
  test('offers move when using traveling players and conditions met', () => {
    const card = res.getCardById('roastmaster-e166')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.canMoveFood = () => true

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => true

    const offerRoastmasterMove = jest.fn()
    game.actions.offerRoastmasterMove = offerRoastmasterMove

    card.onAction(game, dennis, 'traveling-players')

    expect(offerRoastmasterMove).toHaveBeenCalledWith(dennis, card, 'traveling-players', 'fishing')
  })

  test('offers move when using fishing and conditions met', () => {
    const card = res.getCardById('roastmaster-e166')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.canMoveFood = () => true

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => true

    const offerRoastmasterMove = jest.fn()
    game.actions.offerRoastmasterMove = offerRoastmasterMove

    card.onAction(game, dennis, 'fishing')

    expect(offerRoastmasterMove).toHaveBeenCalledWith(dennis, card, 'fishing', 'traveling-players')
  })

  test('does not offer move when cannot move food', () => {
    const card = res.getCardById('roastmaster-e166')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.canMoveFood = () => false

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => true

    const offerRoastmasterMove = jest.fn()
    game.actions.offerRoastmasterMove = offerRoastmasterMove

    card.onAction(game, dennis, 'traveling-players')

    expect(offerRoastmasterMove).not.toHaveBeenCalled()
  })

  test('does not offer move when cannot place animals', () => {
    const card = res.getCardById('roastmaster-e166')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.canMoveFood = () => true

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => false

    const offerRoastmasterMove = jest.fn()
    game.actions.offerRoastmasterMove = offerRoastmasterMove

    card.onAction(game, dennis, 'traveling-players')

    expect(offerRoastmasterMove).not.toHaveBeenCalled()
  })

  test('does not offer move for other actions', () => {
    const card = res.getCardById('roastmaster-e166')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerRoastmasterMove = jest.fn()
    game.actions.offerRoastmasterMove = offerRoastmasterMove

    card.onAction(game, dennis, 'forest')

    expect(offerRoastmasterMove).not.toHaveBeenCalled()
  })
})
