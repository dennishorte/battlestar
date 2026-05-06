'use strict'

const t = require('../../../testutil.js')
const card = require('./crysknife.js')

const SKIRMISH_CRYSKNIFE = require('../conflict/conflict-skirmish-crysknife.js')
const SKIRMISH_DESERT_MOUSE = require('../conflict/conflict-skirmish-desert-mouse.js')
const SKIRMISH_WILD = require('../conflict/conflict-skirmish-5.js')

function finishUntilGameOver(game, opts = {}) {
  const playIntrigue = !!opts.playIntrigue
  let safety = 300
  while (game.waiting && !game.gameOver && safety-- > 0) {
    const choices = t.currentChoices(game)
    const title = game.waiting.selectors[0]?.title || ''
    if (playIntrigue && title.includes('Endgame Intrigue')) {
      const nonPass = choices.find(c => c !== 'Pass')
      if (nonPass) {
        t.choose(game, nonPass)
        continue
      }
    }
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

describe("crysknife", () => {
  test('data', () => {
    expect(card.id).toBe("crysknife")
    expect(card.name).toBe("Crysknife")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.hasBattleIcons).toBe(true)
    expect(card.vpsAvailable).toBe(1)
  })

  test('plot: +1 Spice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Crysknife'], spice: 0 },
    })
    game.run()

    t.choose(game, 'Crysknife')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(1)
  })

  test('endgame: flips a Crysknife-icon conflict card for +1 VP', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Crysknife'],
        vp: 10,
      },
      conflict: {
        wonCards: { dennis: [SKIRMISH_CRYSKNIFE, SKIRMISH_DESERT_MOUSE] },
        flippedCardIds: { dennis: [] },
      },
    })
    game.run()

    // Drive to endgame intrigue prompt
    let safety = 200
    while (game.waiting && safety-- > 0) {
      const choices = t.currentChoices(game)
      const title = game.waiting.selectors[0]?.title || ''
      if (title.includes('Endgame Intrigue') && choices.includes('Crysknife')) {
        break
      }
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

    expect(t.currentChoices(game)).toContain('Crysknife')
    const before = game.players.byName('dennis').vp
    t.choose(game, 'Crysknife')

    const flipped = game.state.conflict.flippedCardIds.dennis
    expect(flipped).toContain(SKIRMISH_CRYSKNIFE.id)
    expect(flipped).not.toContain(SKIRMISH_DESERT_MOUSE.id)

    finishUntilGameOver(game, { playIntrigue: true })
    const after = game.players.byName('dennis').vp
    expect(after).toBe(before + 1)
  })

  test('endgame: flips a wild-icon conflict card', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Crysknife'],
        vp: 10,
      },
      conflict: {
        wonCards: { dennis: [SKIRMISH_WILD] },
        flippedCardIds: { dennis: [] },
      },
    })
    game.run()

    let safety = 200
    while (game.waiting && safety-- > 0) {
      const choices = t.currentChoices(game)
      const title = game.waiting.selectors[0]?.title || ''
      if (title.includes('Endgame Intrigue') && choices.includes('Crysknife')) {
        break
      }
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

    expect(t.currentChoices(game)).toContain('Crysknife')
    t.choose(game, 'Crysknife')

    expect(game.state.conflict.flippedCardIds.dennis).toContain(SKIRMISH_WILD.id)
  })

  test('endgame: no flippable card means no VP gained', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Crysknife'],
        vp: 10,
      },
      conflict: {
        wonCards: { dennis: [SKIRMISH_DESERT_MOUSE] },
        flippedCardIds: { dennis: [] },
      },
    })
    game.run()

    let safety = 200
    while (game.waiting && safety-- > 0) {
      const choices = t.currentChoices(game)
      const title = game.waiting.selectors[0]?.title || ''
      if (title.includes('Endgame Intrigue') && choices.includes('Crysknife')) {
        break
      }
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

    expect(t.currentChoices(game)).toContain('Crysknife')
    const before = game.players.byName('dennis').vp
    t.choose(game, 'Crysknife')
    finishUntilGameOver(game, { playIntrigue: true })
    const after = game.players.byName('dennis').vp
    expect(after).toBe(before)
    expect(game.state.conflict.flippedCardIds.dennis).toEqual([])
  })
})
