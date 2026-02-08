const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Chimney Sweep (OccD 154)', () => {
  test('reduces stone renovation cost by 2', () => {
    const card = res.getCardById('chimney-sweep-d154')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const cost = { stone: 5, reed: 1 }

    const modifiedCost = card.modifyRenovationCost(dennis, cost, 'stone')

    expect(modifiedCost.stone).toBe(3)
    expect(modifiedCost.reed).toBe(1)
  })

  test('does not reduce stone below 0', () => {
    const card = res.getCardById('chimney-sweep-d154')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const cost = { stone: 1, reed: 1 }

    const modifiedCost = card.modifyRenovationCost(dennis, cost, 'stone')

    expect(modifiedCost.stone).toBe(0)
  })

  test('does not modify cost for clay renovation', () => {
    const card = res.getCardById('chimney-sweep-d154')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const cost = { clay: 5, reed: 1 }

    const modifiedCost = card.modifyRenovationCost(dennis, cost, 'clay')

    expect(modifiedCost).toEqual(cost)
  })

  test('gives 1 bonus point per other player in stone house', () => {
    const card = res.getCardById('chimney-sweep-d154')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.roomType = 'wood'
    micah.roomType = 'stone'

    const points = card.getEndGamePoints(dennis, game)

    expect(points).toBe(1)
  })

  test('gives 0 bonus points if no other player in stone house', () => {
    const card = res.getCardById('chimney-sweep-d154')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.roomType = 'stone'
    micah.roomType = 'clay'

    const points = card.getEndGamePoints(dennis, game)

    expect(points).toBe(0)
  })
})
