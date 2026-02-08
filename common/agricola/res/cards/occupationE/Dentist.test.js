const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Dentist (E110)', () => {
  test('initializes wood to 0 on play', () => {
    const card = res.getCardById('dentist-e110')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(card.wood).toBe(0)
  })

  test('offers to place wood at harvest start when player has wood', () => {
    const card = res.getCardById('dentist-e110')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 3

    const offerDentistPlaceWood = jest.fn()
    game.actions.offerDentistPlaceWood = offerDentistPlaceWood

    card.onHarvestStart(game, dennis)

    expect(offerDentistPlaceWood).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer to place wood when player has no wood', () => {
    const card = res.getCardById('dentist-e110')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    const offerDentistPlaceWood = jest.fn()
    game.actions.offerDentistPlaceWood = offerDentistPlaceWood

    card.onHarvestStart(game, dennis)

    expect(offerDentistPlaceWood).not.toHaveBeenCalled()
  })

  test('gives food equal to wood on card during feeding phase', () => {
    const card = res.getCardById('dentist-e110')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.wood = 3

    const dennis = t.player(game)
    dennis.food = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'food') {
        dennis.food += amount
      }
    })

    card.onFeedingPhaseStart(game, dennis)

    expect(dennis.addResource).toHaveBeenCalledWith('food', 3)
  })

  test('gives no food if no wood on card', () => {
    const card = res.getCardById('dentist-e110')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.wood = 0

    const dennis = t.player(game)
    dennis.addResource = jest.fn()

    card.onFeedingPhaseStart(game, dennis)

    expect(dennis.addResource).not.toHaveBeenCalled()
  })
})
