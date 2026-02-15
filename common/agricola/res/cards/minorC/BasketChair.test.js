const t = require('../../../testutil_v2.js')

describe('Basket Chair', () => {
  test('play BasketChair — move first person — first action freed — bonus turn', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['basket-chair-c022'],
        reed: 1,
      },
    })
    game.run()

    // Dennis turn 1: take Forest
    t.choose(game, 'Forest')
    // Micah turn 1
    t.choose(game, 'Day Laborer')
    // Dennis turn 2: play Basket Chair via Meeting Place
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Basket Chair')
    // BasketChair onPlay: move first person?
    t.choose(game, 'Move first person to Basket Chair')

    // Bonus turn: Dennis gets to place on a different action
    t.choose(game, 'Clay Pit')

    // Micah turn 2 — Forest is freed so Micah can take it
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['basket-chair-c022'],
        food: 1, // Meeting Place gives 1 food
        wood: 3, // from Forest (kept even though space freed)
        clay: 1, // from Clay Pit (bonus turn)
      },
    })
  })

  test('decline move — no bonus turn', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['basket-chair-c022'],
        reed: 1,
      },
    })
    game.run()

    // Dennis turn 1
    t.choose(game, 'Forest')
    // Micah turn 1
    t.choose(game, 'Day Laborer')
    // Dennis turn 2: play Basket Chair
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Basket Chair')
    // Decline
    t.choose(game, 'No')

    // Micah turn 2 (no bonus turn for Dennis)
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['basket-chair-c022'],
        food: 1, // Meeting Place gives 1 food
        wood: 3, // Forest once
      },
    })
  })

  test('no first action yet — effect does not trigger', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['basket-chair-c022'],
      },
    })
    // Card already played — onPlay won't fire again
    game.run()

    // Normal turns — no bonus turn since onPlay doesn't fire
    t.choose(game, 'Forest')
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['basket-chair-c022'],
        wood: 3,
        clay: 1,
      },
    })
  })
})
