const t = require('../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

// Helper: play through action phase with leadership+diplomacy
// Both use strategy cards then pass. Handles diplomacy system choice + secondaries.
function playThroughActionPhase(game) {
  t.choose(game, 'Strategic Action')  // dennis: leadership (auto)
  t.choose(game, 'Pass')             // micah declines leadership secondary
  t.choose(game, 'Strategic Action')  // micah: diplomacy (needs system choice)
  t.choose(game, 'hacan-home')        // micah picks system
  t.choose(game, 'Pass')             // dennis declines diplomacy secondary
  t.choose(game, 'Pass')              // dennis passes
  t.choose(game, 'Pass')              // micah passes
}

describe('Status Phase Step Tracker', () => {
  test('statusPhaseStep is set during redistribute and cleared after status phase', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        units: {
          'sol-home': {
            'jord': ['space-dock'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Play through action phase to reach status phase
    playThroughActionPhase(game)

    // Game is now paused in status phase at redistribute step
    expect(game.state.statusPhaseStep).toBe('redistribute')

    // Complete redistribute for both players
    t.choose(game, 'Done')  // dennis
    t.choose(game, 'Done')  // micah

    // After status phase, statusPhaseStep should be cleared
    expect(game.state.statusPhaseStep).toBeUndefined()
    expect(game.state.round).toBe(2)
  })
})
