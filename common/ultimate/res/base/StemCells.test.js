Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Stem Cells', () => {
  test('no cards in hand', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Stem Cells'],
      },
    })
    let request
    request = game.run()
    t.choose(game, request, 'Dogma.Stem Cells')
    // Just looking for no errors.
  })

  test('cards in hand, yes', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Stem Cells'],
        hand: ['Reformation', 'Experimentation'],
      },
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Stem Cells')
    request = t.choose(game, request, 'yes')
    request = t.choose(game, request, 'auto')

    expect(t.cards(game, 'score').sort()).toEqual(['Experimentation', 'Reformation'])
  })

  test('cards in hand, no', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Stem Cells'],
        hand: ['Reformation', 'Experimentation'],
      },
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Stem Cells')
    t.choose(game, request, 'no')

    expect(t.cards(game, 'score')).toEqual([])
  })
})
