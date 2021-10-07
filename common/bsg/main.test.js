const bsg = require('./main.js')


describe('newGame', () => {

  test('setup', () => {
    const lobby = {
      game: 'BattleStar Galactica',
      name: 'Test Lobby',
      options: {
        expansions: ['base game']
      },
      userIds: [0, 1, 2],
    }
    const game = bsg.factory(lobby)
  })
})
