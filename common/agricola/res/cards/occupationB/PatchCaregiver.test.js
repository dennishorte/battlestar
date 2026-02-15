const t = require('../../../testutil_v2.js')

describe('Patch Caregiver', () => {
  test('onPlay buy 1 grain for 1 food', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['patch-caregiver-b113'],
        food: 3,
        grain: 0,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Patch Caregiver')
    t.choose(game, 'Buy 1 grain for 1 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['patch-caregiver-b113'],
        food: 2,
        grain: 1,
      },
    })
  })

  test('onPlay buy 1 vegetable for 3 food', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['patch-caregiver-b113'],
        food: 5,
        vegetables: 0,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Patch Caregiver')
    t.choose(game, 'Buy 1 vegetable for 3 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['patch-caregiver-b113'],
        food: 2,
        vegetables: 1,
      },
    })
  })

  test('onPlay Skip does not buy', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['patch-caregiver-b113'],
        food: 3,
        grain: 0,
        vegetables: 0,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Patch Caregiver')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['patch-caregiver-b113'],
        food: 3,
        grain: 0,
        vegetables: 0,
      },
    })
  })
})
