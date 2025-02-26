Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Stem Cells', () => {
  test('no cards in hand', () => {
    const game = t.fixtureTopCard('Stem Cells')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', [])
    })
    const request1 = game.run()
    t.choose(game, request1, 'Dogma.Stem Cells')
    // Just looking for no errors.
  })

  test('cards in hand, yes', () => {
    const game = t.fixtureTopCard('Stem Cells')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Reformation', 'Experimentation'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Stem Cells')
    const request3 = t.choose(game, request2, 'yes')
    const request4 = t.choose(game, request3, 'auto')

    expect(t.cards(game, 'score').sort()).toStrictEqual(['Experimentation', 'Reformation'])
  })

  test('cards in hand, no', () => {
    const game = t.fixtureTopCard('Stem Cells')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Reformation', 'Experimentation'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Stem Cells')
    t.choose(game, request2, 'no')

      expect(t.cards(game, 'score')).toStrictEqual([])
    })
  })
