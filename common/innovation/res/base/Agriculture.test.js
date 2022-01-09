Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Agriculture', () => {
  test('return a card', () => {
    const game = t.fixtureDogma('Agriculture')
    game.run()
    t.dogma(game, 'Agriculture')
    game.submit({
      actor: 'micah',
      name: 'Choose Cards',
      option: ['Writing']
    })

    expect(game.getScore('micah')).toBe(2)
  })

  test('do not return a card', () => {
    const game = t.fixtureDogma('Agriculture')
    game.run()
    t.dogma(game, 'Agriculture')
    game.submit({
      actor: 'micah',
      name: 'Choose Cards',
      option: []
    })

    expect(game.getScore('micah')).toBe(0)
  })
})
