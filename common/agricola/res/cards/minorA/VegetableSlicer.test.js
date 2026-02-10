const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Vegetable Slicer', () => {
  test('gives 2 wood and 1 vegetable on fireplace upgrade', () => {
    const card = res.getCardById('vegetable-slicer-a041')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['vegetable-slicer-a041'],
      },
    })
    game.run()

    const dennis = t.dennis(game)
    card.onUpgradeFireplace(game, dennis)

    expect(dennis.wood).toBe(2)
    expect(dennis.vegetables).toBe(1)
  })

  test('stacks on multiple upgrades', () => {
    const card = res.getCardById('vegetable-slicer-a041')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['vegetable-slicer-a041'],
      },
    })
    game.run()

    const dennis = t.dennis(game)
    card.onUpgradeFireplace(game, dennis)
    card.onUpgradeFireplace(game, dennis)

    expect(dennis.wood).toBe(4)
    expect(dennis.vegetables).toBe(2)
  })
})
