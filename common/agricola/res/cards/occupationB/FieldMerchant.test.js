const t = require('../../../testutil_v2.js')

describe('Field Merchant', () => {
  test('onPlay gives 1 wood and 1 reed', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: { hand: ['field-merchant-b103'] },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Field Merchant')

    t.testBoard(game, {
      dennis: {
        occupations: ['field-merchant-b103'],
        wood: 1,
        reed: 1,
      },
    })
  })
})
