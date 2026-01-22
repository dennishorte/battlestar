Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Coal', () => {
  test('dogma, with splay', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Coal'],
        blue: ['Alchemy', 'Calendar', 'Tools'],
      },
      decks: {
        base: {
          5: ['The Pirate Code'],
        },
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, 'Dogma.Coal')
    const result3 = t.choose(game, 'red')
    const result4 = t.choose(game, 'blue')

    expect(t.cards(game, 'blue')).toEqual(['Tools'])
    expect(t.cards(game, 'score').sort()).toEqual(['Alchemy', 'Calendar'])
    expect(t.cards(game, 'red')).toEqual(['Coal', 'The Pirate Code'])
    expect(t.zone(game, 'red').splay).toEqual('right')
  })

  test('dogma: choose not to score', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Coal'],
        blue: ['Alchemy', 'Calendar', 'Tools'],
      },
      decks: {
        base: {
          5: ['The Pirate Code'],
        },
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, 'Dogma.Coal')
    const result3 = t.choose(game, 'red')
    const result4 = t.choose(game)

    expect(t.cards(game, 'blue')).toEqual(['Alchemy', 'Calendar', 'Tools'])
    expect(t.cards(game, 'red')).toEqual(['Coal', 'The Pirate Code'])
    expect(t.zone(game, 'red').splay).toEqual('right')
  })

})
