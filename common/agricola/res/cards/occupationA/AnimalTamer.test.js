const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Animal Tamer (OccA 086)', () => {
  test('offers choice of wood or grain on play', () => {
    const card = res.getCardById('animal-tamer-a086')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerResourceChoice: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerResourceChoice).toHaveBeenCalledWith(dennis, card, ['wood', 'grain'])
  })

  test('modifies house animal capacity to equal room count', () => {
    const card = res.getCardById('animal-tamer-a086')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getRoomCount = () => 3

    const capacity = card.modifyHouseAnimalCapacity(dennis)

    expect(capacity).toBe(3)
  })

  test('modifies house animal capacity with 2 rooms', () => {
    const card = res.getCardById('animal-tamer-a086')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getRoomCount = () => 2

    const capacity = card.modifyHouseAnimalCapacity(dennis)

    expect(capacity).toBe(2)
  })
})
