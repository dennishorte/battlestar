const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Fir Cutter (E116)', () => {
  test('gives 1 food on play', () => {
    const card = res.getCardById('fir-cutter-e116')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'food') {
        dennis.food += amount
      }
    })

    card.onPlay(game, dennis)

    expect(dennis.addResource).toHaveBeenCalledWith('food', 1)
  })

  test('gives 1 wood when using animal accumulation space with 1st person', () => {
    const card = res.getCardById('fir-cutter-e116')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.isAnimalAccumulationSpace = () => true

    const dennis = t.player(game)
    dennis.getPersonPlacedThisRound = () => 1
    dennis.addResource = jest.fn()

    card.onAction(game, dennis, 'sheep-market')

    expect(dennis.addResource).toHaveBeenCalledWith('wood', 1)
  })

  test('gives 2 wood when using animal accumulation space with 3rd person', () => {
    const card = res.getCardById('fir-cutter-e116')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.isAnimalAccumulationSpace = () => true

    const dennis = t.player(game)
    dennis.getPersonPlacedThisRound = () => 3
    dennis.addResource = jest.fn()

    card.onAction(game, dennis, 'sheep-market')

    expect(dennis.addResource).toHaveBeenCalledWith('wood', 2)
  })

  test('gives 3 wood when using animal accumulation space with 5th person', () => {
    const card = res.getCardById('fir-cutter-e116')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.isAnimalAccumulationSpace = () => true

    const dennis = t.player(game)
    dennis.getPersonPlacedThisRound = () => 5
    dennis.addResource = jest.fn()

    card.onAction(game, dennis, 'sheep-market')

    expect(dennis.addResource).toHaveBeenCalledWith('wood', 3)
  })

  test('does not give wood on non-animal accumulation space', () => {
    const card = res.getCardById('fir-cutter-e116')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.isAnimalAccumulationSpace = () => false

    const dennis = t.player(game)
    dennis.getPersonPlacedThisRound = () => 1
    dennis.addResource = jest.fn()

    card.onAction(game, dennis, 'forest')

    expect(dennis.addResource).not.toHaveBeenCalled()
  })
})
