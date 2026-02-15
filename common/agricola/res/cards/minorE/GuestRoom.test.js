const t = require('../../../testutil_v2.js')

describe('Guest Room', () => {
  test('store food on play — use guest worker after normal workers exhausted', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['guest-room-e022'],
        wood: 4,
        reed: 1,
        food: 3,
      },
    })
    game.run()

    // Dennis turn 1: play Guest Room via Meeting Place
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Guest Room')
    // onPlay: place food on card
    t.choose(game, 'Place 3 food')

    // Micah turn 1
    t.choose(game, 'Day Laborer')
    // Dennis turn 2
    t.choose(game, 'Forest')

    // Micah turn 2
    t.choose(game, 'Clay Pit')

    // Dennis has 0 workers left — Guest Room offered
    t.choose(game, 'Use Guest Room (1 food from card)')
    // Guest worker takes an action
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['guest-room-e022'],
        food: 1, // Meeting Place gives 1 food, 3 placed on card
        wood: 3, // 4 - 4 (cost) + 3 (Forest)
        grain: 1,
      },
    })
  })

  test('once per round — not offered again', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['guest-room-e022'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('guest-room-e022').food = 3
    })
    game.run()

    // Dennis turn 1
    t.choose(game, 'Forest')
    // Micah turn 1
    t.choose(game, 'Day Laborer')
    // Dennis turn 2
    t.choose(game, 'Clay Pit')
    // Micah turn 2
    t.choose(game, 'Meeting Place')

    // Dennis 0 workers — use Guest Room
    t.choose(game, 'Use Guest Room (1 food from card)')
    t.choose(game, 'Grain Seeds')

    // After Guest Room used, work phase should end — not offered again
    // (Micah has 0 workers too, so loop ends)

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['guest-room-e022'],
        wood: 3,
        clay: 1,
        grain: 1,
      },
    })
  })

  test('no food on card — not offered', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['guest-room-e022'],
      },
    })
    // Card state has no food
    game.run()

    // Dennis turn 1
    t.choose(game, 'Forest')
    // Micah turn 1
    t.choose(game, 'Day Laborer')
    // Dennis turn 2
    t.choose(game, 'Clay Pit')
    // Micah turn 2 (no Guest Room offered to Dennis)
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['guest-room-e022'],
        wood: 3,
        clay: 1,
      },
    })
  })
})
