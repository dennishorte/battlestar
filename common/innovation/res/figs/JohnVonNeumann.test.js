Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('John Von Neumann', () => {
  describe('echo', () => {
    test('first is purple', () => {
      const game = t.fixtureDogma('John Von Neumann', { expansions: [ 'base', 'figs' ] })
      t.setHand(game, 'micah', ['Oars'])
      t.topDeck(game, 'base', 9, ['Services', 'Fission'])
      game.run()

      t.dogma(game, 'John Von Neumann')

      expect(game.getHand('micah').cards).toStrictEqual(['Oars'])
    })

    test('second is purple', () => {
      const game = t.fixtureDogma('John Von Neumann', { expansions: [ 'base', 'figs' ] })
      t.setHand(game, 'micah', ['Oars'])
      t.topDeck(game, 'base', 9, ['Fission', 'Services'])
      game.run()

      t.dogma(game, 'John Von Neumann')

      expect(game.getHand('micah').cards).toStrictEqual(['Oars'])
    })

    test('no purple', () => {
      const game = t.fixtureDogma('John Von Neumann', { expansions: [ 'base', 'figs' ] })
      t.setHand(game, 'micah', ['Oars'])
      t.topDeck(game, 'base', 9, ['Computers', 'Fission'])
      game.run()

      t.dogma(game, 'John Von Neumann')

      expect(game.getHand('micah').cards.sort()).toStrictEqual(['Computers', 'Fission', 'Oars'])
    })
  })

  describe('karma', () => {
    test('When you meld', () => {
      const game = t.fixtureFirstPicks({ expansions: ['base', 'figs'] })
      t.setHand(game, 'micah', ['John Von Neumann'])
      t.setColor(game, 'micah', 'green', ['Fu Xi'])
      t.setColor(game, 'tom', 'purple', ['Sinuhe', 'Homer'])
      game.run()

      t.meld(game, 'John Von Neumann')

      expect(game.getZoneColorByPlayer('tom', 'purple').cards).toStrictEqual(['Homer'])
      expect(game.getZoneColorByPlayer('micah', 'green').cards).toStrictEqual(['Fu Xi'])
    })

    test('Each card in hand', () => {
      const game = t.fixtureDogma('John Von Neumann', { expansions: [ 'base', 'figs' ] })
      t.setHand(game, 'micah', ['Oars', 'Writing'])
      t.setColor(game, 'micah', 'green', ['Databases'])
      game.run()

      const biscuits = game.getBiscuits('micah')
      expect(biscuits.board.i).toBe(5)
      expect(biscuits.final.i).toBe(9)
    })
  })
})
