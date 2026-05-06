'use strict'

const t = require('../../../testutil.js')
const card = require('./secure-spice-trade.js')

function driveToEndgameIntrigue(game) {
  let safety = 80
  while (safety-- > 0 && game.waiting) {
    const choices = t.currentChoices(game)
    if (choices.includes('Secure Spice Trade') && game.state.phase !== 'player-turns') {
      return true
    }
    if (choices.includes('Reveal Turn')) {
      t.choose(game, 'Reveal Turn')
    }
    else if (choices.includes('Pass')) {
      t.choose(game, 'Pass')
    }
    else {
      break
    }
  }
  return false
}

describe("secure-spice-trade", () => {
  test('data', () => {
    expect(card.id).toBe("secure-spice-trade")
    expect(card.name).toBe("Secure Spice Trade")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('endgame: 2+ TSMF → +1 VP and +2 Spice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Secure Spice Trade'],
        vp: 10,
        spice: 0,
        reserveAcquired: { 'The Spice Must Flow': 2 },
      },
    })
    game.run()
    expect(driveToEndgameIntrigue(game)).toBe(true)
    t.choose(game, 'Secure Spice Trade')

    const dennis = game.players.byName('dennis')
    // vp=10 was set; TSMF in discard each grant +1 VP via passive (zone scan)
    // — but in this engine TSMF only grants VP on acquisition, not for cards
    // already in zones. So vp stays at 10 + 1 from card = 11.
    expect(dennis.vp).toBe(11)
    expect(dennis.spice).toBe(2)
  })

  test('endgame: only 1 TSMF → no effect', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Secure Spice Trade'],
        vp: 10,
        spice: 0,
        reserveAcquired: { 'The Spice Must Flow': 1 },
      },
    })
    game.run()
    expect(driveToEndgameIntrigue(game)).toBe(true)
    t.choose(game, 'Secure Spice Trade')

    const dennis = game.players.byName('dennis')
    expect(dennis.vp).toBe(10)
    expect(dennis.spice).toBe(0)
  })
})
