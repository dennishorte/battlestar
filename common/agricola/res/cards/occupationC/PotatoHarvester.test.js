const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Potato Harvester (C106)', () => {
  test('gives 3 food on play', () => {
    const card = res.getCardById('potato-harvester-c106')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(3)
  })

  test('gives food when harvesting vegetables', () => {
    const card = res.getCardById('potato-harvester-c106')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.log = { add: jest.fn() }

    card.onHarvestVegetable(game, dennis, 4)

    expect(dennis.food).toBe(4)
  })

  test('gives no additional food when no vegetables harvested', () => {
    const card = res.getCardById('potato-harvester-c106')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.log = { add: jest.fn() }

    card.onHarvestVegetable(game, dennis, 0)

    expect(dennis.food).toBe(0)
  })
})
