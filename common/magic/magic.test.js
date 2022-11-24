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

  test('adjust life', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, {
      name: 'adjust counter',
      counter: 'life',
      amount: -2,
    })

    t.testBoard(game, {
      dennis: {
        life: 18,
      },
    })
  })

  test('draw action', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })

    t.testBoard(game, {
      dennis: {
        hand: ['white knight'],
      },
    })
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

  test('move card', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].id,
      destId: 'players.dennis.creatures',
      destIndex: 0,
    })

    t.testBoard(game, {
      dennis: {
        creatures: ['White Knight'],
      },
    })
  })

  test('mulligan', () => {
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

  test('view next', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'view next', zoneId: 'players.dennis.library' })

    const libraryCards = game.getCardsByZone(t.dennis(game), 'library')
    t.testVisibility(libraryCards[0], 'dennis')
    t.testVisibility(libraryCards[1])

    const request3 = t.do(game, request2, { name: 'view next', zoneId: 'players.dennis.library' })
    t.testVisibility(libraryCards[0], 'dennis')
    t.testVisibility(libraryCards[1], 'dennis')
    t.testVisibility(libraryCards[2])
  })

  test('view top k', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, {
      name: 'view top k',
      zoneId: 'players.dennis.library',
      count: 2,
    })

    const libraryCards = game.getCardsByZone(t.dennis(game), 'library')
    t.testVisibility(libraryCards[0], 'dennis')
    t.testVisibility(libraryCards[1], 'dennis')
    t.testVisibility(libraryCards[2])
  })

})
