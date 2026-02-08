const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Game Catcher (C165)', () => {
  test('gives cattle and boar when player can pay and place animals', () => {
    const card = res.getCardById('game-catcher-c165')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 5
    dennis.removeResource = jest.fn()
    dennis.addAnimals = jest.fn()
    dennis.canPlaceAnimals = () => true
    game.getRemainingHarvestCount = () => 3
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.removeResource).toHaveBeenCalledWith('food', 3)
    expect(dennis.addAnimals).toHaveBeenCalledWith('cattle', 1)
    expect(dennis.addAnimals).toHaveBeenCalledWith('boar', 1)
  })

  test('does not give animals when player lacks food', () => {
    const card = res.getCardById('game-catcher-c165')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    dennis.removeResource = jest.fn()
    dennis.addAnimals = jest.fn()
    dennis.canPlaceAnimals = () => true
    game.getRemainingHarvestCount = () => 3

    card.onPlay(game, dennis)

    expect(dennis.removeResource).not.toHaveBeenCalled()
    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })

  test('does not give animals when player cannot place cattle', () => {
    const card = res.getCardById('game-catcher-c165')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 5
    dennis.removeResource = jest.fn()
    dennis.addAnimals = jest.fn()
    dennis.canPlaceAnimals = (type) => type !== 'cattle'
    game.getRemainingHarvestCount = () => 3

    card.onPlay(game, dennis)

    expect(dennis.removeResource).not.toHaveBeenCalled()
    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })

  test('does not give animals when player cannot place boar', () => {
    const card = res.getCardById('game-catcher-c165')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 5
    dennis.removeResource = jest.fn()
    dennis.addAnimals = jest.fn()
    dennis.canPlaceAnimals = (type) => type !== 'boar'
    game.getRemainingHarvestCount = () => 3

    card.onPlay(game, dennis)

    expect(dennis.removeResource).not.toHaveBeenCalled()
    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })
})
