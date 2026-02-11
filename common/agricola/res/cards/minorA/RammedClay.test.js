const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Rammed Clay', () => {
  test('gives 1 clay on play via Meeting Place', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['rammed-clay-a016'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Rammed Clay')

    t.testBoard(game, {
      dennis: {
        food: 1,
        clay: 1,
        hand: [],
        minorImprovements: ['rammed-clay-a016'],
      },
    })
  })

  test('modifyFenceCost allows clay as alternate resource', () => {
    const card = res.getCardById('rammed-clay-a016')
    expect(card.modifyFenceCost()).toEqual({ wood: 1, alternateResource: 'clay' })
  })
})
