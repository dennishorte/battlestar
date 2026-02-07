const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Rammed Clay (A016)', () => {
  test('gives 1 clay on play', () => {
    const game = t.fixture({ cardSets: ['minorA'] })
    t.setBoard(game, {
      dennis: {
        clay: 0,
        hand: ['rammed-clay-a016'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'rammed-clay-a016')

    const dennis = t.player(game)
    expect(dennis.clay).toBe(1)
  })

  test('has modifyFenceCost with alternateResource', () => {
    const card = res.getCardById('rammed-clay-a016')
    const result = card.modifyFenceCost()
    expect(result.alternateResource).toBe('clay')
  })
})
