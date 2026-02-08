const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Pasture Master (B168)', () => {
  test('gives additional animal in each pasture with stable on renovate', () => {
    const card = res.getCardById('pasture-master-b168')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getPasturesWithStable = jest.fn().mockReturnValue([
      { animalType: 'sheep' },
      { animalType: 'cattle' },
    ])
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(true)
    dennis.addAnimals = jest.fn()

    card.onRenovate(game, dennis)

    expect(dennis.addAnimals).toHaveBeenCalledWith('sheep', 1)
    expect(dennis.addAnimals).toHaveBeenCalledWith('cattle', 1)
  })

  test('does not add animals when pasture has no animals', () => {
    const card = res.getCardById('pasture-master-b168')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getPasturesWithStable = jest.fn().mockReturnValue([
      { animalType: null },
    ])
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(true)
    dennis.addAnimals = jest.fn()

    card.onRenovate(game, dennis)

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })

  test('does not add animals when cannot place them', () => {
    const card = res.getCardById('pasture-master-b168')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getPasturesWithStable = jest.fn().mockReturnValue([
      { animalType: 'sheep' },
    ])
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(false)
    dennis.addAnimals = jest.fn()

    card.onRenovate(game, dennis)

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })
})
