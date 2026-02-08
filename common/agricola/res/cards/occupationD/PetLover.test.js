const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Pet Lover (OccD 138)', () => {
  test('offers choice when accumulation space has exactly 1 animal', () => {
    const card = res.getCardById('pet-lover-d138')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.getAccumulatedAnimalCount = () => 1
    game.actions = { offerPetLoverChoice: jest.fn() }

    card.onAction(game, dennis, 'take-sheep')

    expect(game.actions.offerPetLoverChoice).toHaveBeenCalledWith(dennis, card, 'take-sheep')
  })

  test('does not offer choice when accumulation space has more than 1 animal', () => {
    const card = res.getCardById('pet-lover-d138')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.getAccumulatedAnimalCount = () => 2
    game.actions = { offerPetLoverChoice: jest.fn() }

    card.onAction(game, dennis, 'take-sheep')

    expect(game.actions.offerPetLoverChoice).not.toHaveBeenCalled()
  })

  test('does not offer choice when accumulation space has 0 animals', () => {
    const card = res.getCardById('pet-lover-d138')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.getAccumulatedAnimalCount = () => 0
    game.actions = { offerPetLoverChoice: jest.fn() }

    card.onAction(game, dennis, 'take-sheep')

    expect(game.actions.offerPetLoverChoice).not.toHaveBeenCalled()
  })
})
