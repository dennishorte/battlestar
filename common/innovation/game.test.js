Error.stackTraceLimit = 100

const Game = require('./game.js')

function _deepLog(obj) {
  console.log(JSON.stringify(obj, null, 2))
}

describe('new game', () => {
  test('creates', () => {
    const lobby = {
      game: 'Innovation',
      name: 'Test Lobby',
      options: {
        expansions: ['base game']
      },
      users: [
        { _id: 0, name: 'dennis' },
        { _id: 1, name: 'micah' },
        { _id: 2, name: 'tom' },
      ],
    }

    const game = Game.factory(lobby)
    game.run()
    expect(game.getTransition()).toBeDefined()
  })
})
