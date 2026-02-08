const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Pet Grower (OccD 164)', () => {
  test('gives 1 sheep when using animal accumulation space with no animals in house', () => {
    const card = res.getCardById('pet-grower-d164')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getAnimalsInHouse = () => 0
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()
    game.isAnimalAccumulationSpace = () => true

    card.onAction(game, dennis, 'take-sheep')

    expect(dennis.addAnimals).toHaveBeenCalledWith('sheep', 1)
  })

  test('does not give sheep when player has animals in house', () => {
    const card = res.getCardById('pet-grower-d164')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getAnimalsInHouse = () => 1
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()
    game.isAnimalAccumulationSpace = () => true

    card.onAction(game, dennis, 'take-sheep')

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })

  test('does not give sheep when player cannot place animals', () => {
    const card = res.getCardById('pet-grower-d164')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getAnimalsInHouse = () => 0
    dennis.canPlaceAnimals = () => false
    dennis.addAnimals = jest.fn()
    game.isAnimalAccumulationSpace = () => true

    card.onAction(game, dennis, 'take-sheep')

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })

  test('does not trigger for non-animal accumulation spaces', () => {
    const card = res.getCardById('pet-grower-d164')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getAnimalsInHouse = () => 0
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()
    game.isAnimalAccumulationSpace = () => false

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })
})
