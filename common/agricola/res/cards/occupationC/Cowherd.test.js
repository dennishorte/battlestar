const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Cowherd (C147)', () => {
  test('gives 1 additional cattle when using take-cattle action', () => {
    const card = res.getCardById('cowherd-c147')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.addAnimals = jest.fn()
    dennis.canPlaceAnimals = () => true
    game.log = { add: jest.fn() }

    card.onAction(game, dennis, 'take-cattle')

    expect(dennis.addAnimals).toHaveBeenCalledWith('cattle', 1)
  })

  test('does not give cattle when player cannot place animals', () => {
    const card = res.getCardById('cowherd-c147')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.addAnimals = jest.fn()
    dennis.canPlaceAnimals = () => false

    card.onAction(game, dennis, 'take-cattle')

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('cowherd-c147')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.addAnimals = jest.fn()
    dennis.canPlaceAnimals = () => true

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })
})
