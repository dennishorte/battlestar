Error.stackTraceLimit = 100

const {
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')

const t = require('./testutil.js')


describe('Magic', () => {

  test('game creation', () => {
    const game = t.fixture()
    const request1 = game.run()
    // If no errors thrown, success.
  })

  test('deck selection', () => {
    const game = t.fixtureDecksSelected()
    // If no errors, decks were selected successfully.
  })

  test('draw 7 action', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw 7' })

    t.testBoard(game, {
      dennis: {
        hand: [
          'Plains',
          'Plains',
          'Benalish Hero',
          'White Knight',
          'Advance Scout',
          'Tithe',
          'Holy Strength',
        ],
      },
    })
  })

})
