'use strict'

const t = require('../../../testutil.js')
const card = require('./shadow-alliance.js')

// Helper: drive end-of-round prompts until game ends or stops on
// endgame intrigue prompt. Conflict resolution + makers + recall fire,
// then VP-threshold (10+) triggers endgame intrigue offer.
function driveToEndgameIntrigue(game) {
  let safety = 80
  while (game.waiting && !game.gameOver && safety-- > 0) {
    const choices = t.currentChoices(game)
    if (choices.includes('Shadow Alliance')) {
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

describe("shadow-alliance", () => {
  test('data', () => {
    expect(card.id).toBe("shadow-alliance")
    expect(card.name).toBe("Shadow Alliance")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.vpsAvailable).toBe(1)
  })

  test('endgame: +1 VP when player has 4+ influence on a track held by an opponent', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        vp: 10,
        intrigue: ['Shadow Alliance'],
        influence: { fremen: 4 },
      },
      // Micah holds the Fremen alliance
      alliances: { fremen: 'micah' },
    })
    game.run()

    driveToEndgameIntrigue(game)
    expect(t.currentChoices(game)).toContain('Shadow Alliance')

    const beforeVp = game.players.byName('dennis').vp
    t.choose(game, 'Shadow Alliance')
    expect(game.players.byName('dennis').vp).toBe(beforeVp + 1)
  })

  test('endgame: no VP when player holds the alliance themselves', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        vp: 10,
        intrigue: ['Shadow Alliance'],
        influence: { fremen: 4 },
      },
      alliances: { fremen: 'dennis' },
    })
    game.run()

    driveToEndgameIntrigue(game)
    expect(t.currentChoices(game)).toContain('Shadow Alliance')
    const beforeVp = game.players.byName('dennis').vp
    t.choose(game, 'Shadow Alliance')
    expect(game.players.byName('dennis').vp).toBe(beforeVp)
  })

  test('endgame: no VP when player has only 3 influence', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        vp: 10,
        intrigue: ['Shadow Alliance'],
        influence: { fremen: 3 },
      },
      alliances: { fremen: 'micah' },
    })
    game.run()

    driveToEndgameIntrigue(game)
    expect(t.currentChoices(game)).toContain('Shadow Alliance')
    const beforeVp = game.players.byName('dennis').vp
    t.choose(game, 'Shadow Alliance')
    expect(game.players.byName('dennis').vp).toBe(beforeVp)
  })
})
