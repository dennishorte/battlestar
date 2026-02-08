const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Pig Stalker (OccD 165)', () => {
  test('gives 1 boar when using animal accumulation space with adjacent worker', () => {
    const card = res.getCardById('pig-stalker-d165')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.occupiesActionSpace = () => true
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()
    game.isAnimalAccumulationSpace = () => true
    game.getVerticallyAdjacentActionSpaces = () => ['some-adjacent-space']

    card.onAction(game, dennis, 'take-sheep')

    expect(dennis.addAnimals).toHaveBeenCalledWith('boar', 1)
  })

  test('does not give boar when no worker on adjacent space', () => {
    const card = res.getCardById('pig-stalker-d165')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.occupiesActionSpace = () => false
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()
    game.isAnimalAccumulationSpace = () => true
    game.getVerticallyAdjacentActionSpaces = () => ['some-adjacent-space']

    card.onAction(game, dennis, 'take-sheep')

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })

  test('does not give boar when cannot place animals', () => {
    const card = res.getCardById('pig-stalker-d165')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.occupiesActionSpace = () => true
    dennis.canPlaceAnimals = () => false
    dennis.addAnimals = jest.fn()
    game.isAnimalAccumulationSpace = () => true
    game.getVerticallyAdjacentActionSpaces = () => ['some-adjacent-space']

    card.onAction(game, dennis, 'take-sheep')

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })

  test('does not trigger for non-animal accumulation spaces', () => {
    const card = res.getCardById('pig-stalker-d165')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.occupiesActionSpace = () => true
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()
    game.isAnimalAccumulationSpace = () => false

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })
})
