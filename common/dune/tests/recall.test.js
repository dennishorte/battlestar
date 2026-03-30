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

  test('endgame triggers when conflict deck empty', () => {
    const game = t.fixture()
    // Use breakpoint to empty conflict deck before main loop
    game.testSetBreakpoint('initialization-complete', (g) => {
      const deck = g.zones.byId('common.conflictDeck')
      const trash = g.zones.byId('common.trash')
      // Keep only 1 card (round 1 will reveal it, leaving deck empty)
      const cards = deck.cardlist()
      for (let i = 1; i < cards.length; i++) {
        cards[i].moveTo(trash)
      }
    })
    game.run()

    // After round 1 start, 1 card revealed from deck → deck now empty
    expect(game.zones.byId('common.conflictDeck').cardlist().length).toBe(0)

    // Complete round 1 — endgame should trigger in recall phase
    completeRound(game)

    expect(game.gameOver).toBe(true)
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
