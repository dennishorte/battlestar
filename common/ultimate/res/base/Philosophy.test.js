Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Philosophy', () => {

  describe('You may splay left any one color of your cards.', () => {
    test('choose a color', () => {
      const game = t.fixtureFirstPlayer()
      t.setBoard(game, {
        dennis: {
          purple: ['Philosophy'],
          red: ['Construction', 'Industrialization'],
        },
      })
      let request
      request = game.run()
      request = t.choose(game, 'Dogma.Philosophy')
      t.choose(game, 'red')

      const red = game.zones.byPlayer(t.dennis(game), 'red')
      expect(red.splay).toBe('left')
    })

    test('do not choose a color', () => {
      const game = t.fixtureFirstPlayer()
      t.setBoard(game, {
        dennis: {
          purple: ['Philosophy'],
          red: ['Construction', 'Industrialization'],
        },
      })
      let request
      request = game.run()
      request = t.choose(game, 'Dogma.Philosophy')
      t.choose(game)

      const red = game.zones.byPlayer(t.dennis(game), 'red')
      expect(red.splay).toBe('none')
    })
  })

  describe('You may score a card from your hand', () => {
    test('return a card', () => {
      const game = t.fixtureFirstPlayer()
      t.setBoard(game, {
        dennis: {
          purple: ['Philosophy'],
          hand: ['Construction', 'Industrialization'],
        },
      })
      let request
      request = game.run()
      request = t.choose(game, 'Dogma.Philosophy')
      t.choose(game, 'Industrialization')

      const score = game.zones.byPlayer(t.dennis(game), 'score').cardlist().map(c => c.name)
      expect(score).toEqual(['Industrialization'])
    })

    test('do not return a card', () => {
      const game = t.fixtureFirstPlayer()
      t.setBoard(game, {
        dennis: {
          purple: ['Philosophy'],
          hand: ['Construction', 'Industrialization'],
        },
      })
      let request
      request = game.run()
      request = t.choose(game, 'Dogma.Philosophy')
      t.choose(game)

      const score = game.zones.byPlayer(t.dennis(game), 'score').cardlist().map(c => c.name)
      expect(score).toEqual([])
    })
  })
})
