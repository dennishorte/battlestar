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

})


describe('Magic Actions', () => {

  test('cascade action', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'cascade', x: 2 })

    t.testBoard(game, {
      dennis: {
        stack: ['benalish hero'],
      },
    })
  })

  test('create token', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, {
      name: 'create token',
      data: {
        name: 'Elf Warrior',
        annotation: '1/1',
        count: 1,
        zoneId: 'players.dennis.creatures',
      },
    })

    t.testBoard(game, {
      dennis: {
        creatures: ['Elf Warrior'],
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

  test('import card', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, {
      name: 'import card',
      data: {
        count: 1,
        card: game.cardLookupFunc({ name: 'White Knight' }),
        isToken: true,
        zoneId: 'players.dennis.command',
      },
    })
    const request3 = t.do(game, request2, { name: 'draw' })

    t.testBoard(game, {
      dennis: {
        command: ['white knight'],
        hand: ['white knight'],
      }
    })
  })

  test('move card', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
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

  test('reveal next', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'reveal next', zoneId: 'players.dennis.library' })

    const libraryCards = game.getCardsByZone(t.dennis(game), 'library')
    t.testVisibility(libraryCards[0], 'dennis', 'micah')
    t.testVisibility(libraryCards[1])

    const request3 = t.do(game, request2, { name: 'reveal next', zoneId: 'players.dennis.library' })
    const libraryCards2 = game.getCardsByZone(t.dennis(game), 'library')
    t.testVisibility(libraryCards2[0], 'dennis', 'micah')
    t.testVisibility(libraryCards2[1], 'dennis', 'micah')
    t.testVisibility(libraryCards2[2])
  })

  test('view next', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'view next', zoneId: 'players.dennis.library' })

    const libraryCards = game.getCardsByZone(t.dennis(game), 'library')
    t.testVisibility(libraryCards[0], 'dennis')
    t.testVisibility(libraryCards[1])

    const request3 = t.do(game, request2, { name: 'view next', zoneId: 'players.dennis.library' })
    const libraryCards2 = game.getCardsByZone(t.dennis(game), 'library')
    t.testVisibility(libraryCards2[0], 'dennis')
    t.testVisibility(libraryCards2[1], 'dennis')
    t.testVisibility(libraryCards2[2])
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
