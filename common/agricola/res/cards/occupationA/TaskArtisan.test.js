const t = require('../../../testutil_v2.js')

describe('Task Artisan', () => {
  test('onPlay grants 1 wood and offers minor improvement action', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        hand: ['task-artisan-a096'],
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Task Artisan')
    // buyMinorImprovement will auto-skip if no minor improvements in hand

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['task-artisan-a096'],
        wood: 1, // 1 wood from onPlay
      },
    })
  })

  test('onStoneActionRevealed grants 1 wood and offers minor improvement when stone space revealed', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })

    // Set up so that take-stone-1 (Western Quarry) is revealed at round 1
    game.testSetBreakpoint('initialization-complete', () => {
      const deck = game.state.roundCardDeck
      const idx = deck.findIndex(c => c.id === 'take-stone-1')
      ;[deck[0], deck[idx]] = [deck[idx], deck[0]]
    })

    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['task-artisan-a096'],
        wood: 0,
      },
    })
    game.run()

    // buyMinorImprovement will auto-skip if no minor improvements in hand
    // Take an action to proceed
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        occupations: ['task-artisan-a096'],
        wood: 1, // 1 wood from onStoneActionRevealed
        food: 2, // 2 from Day Laborer
      },
    })
  })

  test('does not trigger for non-stone action revealed', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })

    // Ensure a non-stone card is revealed (stage 1 cards are never stone)
    game.testSetBreakpoint('initialization-complete', () => {
      const deck = game.state.roundCardDeck
      const stageOneIdx = deck.findIndex(c => c.stage === 1 && c.id !== 'take-stone-1' && c.id !== 'take-stone-2')
      ;[deck[0], deck[stageOneIdx]] = [deck[stageOneIdx], deck[0]]
    })

    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['task-artisan-a096'],
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        occupations: ['task-artisan-a096'],
        wood: 0, // No wood from onStoneActionRevealed (not a stone space)
        food: 2, // 2 from Day Laborer
      },
    })
  })
})
