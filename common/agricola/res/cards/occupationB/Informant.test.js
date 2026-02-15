const t = require('../../../testutil_v2.js')

describe('Informant', () => {
  // Card text: "After each work phase, if you have more stone than clay
  // in your supply, you get 1 wood."
  // Uses onWorkPhaseEnd. Card is 1+ players.

  test('gives 1 wood when more stone than clay', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['informant-b117'],
        stone: 2,
        clay: 0,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        stone: 2,
        clay: 0,
        wood: 1,  // from Informant
        food: 2,
        grain: 1,
        occupations: ['informant-b117'],
      },
    })
  })

  test('does not trigger when clay >= stone', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['informant-b117'],
        stone: 1,
        clay: 1,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        stone: 1,
        clay: 1,
        wood: 0,  // no Informant bonus
        food: 2,
        grain: 1,
        occupations: ['informant-b117'],
      },
    })
  })
})
