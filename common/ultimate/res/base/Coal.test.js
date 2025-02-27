Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Coal', () => {
  test('dogma, with splay', () => {
    const game = t.fixtureTopCard('Coal')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'blue', ['Alchemy', 'Calendar', 'Tools'])
      t.setDeckTop(game, 'base', 5, ['The Pirate Code'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Coal')
    const result3 = t.choose(game, result2, 'red')
    const result4 = t.choose(game, result3, 'blue')

    expect(t.cards(game, 'blue')).toStrictEqual(['Tools'])
    expect(t.cards(game, 'score').sort()).toStrictEqual(['Alchemy', 'Calendar'])
    expect(t.cards(game, 'red')).toStrictEqual(['Coal', 'The Pirate Code'])
    expect(t.zone(game, 'red').splay).toStrictEqual('right')
  })

  test('dogma: choose not to score', () => {
    const game = t.fixtureTopCard('Coal')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'blue', ['Alchemy', 'Calendar', 'Tools'])
      t.setDeckTop(game, 'base', 5, ['The Pirate Code'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Coal')
    const result3 = t.choose(game, result2, 'red')
    const result4 = t.choose(game, result3)

    expect(t.cards(game, 'blue')).toStrictEqual(['Alchemy', 'Calendar', 'Tools'])
    expect(t.cards(game, 'red')).toStrictEqual(['Coal', 'The Pirate Code'])
    expect(t.zone(game, 'red').splay).toStrictEqual('right')
  })

})
