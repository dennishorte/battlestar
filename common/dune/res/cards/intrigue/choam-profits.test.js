'use strict'

const t = require('../../../testutil.js')
const card = require('./choam-profits.js')

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

describe("choam-profits", () => {
  test('data', () => {
    expect(card.id).toBe("choam-profits")
    expect(card.name).toBe("CHOAM Profits")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.vpsAvailable).toBe(1)
    expect(card.hasContracts).toBe(true)
  })

  test('endgame: with 4+ completed contracts, +1 VP when played', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['CHOAM Profits'],
        contractsCompleted: 4,
        vp: 10,
      },
      // Force a game end by giving dennis enough VP at game end via shieldWall
      // — easiest: set round to last and trigger endgame.
      shieldWall: 0,
    })
    game.run()

    // Run through agent/reveal until endgame intrigue prompt fires.
    let safety = 200
    while (game.waiting && safety-- > 0) {
      const choices = t.currentChoices(game)
      const title = game.waiting.selectors[0]?.title || ''
      if (title.includes('Endgame Intrigue') && choices.includes('CHOAM Profits')) {
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

    expect(t.currentChoices(game)).toContain('CHOAM Profits')
    const before = game.players.byName('dennis').vp
    t.choose(game, 'CHOAM Profits')
    finishUntilGameOver(game, { playIntrigue: true })
    const after = game.players.byName('dennis').vp
    expect(after).toBe(before + 1)
  })

  test('endgame: with fewer than 4 contracts, +1 VP not granted', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['CHOAM Profits'],
        contractsCompleted: 3,
        vp: 10,
      },
    })
    game.run()

    let safety = 200
    while (game.waiting && safety-- > 0) {
      const choices = t.currentChoices(game)
      const title = game.waiting.selectors[0]?.title || ''
      if (title.includes('Endgame Intrigue') && choices.includes('CHOAM Profits')) {
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

    expect(t.currentChoices(game)).toContain('CHOAM Profits')
    const before = game.players.byName('dennis').vp
    t.choose(game, 'CHOAM Profits')
    finishUntilGameOver(game, { playIntrigue: true })
    const after = game.players.byName('dennis').vp
    expect(after).toBe(before)
  })
})
