const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Rammed Clay', () => {
  test('gives 1 clay on play', () => {
    const card = res.getCardById('rammed-clay-a016')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['rammed-clay-a016'],
      },
    })
    game.run()

    const dennis = t.dennis(game)
    card.onPlay(game, dennis)

    t.testBoard(game, {
      dennis: {
        clay: 1,
        minorImprovements: ['rammed-clay-a016'],
      },
    })
  })

  test('has modifyFenceCost with alternateResource', () => {
    const card = res.getCardById('rammed-clay-a016')
    const result = card.modifyFenceCost()
    expect(result.alternateResource).toBe('clay')
  })
})
