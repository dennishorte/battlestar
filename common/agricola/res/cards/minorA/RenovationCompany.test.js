const t = require('../../../testutil_v2.js')

describe('Renovation Company', () => {
  test('gives 3 clay and offers free renovation via Meeting Place', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['renovation-company-a013'],
        wood: 4, // card cost
      },
    })
    game.run()

    // Dennis takes Meeting Place, plays Renovation Company from hand
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Renovation Company')
    // onPlay fires: gets 3 clay, then offer free renovation (wood→clay)
    t.choose(game, 'Renovate from wood to clay for free')

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 from Meeting Place
        clay: 3, // 3 from onPlay (spent 0 on free renovation)
        roomType: 'clay',
        hand: [],
        minorImprovements: ['renovation-company-a013'],
      },
    })
  })

  test('can skip the free renovation', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['renovation-company-a013'],
        wood: 4,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Renovation Company')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 1,
        clay: 3,
        roomType: 'wood',
        hand: [],
        minorImprovements: ['renovation-company-a013'],
      },
    })
  })
})
