const t = require('../testutil')

// Helper: complete the current round by revealing + passing for all players.
// Stops when game.state.round advances past startRound or game ends.
function completeRound(game) {
  const startRound = game.state.round
  let safety = 50
  while (game.waiting && !game.gameOver && game.state.round === startRound && safety-- > 0) {
    const choices = t.currentChoices(game)
    if (choices.includes('Reveal Turn')) {
      t.choose(game, 'Reveal Turn')
    }
    else if (choices.includes('Pass')) {
      t.choose(game, 'Pass')
    }
    else {
      t.choose(game, choices[0])
    }
  }
}

describe('Recall and Endgame', () => {

  test('first player marker passes clockwise each round', () => {
    const game = t.fixture()
    game.run()

    expect(game.state.round).toBe(1)
    expect(game.waiting.selectors[0].actor).toBe('dennis')

    completeRound(game)

    expect(game.state.round).toBe(2)
    expect(game.waiting.selectors[0].actor).toBe('micah')
  })

  test('endgame triggers at 10 VP', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { vp: 10 },
    })
    game.run()

    completeRound(game)

    expect(game.gameOver).toBe(true)
    expect(game.gameOverData.player).toBe('dennis')
  })

  test('endgame tiebreaker: most spice wins', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { vp: 10, spice: 3, solari: 0 },
      micah: { vp: 10, spice: 5, solari: 0 },
    })
    game.run()

    completeRound(game)

    expect(game.gameOver).toBe(true)
    // Tied at 10 VP, micah has more spice
    expect(game.gameOverData.player).toBe('micah')
  })
})
