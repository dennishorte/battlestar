const t = require('../../../testutil_v2.js')

describe("Fisherman's Friend", () => {
  // Card text: "At the start of each round, if there is more food on
  // 'Traveling Players' than on 'Fishing', you get the difference."
  // Traveling Players only available in 4+ player games.

  test('gives food when Traveling Players has more food than Fishing', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['fishermans-friend-c159'],
        food: 0,
      },
      micah: { food: 10 },
      scott: { food: 10 },
      eliya: { food: 10 },
    })
    game.testSetBreakpoint('replenish-complete', (g) => {
      g.state.actionSpaces['traveling-players'].accumulated = 4
      g.state.actionSpaces['fishing'].accumulated = 1
    })
    game.run()

    // onRoundStart: Traveling Players (4) - Fishing (1) = 3 food
    const dennis = game.players.byName('dennis')
    expect(dennis.food).toBe(3)
  })

  test('gives nothing when Fishing has more food than Traveling Players', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['fishermans-friend-c159'],
        food: 0,
      },
      micah: { food: 10 },
      scott: { food: 10 },
      eliya: { food: 10 },
    })
    game.testSetBreakpoint('replenish-complete', (g) => {
      g.state.actionSpaces['traveling-players'].accumulated = 1
      g.state.actionSpaces['fishing'].accumulated = 3
    })
    game.run()

    // Fishing (3) >= Traveling Players (1) → no food
    const dennis = game.players.byName('dennis')
    expect(dennis.food).toBe(0)
  })

  test('gives nothing when both have equal food', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['fishermans-friend-c159'],
        food: 0,
      },
      micah: { food: 10 },
      scott: { food: 10 },
      eliya: { food: 10 },
    })
    game.testSetBreakpoint('replenish-complete', (g) => {
      g.state.actionSpaces['traveling-players'].accumulated = 2
      g.state.actionSpaces['fishing'].accumulated = 2
    })
    game.run()

    // Equal → no food
    const dennis = game.players.byName('dennis')
    expect(dennis.food).toBe(0)
  })
})
