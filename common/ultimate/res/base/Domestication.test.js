Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Domestication', () => {
  test('choose a card and draw a 1', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Domestication'],
        hand: ['Experimentation', 'Statistics'],
      },
      decks: {
        base: {
          1: ['Sailing']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Domestication')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Domestication'],
        blue: ['Experimentation'],
        hand: ['Statistics', 'Sailing'],
      },
    })
  })

  test('even if no card to meld still draws a card', () => {
    const game = t.fixtureTopCard('Domestication')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', [])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Domestication')

    const dennis = game.getPlayerByName('dennis')
    const dennisHand = game.getZoneByPlayer(dennis, 'hand').cards().map(c => c.age).sort()
    expect(dennisHand).toStrictEqual([1])
  })
})
