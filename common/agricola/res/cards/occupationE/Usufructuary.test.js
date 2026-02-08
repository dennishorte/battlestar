const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Usufructuary (E157)', () => {
  test('gives food for other occupations when this is 1st occupation', () => {
    const card = res.getCardById('usufructuary-e157')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.getTotalOccupationsInPlay = () => 5 // 4 others + this one

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 1
    dennis.food = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'food') {
        dennis.food += amount
      }
    })

    card.onPlay(game, dennis)

    expect(dennis.addResource).toHaveBeenCalledWith('food', 4)
  })

  test('caps food at 7', () => {
    const card = res.getCardById('usufructuary-e157')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.getTotalOccupationsInPlay = () => 10 // 9 others + this one

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 1
    dennis.addResource = jest.fn()

    card.onPlay(game, dennis)

    expect(dennis.addResource).toHaveBeenCalledWith('food', 7)
  })

  test('does not give food when this is not 1st occupation', () => {
    const card = res.getCardById('usufructuary-e157')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.getTotalOccupationsInPlay = () => 5

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 2
    dennis.addResource = jest.fn()

    card.onPlay(game, dennis)

    expect(dennis.addResource).not.toHaveBeenCalled()
  })

  test('gives no food when no other occupations', () => {
    const card = res.getCardById('usufructuary-e157')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.getTotalOccupationsInPlay = () => 1 // Just this one

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 1
    dennis.addResource = jest.fn()

    card.onPlay(game, dennis)

    expect(dennis.addResource).not.toHaveBeenCalled()
  })
})
