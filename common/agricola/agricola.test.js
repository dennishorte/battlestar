Error.stackTraceLimit = 100

const {
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')

const t = require('./testutil.js')

describe.skip('fixture', () => {
  test('game is created', () => {
    const game = t.fixture()
  })

  test('game can initialize', () => {
    const game = t.fixture()
    game.run()
  })
})

describe.skip('draft', () => {
  test('draft disabled', () => {
    const game = t.fixture({ draft: false })
    game.run()

    expect(game.state.phase).toEqual('main')
  })

  test.skip('draft enabled', () => {
    const game = t.fixture({ draft: true })
    game.run()

    expect(game.state.phase).toEqual('draft')
  })
})
