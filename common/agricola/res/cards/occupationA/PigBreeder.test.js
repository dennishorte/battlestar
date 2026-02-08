const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Pig Breeder (OccA 165)', () => {
  test('gives 1 boar on play when player can place it', () => {
    const card = res.getCardById('pig-breeder-a165')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()

    card.onPlay(game, dennis)

    expect(dennis.addAnimals).toHaveBeenCalledWith('boar', 1)
  })

  test('does not give boar when cannot place', () => {
    const card = res.getCardById('pig-breeder-a165')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => false
    dennis.addAnimals = jest.fn()

    card.onPlay(game, dennis)

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })

  test('breeds boar at end of round 12 with 2+ boar and room', () => {
    const card = res.getCardById('pig-breeder-a165')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getTotalAnimals = () => 2
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()

    card.onRoundEnd(game, dennis, 12)

    expect(dennis.addAnimals).toHaveBeenCalledWith('boar', 1)
  })

  test('does not breed in other rounds', () => {
    const card = res.getCardById('pig-breeder-a165')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getTotalAnimals = () => 2
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()

    card.onRoundEnd(game, dennis, 11)

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })

  test('does not breed with fewer than 2 boar', () => {
    const card = res.getCardById('pig-breeder-a165')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getTotalAnimals = () => 1
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()

    card.onRoundEnd(game, dennis, 12)

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })

  test('does not breed when cannot place more boar', () => {
    const card = res.getCardById('pig-breeder-a165')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getTotalAnimals = () => 3
    dennis.canPlaceAnimals = () => false
    dennis.addAnimals = jest.fn()

    card.onRoundEnd(game, dennis, 12)

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })
})
