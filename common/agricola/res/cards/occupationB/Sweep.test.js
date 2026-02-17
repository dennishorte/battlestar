const t = require('../../../testutil_v2.js')

describe('Sweep', () => {
  // Card text: "Each time before you use the action space card left of the
  // card that has been most recently placed on a round space, you get 2 clay."
  // "Left" = the round before the current round. Most recently revealed = current round.
  // So it triggers when you use the action at round (currentRound - 1).
  // Card is 1+ players.

  test('using action space from round before current round gives 2 clay', () => {
    // actionSpaces: GU = round 1, SM = round 2, Fencing = round 3. Game plays round 3.
    // Left of round 3 = round 2 = Sheep Market.
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sweep-b120'],
      },
    })
    game.run()

    // Using Sheep Market (round 2) triggers Sweep
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        clay: 2,  // from Sweep
        animals: { sheep: 1 },
        pet: 'sheep',
        occupations: ['sweep-b120'],
      },
    })
  })

  test('using action from current round does not trigger', () => {
    // actionSpaces: GU = round 1, SM = round 2, Fencing = round 3, MI = round 4.
    // Game plays round 4. Left of round 4 = round 3 = Fencing.
    // Using GU (round 1) should NOT trigger.
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sweep-b120'],
      },
    })
    game.run()

    // Grain Utilization (round 1) — not the left-of-current-round
    t.choose(game, 'Grain Utilization')
    // No fields/grain — auto-skips

    t.testBoard(game, {
      dennis: {
        clay: 0,  // Sweep did not trigger
        occupations: ['sweep-b120'],
      },
    })
  })

  test('using action from 2 rounds before does not trigger', () => {
    // actionSpaces: GU = round 1, SM = round 2, Fencing = round 3. Game plays round 3.
    // Left of round 3 = round 2. Using round 1 (GU) should NOT trigger.
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sweep-b120'],
      },
    })
    game.run()

    // Grain Utilization (round 1) — 2 rounds before current (round 3)
    t.choose(game, 'Grain Utilization')

    t.testBoard(game, {
      dennis: {
        clay: 0,  // Sweep did not trigger
        occupations: ['sweep-b120'],
      },
    })
  })

  test('does not trigger on base actions', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sweep-b120'],
      },
    })
    game.run()

    // Day Laborer is a base action with no round assignment
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,
        clay: 0,
        occupations: ['sweep-b120'],
      },
    })
  })
})
