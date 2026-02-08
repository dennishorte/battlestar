const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Stockman (OccD 168)', () => {
  test('gives 1 cattle when building 2nd stable', () => {
    const card = res.getCardById('stockman-d168')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()

    card.onBuildStable(game, dennis, 2)

    expect(dennis.addAnimals).toHaveBeenCalledWith('cattle', 1)
  })

  test('gives 1 boar when building 3rd stable', () => {
    const card = res.getCardById('stockman-d168')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()

    card.onBuildStable(game, dennis, 3)

    expect(dennis.addAnimals).toHaveBeenCalledWith('boar', 1)
  })

  test('gives 1 sheep when building 4th stable', () => {
    const card = res.getCardById('stockman-d168')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()

    card.onBuildStable(game, dennis, 4)

    expect(dennis.addAnimals).toHaveBeenCalledWith('sheep', 1)
  })

  test('does not give animal when building 1st stable', () => {
    const card = res.getCardById('stockman-d168')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()

    card.onBuildStable(game, dennis, 1)

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })

  test('does not give animal when building 5th stable', () => {
    const card = res.getCardById('stockman-d168')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()

    card.onBuildStable(game, dennis, 5)

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })

  test('does not give animal when cannot place', () => {
    const card = res.getCardById('stockman-d168')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => false
    dennis.addAnimals = jest.fn()

    card.onBuildStable(game, dennis, 2)

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })
})
