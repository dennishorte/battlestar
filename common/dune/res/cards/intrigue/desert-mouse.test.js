'use strict'

const t = require('../../../testutil.js')
const card = require('./desert-mouse.js')

function driveToEndgameIntrigue(game) {
  let safety = 80
  while (game.waiting && !game.gameOver && safety-- > 0) {
    const choices = t.currentChoices(game)
    const title = game.waiting.selectors[0]?.title || ''
    if (title === 'Play an Endgame Intrigue card?' && choices.includes('Desert Mouse')) {
      return
    }
    if (choices.includes('Pass')) {
      t.choose(game, 'Pass')
    }
    else if (choices.includes('Reveal Turn')) {
      t.choose(game, 'Reveal Turn')
    }
    else {
      t.choose(game, choices[0])
    }
  }
}

describe("desert-mouse", () => {
  test('data', () => {
    expect(card.id).toBe("desert-mouse")
    expect(card.name).toBe("Desert Mouse")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.vpsAvailable).toBe(1)
    expect(card.hasBattleIcons).toBe(true)
  })

  test('plot: +1 Spice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Desert Mouse'], spice: 0 },
    })
    game.run()

    expect(t.currentChoices(game)).toContain('Desert Mouse')
    t.choose(game, 'Desert Mouse')

    expect(game.players.byName('dennis').spice).toBe(1)
    const discard = game.zones.byId('common.intrigueDiscard').cardlist()
    expect(discard.some(c => c.name === 'Desert Mouse')).toBe(true)
  })

  test('endgame: flips a face-up Desert Mouse won-card -> +1 VP', () => {
    const game = t.fixture()
    const wonCard = { id: 'won-1', name: 'Mock Conflict', battleIcon: 'desert-mouse' }
    t.setBoard(game, {
      dennis: {
        vp: 10,
        intrigue: ['Desert Mouse'],
      },
      conflict: {
        wonCards: { dennis: [wonCard] },
        flippedCardIds: { dennis: [] },
      },
    })
    game.run()

    driveToEndgameIntrigue(game)
    expect(t.currentChoices(game)).toContain('Desert Mouse')
    const beforeVp = game.players.byName('dennis').vp
    t.choose(game, 'Desert Mouse')

    expect(game.players.byName('dennis').vp).toBe(beforeVp + 1)
    expect(game.state.conflict.flippedCardIds.dennis).toContain('won-1')
  })

  test('endgame: a wild battle icon is also flippable for VP', () => {
    const game = t.fixture()
    const wonCard = { id: 'won-2', name: 'Mock Wild', battleIcon: 'wild' }
    t.setBoard(game, {
      dennis: {
        vp: 10,
        intrigue: ['Desert Mouse'],
      },
      conflict: {
        wonCards: { dennis: [wonCard] },
        flippedCardIds: { dennis: [] },
      },
    })
    game.run()

    driveToEndgameIntrigue(game)
    const beforeVp = game.players.byName('dennis').vp
    t.choose(game, 'Desert Mouse')
    expect(game.players.byName('dennis').vp).toBe(beforeVp + 1)
  })

  test('endgame: no VP when no flippable Desert Mouse/wild card', () => {
    const game = t.fixture()
    const wonCard = { id: 'won-3', name: 'Mock Crysknife', battleIcon: 'crysknife' }
    t.setBoard(game, {
      dennis: {
        vp: 10,
        intrigue: ['Desert Mouse'],
      },
      conflict: {
        wonCards: { dennis: [wonCard] },
        flippedCardIds: { dennis: [] },
      },
    })
    game.run()

    driveToEndgameIntrigue(game)
    const beforeVp = game.players.byName('dennis').vp
    t.choose(game, 'Desert Mouse')
    expect(game.players.byName('dennis').vp).toBe(beforeVp)
  })
})
