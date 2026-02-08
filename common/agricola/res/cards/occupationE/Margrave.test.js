const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Margrave (E154)', () => {
  test('gives 2 food when any player renovates if owner lives in stone house', () => {
    const card = res.getCardById('margrave-e154')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')

    dennis.roomType = 'stone'
    dennis.food = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'food') {
        dennis.food += amount
      }
    })

    card.onAnyRenovate(game, micah, dennis)

    expect(dennis.addResource).toHaveBeenCalledWith('food', 2)
  })

  test('does not give food when owner does not live in stone house', () => {
    const card = res.getCardById('margrave-e154')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')

    dennis.roomType = 'clay'
    dennis.addResource = jest.fn()

    card.onAnyRenovate(game, micah, dennis)

    expect(dennis.addResource).not.toHaveBeenCalled()
  })

  test('gives end game points for players with wood or clay houses when owner has stone', () => {
    const card = res.getCardById('margrave-e154')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')

    dennis.roomType = 'stone'
    micah.roomType = 'wood'

    const points = card.getEndGamePoints(dennis, game)

    expect(points).toBe(1)
  })

  test('gives no end game points when owner does not have stone house', () => {
    const card = res.getCardById('margrave-e154')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')

    dennis.roomType = 'clay'
    micah.roomType = 'wood'

    const points = card.getEndGamePoints(dennis, game)

    expect(points).toBe(0)
  })
})
